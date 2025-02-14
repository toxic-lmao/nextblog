import { Button } from "@/components/button";
import { Author } from "@/components/author";
import Link from "next/link";
import Image from "next/image";
import { Like } from "@/components/like";
import { auth } from "@/lib/auth";
import Account from "@/public/images/account.png";

const Card = async ({
  id,
  title,
  image,
  createdAt,
  category,
  slug,
  author,
  likes,
}) => {
  const session = await auth();
  const userId = session?.user.id;
  const isLiked = userId
    ? likes.find((like) => userId === like.userId) !== undefined
    : false;
  const finalImg = author.image ? author.image : Account;

  return (
    <div className="rounded-3xl p-6 border border-gray-600 flex flex-col h-[25rem] lg:h-[28rem] justify-between bg-linear-to-br from-[#191919] from-40% to-transparent">
      <div className="relative h-1/2 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="cursor-pointer object-cover"
        />
      </div>
      <Link href={`/blogs/${category}`} className="text-sm xl:text-base w-max">
        <Button>{category}</Button>
      </Link>
      <h3 className="cursor-pointer text-xl font-medium line-clamp-3 w-10/12">
        <Link
          href={`/${author.slug}/${slug}`}
          className="line-clamp-2 lg:line-clamp-3"
        >
          {title}
        </Link>
      </h3>
      <div className="flex justify-between items-center">
        <Like blogId={id} likes={likes.length} isLiked={isLiked} />
        <Author
          image={finalImg}
          name={author.name}
          slug={author.slug}
          date={createdAt.toISOString()}
          end
        />
      </div>
    </div>
  );
};

export const BlogGrid = ({ blogs }) => {
  return (
    <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 px-4 lg:px-8">
      {blogs.map((blog) => (
        <Card key={blog.id} {...blog} />
      ))}
    </div>
  );
};

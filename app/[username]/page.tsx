import { Button } from "@/components/button";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { BlogGrid } from "@/components/bloggrid";
import { auth } from "@/lib/auth";
import { SquareArrowOutUpRight } from "lucide-react";
import ProfileImg from "@/components/profileimg";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await prisma.user.findUnique({
    where: { slug: username },
    select: {
      name: true,
      role: true,
      slug: true,
      image: true,
      blogs: {
        select: {
          title: true,
          slug: true,
          image: true,
          category: true,
          createdAt: true,
          likes: { select: { blogId: true, userId: true } },
          author: {
            select: { name: true, slug: true, id: true, image: true },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-12">
      <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
        <div className="flex lg:justify-center gap-8 xl:gap-16">
          <div className="relative h-30 w-30 lg:h-36 lg:w-36">
            <ProfileImg
              imageUrl={user.image}
              isAuthor={user.slug === session?.user.slug}
            />
            {session?.user.slug === user.slug && (
              <Link
                href="settings?tab=profile"
                className="text-sm xl:text-base w-max md:hidden absolute left-1/2 -translate-x-1/2 -bottom-2 backdrop-blur-2xl text-[#EEEEEE] font-medium py-1.5 px-3 rounded-xl"
              >
                Edit Profile
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-medium">{user.slug}</h1>
              {session?.user.slug === user.slug && (
                <Link href="settings?tab=profile" className="hidden md:block">
                  <Button>Edit Profile</Button>
                </Link>
              )}
              {session?.user.role === "ADMIN" &&
                session.user.slug === user.slug && (
                  <Link href={`/admin/dashboard`} className="hidden md:block">
                    <Button>
                      <span className="flex items-center gap-1.5">
                        Dashboard <SquareArrowOutUpRight size={18} />
                      </span>
                    </Button>
                  </Link>
                )}
            </div>

            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-rose-300">
                  {user.blogs.length}
                </h1>
                <div>Blogs</div>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-rose-300">
                  {user.blogs.reduce(
                    (sum: number, blog: { _count: { likes: number } }) =>
                      sum + blog._count.likes,
                    0
                  )}
                </h1>
                <div>Likes</div>
              </div>
            </div>

            <div className="flex gap-2 items-center text-lg font-medium text-rose-300">
              {user.name}
              {user.role === "ADMIN" && (
                <span className="text-red-800 text-lg">({user.role})</span>
              )}
            </div>
            {session?.user.role === "ADMIN" &&
              session.user.slug === user.slug && (
                <Link href={`/admin/dashboard`} className="md:hidden">
                  <Button>
                    <span className="flex items-center gap-1">
                      Dashboard <SquareArrowOutUpRight />
                    </span>
                  </Button>
                </Link>
              )}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <hr className="col-span-2 w-full md:w-3/4 border-neutral-700" />
      </div>

      {user.blogs.length > 0 ? (
        <BlogGrid blogs={user.blogs} />
      ) : (
        <div className="flex justify-center items-center min-h-[60vh] text-4xl rounded-4xl w-3/4 mx-auto">
          Currently, this user has no published blogs!
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/db";
import BlogPage from "@/components/blogpage";
import { auth } from "@/lib/auth";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Blog({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const blog = await prisma.blog.findUnique({
    select: {
      title: true,
      slug: true,
      image: true,
      createdAt: true,
      content: true,
      category: true,
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          author: { select: { name: true, image: true, slug: true } },
          content: true,
          createdAt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      },
    },
    where: { slug, author: { slug: username } },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });

  if (!blog) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }
  const { id, role } = session.user;
  const isAuthor = role === "ADMIN" || id === blog.author.id;
  const isLiked = blog.likes.some(
    (like: { userId: string }) => like.userId === id
  );
  const userSlug = session.user.slug;

  return (
    <BlogPage
      blog={blog}
      isAuthor={isAuthor}
      isLiked={isLiked}
      userSlug={userSlug}
    />
  );
}

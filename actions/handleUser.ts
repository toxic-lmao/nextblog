"use server";

import {
  deleteImage,
  deleteImages,
  uploadImage,
  getPublicIdFromUrl,
} from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkProfanity } from "@/utils/checkProfanity";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { permanentRedirect } from "next/navigation";

export const changeProfileImg = async (image: File) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!user) return { success: false, message: "User not found" };

  const publicId = user.image ? getPublicIdFromUrl(user.image, true) : null;
  if (publicId) {
    const result = await deleteImage(publicId);
    if (!result.success) {
      return { success: false, message: "Failed to delete image" };
    }
  }

  const imageUpload = await uploadImage(image, true);
  if (!imageUpload.success) {
    return { success: false, message: imageUpload.result };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { image: imageUpload.result },
  });

  if (result) {
    revalidatePath(`/${session.user.slug}`);
    return { success: true, message: imageUpload.result };
  }

  return { success: false, message: "Failed to update image" };
};

export const removeProfileImg = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!user) return { success: false, message: "User not found" };

  if (user.image) {
    const publicId = getPublicIdFromUrl(user.image, true);
    if (publicId) {
      const result = await deleteImage(publicId);
      if (!result.success) {
        return { success: false, message: "Failed to delete image" };
      }
    }
    await prisma.user.update({
      where: { id },
      data: { image: null },
    });

    revalidatePath(`/${session.user.slug}`);
    return { success: true, message: "Image deleted successfully" };
  }

  return { success: false, message: "No image to delete" };
};

export const changeSlug = async (slug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  if (checkProfanity(slug)) {
    return {
      success: false,
      message: "Inappropriate language used!",
    };
  }

  if (slug === session.user.slug) {
    return {
      success: false,
      message: "New username is the same as the current one",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { slug },
  });

  if (existingUser) {
    return {
      success: false,
      message: "This username is already taken",
    };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { slug },
  });

  if (result) {
    revalidatePath("/settings");
    return { success: true, message: "Username updated successfully!" };
  }

  return { success: false, message: "Failed to update username" };
};

export const changeName = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  if (name === session.user.name) {
    return {
      success: false,
      message: "New name is the same as the current one",
    };
  }

  if (checkProfanity(name)) {
    return {
      success: false,
      message: "Inappropriate language used!",
    };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { name },
  });

  if (result) {
    return { success: true, message: "Display name updated successfully" };
  }

  return { success: false, message: "Failed to update name" };
};

export const removeImages = async (id: string) => {
  try {
    await prisma.$transaction(async (tx: any) => {
      const [blogs, user] = await Promise.all([
        tx.blog.findMany({
          where: { authorId: id },
          select: { id: true, image: true },
        }),
        tx.user.findUnique({
          where: { id },
          select: { image: true },
        }),
      ]);

      const publicIds = blogs
        .map((blog: any) => blog.image && getPublicIdFromUrl(blog.image))
        .filter((id: any): id is string => Boolean(id));

      const userImagePublicId = user?.image
        ? getPublicIdFromUrl(user.image, true)
        : null;
      if (userImagePublicId) publicIds.push(userImagePublicId);

      if (publicIds.length > 0) {
        const deleteResult = await deleteImages(publicIds);
        if (!deleteResult.success) {
          throw new Error("Failed to delete images");
        }
      }
    });
  } catch (error) {
    console.error("Error deleting images:", error);

    return "Failed to delete images";
  }
};

export const newsletterSubscription = async (email: string) => {
  if (!email) {
    return "Email is required";
  }

  return "Subscribed to newsletter";
};

export const removeUser = async (password: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  try {
    await auth.api.deleteUser({
      body: { password },
      headers: await headers(),
    });

    return "Account deletion request sent to your email";
  } catch (error) {
    if (error instanceof APIError) {
      return error.message;
    }

    return "Failed to delete account. Please try again after sometime!";
  }
};

export const deleteUserByAdmin = async (id: string) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });

  return revalidatePath("/admin/dashboard");
};

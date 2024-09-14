'use server';

import { z } from "zod";
import BlogPost, { IBlogPost } from "../models/blog-post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import uploadImage from "../utils/upload-image";
import base64ToBlob from "../utils/base64-to-blob";
import connectMongo from "../utils/connect-mongo";
import deleteImage from "../utils/delete-image";

const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, {message: "Slug is required"}).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Invalid slug format. Slug can only contain lowercase letters, numbers, and hyphens."
  }),
  content: z
    .string()
    .min(50, { message: "Content should be a minimum of 50 characters" }),
  author: z.string().min(1, { message: "Author is required" }),
  coverImage: z
    .instanceof(File)
    .refine((file: File) => file.size !== 0, "Image is required")
    .refine((file: File) => {
      return !file || file.size <= 1024 * 1024 * 5;
    }, "File size must be less than 3MB"),
});

export type BlogPostState = {
  errors?: {
    title?: string[];
    slug?: string[];
    content?: string[];
    author?: string[];
    coverImage?: string[];
  };
  message?: string | null;
};

const CreateBlogPostSchema = BlogPostSchema.omit({ id: true });
export async function createBlogPost(
  prevState: BlogPostState,
  formData: FormData
) {
  const validatedFields = CreateBlogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    author: formData.get("author"),
    coverImage: formData.get("coverImage"),
  });

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { title, slug, content, author, coverImage } = validatedFields.data;

    let coverImageUrl = "";
    let coverImagePublicId = ""
    if (coverImage) {
      const result = await uploadImage(coverImage);
      if (result) {
        const { url, publicId } = result;
        coverImageUrl = url;
        coverImagePublicId = publicId;
      }
    }

    const updatedContent = await uploadImagesToCloudinary(content);

    await connectMongo();
    await BlogPost.create({
      title,
      slug,
      content: updatedContent,
      author,
      coverImage: coverImageUrl,
      coverImagePublicId
    });
  } catch (error) {
    console.error("Error creating track:", error);
    return {
      message: "Error from server: " + error,
    };
  }

  console.log("Revalidating path and redirecting...");
  revalidatePath("/dashboard/blog-manager");
  redirect("/dashboard/blog-manager");
}


const EditBlogPostSchema = BlogPostSchema.omit({ id: true, coverImage: true });
export async function editBlogPost(
  post: IBlogPost,
  prevState: BlogPostState,
  formData: FormData
) {
  const validatedFields = EditBlogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    author: formData.get("author"),
  });

  const coverImage = formData.get("coverImage");

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { title, slug, content, author } = validatedFields.data;

    let uploadResult: { url: string; publicId: string } | null = null;
    if (coverImage instanceof File && coverImage.size > 0) {
      await deleteImage(post.coverImagePublicId);
      uploadResult = await uploadImage(coverImage);
    }

    const updatedContent = await uploadImagesToCloudinary(content);

    await connectMongo();
    await BlogPost.findOneAndUpdate({
      title,
      slug,
      content: updatedContent,
      author,
      coverImage: uploadResult?.url,
      coverImagePublicId: uploadResult?.publicId
    })
  } catch (error) {
    console.error("Error updating blog:", error);
    return {
      message: "Error from server: " + error,
    };
  }

  console.log("Revalidating path and redirecting...");
  revalidatePath("/dashboard/blog-manager");
  redirect("/dashboard/blog-manager");
}

export async function deleteBlogPost(post: IBlogPost) {
  await connectMongo();
  await BlogPost.findByIdAndDelete(post._id.toString());
  await deleteImage(post.coverImagePublicId);

  revalidatePath("/dashboard/blog-manager");
}


async function uploadImagesToCloudinary(content: string) {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let updatedContent = content;

  while ((match = imgRegex.exec(content)) !== null) {
    const imgSrc = match[1];
    if (imgSrc.startsWith("data:image")) {
      const image = base64ToBlob(imgSrc);
      const result = await uploadImage(image);

      if (result) {
        const { url, publicId } = result;

        updatedContent = updatedContent.replace(imgSrc, url);
      }
    }
  }

  return updatedContent;
}

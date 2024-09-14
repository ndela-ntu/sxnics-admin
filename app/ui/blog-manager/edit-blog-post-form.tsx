"use client";

import { BlogPostState, createBlogPost, editBlogPost } from "@/app/lib/blog-actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import "react-quill/dist/quill.snow.css";
import Editor from "./editor";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { IBlogPost } from "@/app/models/blog-post";
import deleteImage from "@/app/utils/delete-image";

export default function EditBlogPostForm({
  blogPost,
}: {
  blogPost: IBlogPost;
}) {
  const [content, setContent] = useState(blogPost.content);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [image, setImage] = useState<File | undefined>(undefined);
  const formStatus = useFormStatus();
  const initialState = { message: null, errors: {} };
  const editBlogPostWithPost = editBlogPost.bind(null, blogPost);
  const [state, dispatch] = useFormState<BlogPostState, FormData>(
    editBlogPostWithPost,
    initialState
  );

  useEffect(() => {
    setContent(blogPost.content);
  }, [blogPost]);

  const handleEditorChange = (
    newContent: string,
    newDeleteImages: string[]
  ) => {
    setContent(newContent);
    setDeletedImages((prev) => [...prev, ...newDeleteImages]);
  };

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form
      action={(formData) => {
        formData.append("content", content);
        console.log(deletedImages);
        deletedImages.forEach(async (image) => {
          const publicId = image.split('/').pop()?.split('.')[0];
          if (publicId) {
           const {success} = await deleteImage(publicId);
           console.log(success)
          }
        })
        dispatch(formData);
      }}
      className="relative h-full space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1>Create Post</h1>
        <div className="flex items-center justify-center">
          <button
            disabled={formStatus.pending}
            type="submit"
            className="btn bg-white text-black"
          >
            Save
          </button>
        </div>
      </div>
      <div className="border-t border-white my-4"></div>
      <div className="flex flex-col w-full">
        <label>Post Title</label>
        <input
          type="text"
          name="title"
          defaultValue={blogPost.title}
          placeholder="Post Title"
          className="input bg-transparent border border-white w-full max-w-xs"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title &&
            state.errors.title.map((error: string, i) => (
              <p key={i} className="text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label>Post Slug</label>
        <input
          type="text"
          name="slug"
          defaultValue={blogPost.slug}
          placeholder="Post Slug"
          className="input bg-transparent border border-white w-full max-w-xs"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.slug &&
            state.errors.slug.map((error: string, i) => (
              <p key={i} className="text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label>Post Author</label>
        <input
          type="text"
          name="author"
          placeholder="Post Author"
          defaultValue={blogPost.author}
          className="input bg-transparent border border-white w-full max-w-xs"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.author &&
            state.errors.author.map((error: string, i) => (
              <p key={i} className="text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col">
        <label>Post Cover Image</label>
        <label className="relative w-64 h-64 stack rounded-lg border flex items-center justify-center cursor-pointer transition-colors overflow-hidden">
          <input
            type="file"
            name="image"
            className="hidden"
            onChange={(e) => {
              setImage(e.target.files![0]);
            }}
            accept="image/*"
          />

          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={image ? URL.createObjectURL(image) : blogPost.coverImage}
              alt="Picked image"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </label>
      </div>
      <div>
        <label>Post Content</label>
        <Editor initialValue={content} onChange={handleEditorChange} />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.content &&
            state.errors.content.map((error: string, i) => (
              <p key={i} className="text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
      </div>
    </form>
  );
}

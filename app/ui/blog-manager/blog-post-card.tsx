import { IBlogPost } from "@/app/models/blog-post";
import Image from "next/image";
import EditPostButton from "./edit-post-button";
import { DeletePostButton } from "./delete-post-button";

export default function BlogPostCard({ post }: { post: IBlogPost }) {
  return (
    <div className="text-white border p-5">
      <h3 className="font-bold text-xl">{post.title}</h3>
      <div className="flex justify-center items-center h-[400px]">
        <div className="relative w-1/2 h-1/2">
          <Image
            src={post.coverImage}
            alt="Description of the image"
            layout="fill"
            objectFit="contain"
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="flex pt-5 space-x-5 items-center justify-center">
        <EditPostButton id={post._id.toString()} />
        <DeletePostButton post={post} />
      </div>
    </div>
  );
}

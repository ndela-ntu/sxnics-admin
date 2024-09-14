import { deleteTrack } from "@/app/lib/audio-actions";
import { deleteBlogPost } from "@/app/lib/blog-actions";
import { IBlogPost } from "@/app/models/blog-post";
import { MdDelete } from "react-icons/md";

export function DeletePostButton({
  post
}: {
  post: IBlogPost
}) {
  const deletePostWithPost = deleteBlogPost.bind(null, post);

  return (
    <form action={deletePostWithPost}>
      <button type="submit" className="btn btn-circle bg-white">
        <MdDelete className="text-black h-6 w-6" />
      </button>
    </form>
  );
}

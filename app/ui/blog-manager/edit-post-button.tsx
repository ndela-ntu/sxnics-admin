"use client";

import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";

export default function EditPostButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`/dashboard/blog-manager/edit-post/${id}`);
      }}
      className="btn btn-circle bg-white"
    >
      <MdEdit className="text-black h-6 w-6" />
    </button>
  );
}

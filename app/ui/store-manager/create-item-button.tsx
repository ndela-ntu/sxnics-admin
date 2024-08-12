'use client';

import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function CreateItemButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/dashboard/store-manager/create-item");
      }}
      className="btn btn-circle bg-white"
    >
      <IoMdAdd className="text-black" />
    </button>
  );
}

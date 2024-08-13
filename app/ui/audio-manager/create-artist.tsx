'use client';

import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function CreateArtistButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/dashboard/audio-manager/create-artist");
      }}
      className="btn btn-circle bg-white"
    >
      <IoMdAdd className="text-black h-6 w-6" />
    </button>
  );
}

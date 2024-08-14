import { deleteTrack } from "@/app/lib/audio-actions";
import { MdDelete } from "react-icons/md";

export function DeleteTrackButton({
  id,
  publicId,
  path,
}: {
  id: string;
  publicId?: string;
  path: string;
}) {
  const deleteTrackWithId = deleteTrack.bind(null, id, path, publicId);

  return (
    <form action={deleteTrackWithId}>
      <button type="submit" className="btn btn-circle bg-white">
        <MdDelete className="text-black h-6 w-6" />
      </button>
    </form>
  );
}

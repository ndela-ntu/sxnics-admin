import { ITrack } from "@/app/models/track";
import Image from "next/image";
import EditTrackButton from "./edit-track-button";
import { DeleteTrackButton } from "./delete-track-button";
import { RxAvatar } from "react-icons/rx";

export default function TrackCard({ track }: { track: ITrack }) {
  return (
    <div className="flex flex-col items-center justify-center text-white border  p-5">
      <div className="flex items-center justify-center w-[200px] h-[200px]">
        {track.imageURL ? (
          <Image
            width={300}
            height={300}
            src={track.imageURL}
            alt="Image of shop item"
          />
        ) : (
          <div>
            <RxAvatar className="text-white w-32 h-32" />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label className="text-xl font-bold">{track.artistName}</label>
        <p>{track.trackName}</p>
      </div>
      <div className="flex pt-5 space-x-5">
        <EditTrackButton id={track._id.toString()} />
        <DeleteTrackButton
          id={track._id.toString()}
          publicId={track.imagePublicId}
          path={track.filePath}
        />
      </div>
    </div>
  );
}

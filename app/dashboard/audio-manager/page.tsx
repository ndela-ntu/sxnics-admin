import Track, { ITrack } from "@/app/models/track";
import CreateTrackButton from "@/app/ui/audio-manager/create-track";
import TrackCard from "@/app/ui/audio-manager/track-card";
import connectMongo from "@/utils/connect-mongo";
import { convertDocumentsToTracks } from "@/utils/convert-to-plain-object";

export default async function Page() {
  await connectMongo();
  const docs = await Track.find();
  const tracks: ITrack[] = convertDocumentsToTracks(docs);

  return (
    <div className="">
      <h1 className="mb-5">Store Manager</h1>
      <div className="flex justify-between">
        <div className="flex items-center w-full space-x-5">
          <label>Filter By</label>
          <input type="search" placeholder="Search for artist..." className="p-2.5 rounded-lg placeholder:text-black" />
        </div>
        <CreateTrackButton />
      </div>
      <div className="border-t border-white my-4"></div>
      <div className="grid grid-cols-4 w-full border">
        {tracks.map(track => <TrackCard key={track._id.toString()} track={track} />)}
      </div>
    </div>
  );
}

import Track, { ITrack } from "@/app/models/track";
import CreateTrackForm from "@/app/ui/audio-manager/create-track-form";
import connectMongo from "@/app/utils/connect-mongo";
import { convertDocumentsToTracks } from "@/app/utils/convert-to-plain-object";
import { getSortedTrackSlots } from "@/app/utils/get-sorted-trackslots";

export default async function Page() {
  await connectMongo();
  const docs = await Track.find();
  const tracks: ITrack[] = convertDocumentsToTracks(docs);
  const sortedTrackSlots = getSortedTrackSlots(tracks);

  return (
    <div className="h-full">
      <CreateTrackForm sortedTrackSlots={sortedTrackSlots} />
    </div>
  );
}

import Track, { ITrack } from "@/app/models/track";
import CreateTrackForm from "@/app/ui/audio-manager/create-track-form";
import connectMongo from "@/utils/connect-mongo";
import { convertDocumentsToTracks } from "@/utils/convert-to-plain-object";
import { getSortedTrackSlots } from "@/utils/get-sorted-trackslots";

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

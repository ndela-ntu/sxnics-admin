import ShopItem, { IShopItem } from "@/app/models/shop-item";
import Track, { ITrack } from "@/app/models/track";
import EditTrackForm from "@/app/ui/audio-manager/edit-track-form";
import EditItemForm from "@/app/ui/store-manager/edit-item-form";
import connectMongo from "@/app/utils/connect-mongo";
import { convertDocumentsToTracks } from "@/app/utils/convert-to-plain-object";
import { getSortedTrackSlots } from "@/app/utils/get-sorted-trackslots";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  await connectMongo();
 
  const docs = await Track.find();
  const tracks: ITrack[] = convertDocumentsToTracks(docs);
  const track: ITrack | undefined = tracks.find(track => track._id.toString() === params.id);
  const sortedTrackSlots = getSortedTrackSlots(tracks);

  if (!track) {
    notFound();
  }

  return (
    <div className="h-full">
      <EditTrackForm track={track} sortedTrackSlots={sortedTrackSlots} />
    </div>
  );
}

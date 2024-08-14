import mongoose, { Schema } from "mongoose";

export interface ITrack {
  _id: mongoose.Schema.Types.ObjectId;
  artistName: string;
  trackName: string;
  filePath: string;
  imageURL?: string;
  imagePublicId?: string;
  trackStarts?: string;
  trackEnds?: string;
}

const TrackSchema = new Schema({
  artistName: { type: String, required: true },
  trackName: { type: String, required: true },
  filePath: { type: String, required: true },
  imageURL: { type: String, required: false },
  imagePublicId: { type: String, required: false},
  trackStarts: { type: String, required: false },
  trackEnds: { type: String, required: false },
});

const Track =
  (mongoose.models && mongoose.models.Track) ||
  mongoose.model("Track", TrackSchema);

export default Track;

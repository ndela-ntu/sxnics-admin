"use server";

import { z } from "zod";
import Track, { ITrack } from "../models/track";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import uploadImage from "../utils/upload-image";
import uploadAudio from "../utils/upload-audio";
import connectMongo from "../utils/connect-mongo";
import deleteAudio from "../utils/delete-audio";
import deleteImage from "../utils/delete-image";

const TrackSchema = z.object({
  id: z.string(),
  artistName: z.string().min(1, { message: "Arist name is required" }),
  trackName: z.string().min(1, { message: "Track name is required" }),
  audio: z
    .instanceof(File)
    .refine((file: File) => file.size !== 0, "Audio is required")
    .refine((file: File) => {
      return !file || file.size <= 1024 * 1024 * 300;
    }, "File size must be less than 300MB"),
  image: z
    .instanceof(File)
    .refine((file: File) => file.size !== 0, "Image is required")
    .refine((file: File) => {
      return !file || file.size <= 1024 * 1024 * 5;
    }, "File size must be less than 3MB"),
  duration: z.number().min(1),
});

export type TrackState = {
  errors?: {
    artistName?: string[];
    trackName?: string[];
    audio?: string[];
  };
  message?: string | null;
};

const CreateTrackSchema = TrackSchema.omit({ id: true, image: true });
export async function createTrack(prevState: TrackState, formData: FormData) {
  const validatedFields = CreateTrackSchema.safeParse({
    artistName: formData.get("artistName"),
    trackName: formData.get("trackName"),
    audio: formData.get("audio"),
    duration: Number(formData.get("duration")),
  });

  const trackStarts = formData.get("trackStarts");
  const trackEnds = formData.get("trackEnds");
  const image = formData.get("image");

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { artistName, trackName, audio, duration } = validatedFields.data;

    let uploadResult: { url: string; publicId: string } | null = null;
    if (image && image instanceof File) {
      console.log("Uploading image...");
      uploadResult = await uploadImage(image);
      console.log("Image uploaded:", uploadResult);
    }

    console.log("Uploading audio...");
    const filePath = await uploadAudio(audio, artistName, trackName);
    console.log("Audio uploaded:", filePath);

    if (filePath) {
      console.log("Connecting to MongoDB...");
      await connectMongo();
      console.log("Connected to MongoDB. Creating track...");

      await Track.create({
        artistName,
        trackName,
        filePath,
        imageURL: uploadResult ? uploadResult.url : null,
        imagePublicId: uploadResult ? uploadResult.publicId : null,
        trackStarts: trackStarts ? trackStarts : null,
        trackEnds: trackEnds ? trackEnds : null,
        duration,
      });

      console.log("Track created successfully.");
    }
  } catch (error) {
    console.error("Error creating track:", error);
    return {
      message: "Error from server: " + error,
    };
  }

  console.log("Revalidating path and redirecting...");
  revalidatePath("/dashboard/audio-manager");
  redirect("/dashboard/audio-manager");
}

export async function deleteTrack(id: string, path: string, publicId?: string) {
  await connectMongo();
  await Track.findByIdAndDelete(id);
  await deleteAudio(path);
  if (publicId) {
    await deleteImage(publicId);
  }

  revalidatePath("/dashboard/audio-manager");
}

const UpdateTrackSchema = TrackSchema.omit({
  id: true,
  image: true,
  audio: true,
  duration: true,
});

export async function updateTrack(
  track: ITrack,
  prevState: TrackState,
  formData: FormData
) {
  const validatedFields = UpdateTrackSchema.safeParse({
    artistName: formData.get("artistName"),
    trackName: formData.get("trackName"),
  });

  const trackStarts = formData.get("trackStarts");
  const trackEnds = formData.get("trackEnds");
  const image = formData.get("image");
  const audio = formData.get("audio");
  const duration = Number(formData.get("duration") || 0);

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { artistName, trackName } = validatedFields.data;

    let uploadResult: { url: string; publicId: string } | null = null;
    if (image instanceof File && image.size > 0) {
      console.log("Deleting image");
      await deleteImage(track.imagePublicId ?? "");
      console.log("Uploading image...");
      uploadResult = await uploadImage(image);
      console.log("Image uploaded:", uploadResult);
    }

    let filePath: string | null = null;
    if (audio instanceof File && audio.size > 0) {
      console.log("Deleting track");
      await deleteAudio(track.filePath);
      console.log("Uploading audio...");
      filePath = await uploadAudio(audio, artistName, trackName);
      console.log("Audio uploaded:", filePath);
    }

    console.log("Connecting to MongoDB...");
    await connectMongo();
    console.log("Connected to MongoDB. Creating track...");

    const resultTrack = await Track.findOneAndUpdate(
      { _id: track._id },
      {
        $set: {
          artistName,
          trackName,
          filePath: filePath ? filePath : track.filePath,
          imageURL: uploadResult ? uploadResult.url : track.imageURL,
          imagePublicId: uploadResult
            ? uploadResult.publicId
            : track.imagePublicId,
          trackStarts: trackStarts ? trackStarts : null,
          trackEnds: trackEnds ? trackEnds : null,
          duration: duration !== 0 ? duration : track.duration,
        },
      },
      { new: true }
    );
    console.log("Update result:", resultTrack);

    console.log("Track created successfully.");
  } catch (error) {
    console.error("Error creating track:", error);
    return {
      message: "Error from server: " + error,
    };
  }

  console.log("Revalidating path and redirecting...");
  revalidatePath("/dashboard/audio-manager");
  redirect("/dashboard/audio-manager");
}

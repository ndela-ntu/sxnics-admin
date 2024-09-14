"use client";

import { ReactNode, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { createTrack, TrackState, updateTrack } from "@/app/lib/audio-actions";
import { ITrack } from "@/app/models/track";
import { TrackDifference } from "@/app/utils/get-sorted-trackslots";
import { formatDateTime, formatDateTimeLocale } from "@/app/utils/format-date";

export default function EditTrackForm({
  sortedTrackSlots,
  track,
}: {
  track: ITrack;
  sortedTrackSlots: TrackDifference[];
}) {
  const formStatus = useFormStatus();

  const [image, setImage] = useState<File | undefined>(undefined);
  const [audio, setAudio] = useState<File | undefined>(undefined);
  const [fromDateTime, setFromDateTime] = useState<Date | null>(
    track.trackStarts ? new Date(Number(track.trackStarts)) : null
  );
  const [toDateTime, setToDateTime] = useState<Date | null>(
    track.trackEnds ? new Date(Number(track.trackEnds)) : null
  );
  const [duration, setDuration] = useState<number | null>(track.duration);

  const initialState = { message: null, errors: {} };
  const editTrackWithTrack = updateTrack.bind(null, track);
  const [state, dispatch] = useFormState<TrackState, FormData>(
    editTrackWithTrack,
    initialState
  );

  let trackImageUrl: string;
  if (track.imageURL) {
    trackImageUrl = track.imageURL;
  } else {
    trackImageUrl = "/user.png";
  }

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form
      action={(formData) => {
        if (fromDateTime && toDateTime) {
          formData.append("trackStarts", fromDateTime.getTime().toString());
          formData.append("trackEnds", toDateTime.getTime().toString());
          formData.delete("dateTimePicker");
        }

        if (duration) {
          formData.append("duration", duration.toString());
        }

        if (image) {
          formData.append("imageEdited", "true");
        } else {
          formData.append("imageEdited", "false");
        }
        if (audio) {
          formData.append("audioEdited", "true");
        } else {
          formData.append("audioEdited", "false");
        }

        dispatch(formData);
      }}
      className="relative h-full m-5"
    >
      <div className="flex items-center justify-between">
        <h1>Create Audio</h1>
        <div className="flex items-center justify-center">
          <button
            disabled={formStatus.pending}
            type="submit"
            className="btn bg-white text-black"
          >
            Save
          </button>
        </div>
      </div>
      <div className="border-t border-white my-4"></div>
      <p className="italic text-sm pb-5">
        Note* an avatar is optional, artists with an avatar will be featured on
        the list of artists.
      </p>
      <div className="flex flex-col space-y-10 pb-10">
        <label className="relative w-64 h-64 stack rounded-lg border flex items-center justify-center cursor-pointer transition-colors overflow-hidden">
          <input
            type="file"
            name="image"
            className="hidden"
            onChange={(e) => {
              setImage(e.target.files![0]);
            }}
            accept="image/*"
          />
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={image ? URL.createObjectURL(image) : trackImageUrl}
              alt="Picked image"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </label>

        <div className="flex flex-col w-full">
          <label>Artist Name</label>
          <input
            type="text"
            defaultValue={track.artistName}
            name="artistName"
            placeholder="Artist Name"
            className="input bg-transparent border border-white w-full max-w-xs"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.artistName &&
              state.errors.artistName.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex items-start">
          <div>
            <p className="pb-2.5">Selected Filepath: {track.filePath}</p>
            <label className="block">
              <span className="sr-only">Upload Audio File</span>
              <input
                type="file"
                name="audio"
                accept="audio/*"
                onChange={(e) => {
                  const files = e.target.files;

                  if (files) {
                    setAudio(files[0]);
                    const audio = new Audio(URL.createObjectURL(files[0]));
                    let initDuration: number = 0;
                    audio.addEventListener("loadedmetadata", () => {
                      initDuration = audio.duration;
                      setDuration(initDuration);
                    });

                    if (fromDateTime && duration) {
                      const toDate = new Date(
                        fromDateTime.getTime() + duration! * 1000
                      );
                      setToDateTime(toDate);
                    }
                  }
                }}
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white hover:file:border-2"
              />
            </label>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.audio &&
                state.errors.audio.map((error: string, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label>Track Name</label>
          <input
            type="text"
            defaultValue={track.trackName}
            name="trackName"
            placeholder="Track Name"
            className="input bg-transparent border border-white w-full max-w-xs"
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.trackName &&
              state.errors.trackName.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col w-min">
          <p className="italic text-sm pb-5">
            Note* this field is optional, it is intended for scheduled streams
          </p>
          <label>Track Airing</label>
          <input
            type="datetime-local"
            id="fromDateTime"
            value={fromDateTime ? formatDateTimeLocale(fromDateTime) : 0}
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              const now = new Date();
              const selectedDate = new Date(selectedDateTime);

              if (selectedDate > now) {
                const fromDate = selectedDate;
                setFromDateTime(fromDate);
                if (duration) {
                  const toDate = new Date(fromDate.getTime() + duration * 1000);
                  setToDateTime(toDate);
                }
              }
            }}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
          <label>Suggested Track Timeslot</label>
          <select
            disabled={duration == null}
            className="select p-2.5 rounded-lg w-min text-black"
            defaultValue={""}
            onChange={(e) => {
              console.log("Event:", e);
              const date = e.target.value;
              console.log("Selected Date (Epoch):", date);
              setFromDateTime(new Date(Number(date)));
              setToDateTime(new Date(Number(date) + duration! * 1000));
            }}
          >
            <option value="">Pick suggested timeslot</option>
            {sortedTrackSlots.map((trackSlot, i) => {
              if (trackSlot.difference / 1000 > duration!) {
                return (
                  <option value={trackSlot.previousTrackEnds.getTime()} key={i}>
                    From {formatDateTime(trackSlot.previousTrackEnds)} to{" "}
                    {formatDateTime(
                      new Date(
                        trackSlot.previousTrackEnds.getTime() + duration! * 1000
                      )
                    )}
                  </option>
                );
              }
            })}
          </select>
        </div>

        {fromDateTime && toDateTime && duration && (
          <div className="">
            Track will air from: {formatDateTime(fromDateTime)} to
            {formatDateTime(toDateTime)}
          </div>
        )}
      </div>
    </form>
  );
}

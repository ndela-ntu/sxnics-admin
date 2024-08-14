"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { createTrack, TrackState } from "@/app/lib/audio-actions";

export default function CreateTrackForm() {
  const formStatus = useFormStatus();

  const [image, setImage] = useState<File | undefined>(undefined);
  const [fromDateTime, setFromDateTime] = useState<Date | null>(null);
  const [toDateTime, setToDateTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(date);
  };

  const formatDateTimeLocale = (date: Date): string => {
    const padZero = (num: number): string => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<TrackState, FormData>(
    createTrack,
    initialState
  );

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form
      action={(formData) => {
        if (fromDateTime && toDateTime) {
          formData.append(
            "trackStarts",
            fromDateTime.getTime().toString()
          );
          formData.append(
            "trackEnds",
            fromDateTime.getTime().toString()
          );
          formData.delete("dateTimePicker");
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
          {image ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={URL.createObjectURL(image)}
                alt="Picked image"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          ) : (
            <>
              <FaImage className="w-10 h-10" />
            </>
          )}
        </label>

        <div className="flex flex-col w-full">
          <label>Artist Name</label>
          <input
            type="text"
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
            <label className="block">
              <span className="sr-only">Upload Audio File</span>
              <input
                type="file"
                name="audio"
                accept="audio/*"
                onChange={(e) => {
                  const files = e.target.files;

                  if (files) {
                    const audio = new Audio(URL.createObjectURL(files[0]));
                    let duration: number = 0;
                    audio.addEventListener("loadedmetadata", () => {
                      duration = audio.duration;
                      setDuration(duration);
                    });

                    if (fromDateTime) {
                      const toDate = new Date(
                        fromDateTime.getTime() + duration * 1000
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
                const fromDate = new Date(e.target.value);
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
        {fromDateTime && toDateTime && duration && (
          <div className="">
            Track will air from: {formatDateTime(fromDateTime)} to{" "}
            {formatDateTime(toDateTime)}
          </div>
        )}
      </div>
    </form>
  );
}

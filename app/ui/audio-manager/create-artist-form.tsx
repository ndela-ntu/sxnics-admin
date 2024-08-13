"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { FaImage } from "react-icons/fa";

export default function CreateArtistForm() {
  const formStatus = useFormStatus();

  const [file, setFile] = useState<File | undefined>(undefined);
  const [dateTime, setDateTime] = useState<any>();

  const initialState = { message: null, errors: {} };
  //   const [state, dispatch] = useFormState<ShopItemState, FormData>(
  //     createShopItem,
  //     initialState
  //   );

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form className="relative h-full">
      <div className="flex items-center justify-between">
        <h1>Create Item</h1>
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
      <div className="flex flex-col space-y-10">
        <label className="relative w-64 h-64 stack rounded-lg border flex items-center justify-center cursor-pointer transition-colors overflow-hidden">
          <input
            type="file"
            name="image"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files![0]);
            }}
            accept="image/*"
          />
          {file ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={URL.createObjectURL(file)}
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
          {/* <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div> */}
        </div>
        <div className="flex items-start">
          <label className="block">
            <span className="sr-only">Upload Audio File</span>
            <input
              type="file"
              accept="audio/*"
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white hover:file:border-2"
            />
          </label>
        </div>

        <div className="flex flex-col w-full">
          <label>Track Name</label>
          <input
            type="text"
            name="trackName"
            placeholder="Track Name"
            className="input bg-transparent border border-white w-full max-w-xs"
          />
          {/* <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div> */}
        </div>
        <div className="flex flex-col w-min">
          <label>Track Airing</label>{" "}
          <input
            type="datetime-local"
            id="dateTimePicker"
            value={dateTime}
            onChange={(e) => {
              setDateTime(e.target.value)
            }}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </form>
  );
}

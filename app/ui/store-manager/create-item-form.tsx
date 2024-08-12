"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createShopItem, ShopItemState } from "@/app/lib/shop-actions";
import { useState } from "react";
import Image from "next/image";
import { FaImage } from "react-icons/fa";

export default function CreateItemForm() {
  const formStatus = useFormStatus();

  const [file, setFile] = useState<File | undefined>(undefined);

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<ShopItemState, FormData>(
    createShopItem,
    initialState
  );

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form action={dispatch} className="relative h-full">
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
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <>
              <FaImage className="w-10 h-10" />
            </>
          )}
        </label>
        <div className="flex flex-col w-full">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input bg-transparent border border-white w-full max-w-xs"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label>Price</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="input bg-transparent border border-white w-full max-w-xs"
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            name="description"
            className="textarea border border-white bg-transparent focus:border-white"
            placeholder="Description"
          ></textarea>
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
    </form>
  );
}

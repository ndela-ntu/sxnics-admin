"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createShopItem,
  ShopItemState,
  updateShopItem,
} from "@/app/lib/shop-actions";
import { IShopItem } from "@/app/models/shop-item";
import { useState } from "react";
import Image from "next/image";

export default function EditItemForm({ item }: { item: IShopItem }) {
  const formStatus = useFormStatus();

  const [file, setFile] = useState<File | undefined>(undefined);

  const initialState = { message: null, errors: {} };
  const editShopItemWithItem = updateShopItem.bind(null, item);
  const [state, dispatch] = useFormState<ShopItemState, FormData>(
    editShopItemWithItem,
    initialState
  );

  if (formStatus.pending) {
    return <div>Loading...</div>;
  }

  return (
    <form
      action={(formData) => {
        if (file) {
          formData.append("imageEdited", "true");
        } else {
          formData.append("imageEdited", "false");
        }
        dispatch(formData);
      }}
      className="relative h-full pb-10"
    >
      <div className="flex items-center justify-between">
        <h1>Edit Item</h1>
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
        <div>
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

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={file ? URL.createObjectURL(file) : item.imageURL}
                alt="Picked image"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </label>
          {state.errors?.image &&
            state.errors.image.map((error: string, i) => (
              <p key={i} className="text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
        <div className="flex flex-col w-full">
          <label>Name</label>
          <input
            defaultValue={item.name}
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
            defaultValue={item.price}
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
        <div className="flex flex-col w-full pb-10">
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={item.description}
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

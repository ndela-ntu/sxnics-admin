import { IShopItem } from "@/app/models/shop-item";
import Image from "next/image";
import EditItemButton from "./edit-item-button";
import { DeleteItemButton } from "./delete-item-button";

export default function ShopItemCard({ shopItem }: { shopItem: IShopItem }) {
  return (
    <div className="flex flex-col items-center justify-center text-white border  p-5">
      <div className="flex items-center justify-center w-[200px] h-[200px]">
        <Image
          width={300}
          height={300}
          src={shopItem.imageURL}
          alt="Image of shop item"
        />
      </div>
      <div className="flex w-full flex-col">
        <label className="text-xl font-bold">{shopItem.name}</label>
        <p>{shopItem.description}</p>
        <span className="font-bold">R{shopItem.price}</span>
      </div>
      <div className="flex pt-5 space-x-5">
        <EditItemButton id={shopItem._id.toString()} />
        <DeleteItemButton
          id={shopItem._id.toString()}
          publicId={shopItem.imagePublicId}
        />
      </div>
    </div>
  );
}

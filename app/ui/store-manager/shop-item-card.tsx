import { IShopItem } from "@/app/models/shop-item";
import Image from "next/image";
import EditItemButton from "./edit-item-button";

export default function ShopItemCard({ shopItem }: { shopItem: IShopItem }) {
  return (
    <div className="flex flex-col items-center justify-center text-white border w-min p-5">
      <div className="flex items-center justify-center w-[300px] h-[300px]">
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
      <EditItemButton id={shopItem.id.toString()} />
    </div>
  );
}

import ShopItem, { IShopItem } from "@/app/models/shop-item";
import CreateItemButton from "@/app/ui/store-manager/create-item-button";
import ShopItemCard from "@/app/ui/store-manager/shop-item-card";
import connectMongo from "@/utils/connect-mongo";
import { convertDocumentsToShopItems } from "@/utils/convert-to-plain-object";

export default async function Page() {
  await connectMongo();
  const docs = await ShopItem.find();
  const shopItems: IShopItem[] = convertDocumentsToShopItems(docs);

  console.log(shopItems);

  return (
    <div className="">
      <h1 className="mb-5">Store Manager</h1>
      <div className="flex justify-between">
        <div className="flex items-center w-full space-x-5">
          <label>Filter By</label>
          <select
            defaultValue="placeholder"
            className="select w-full max-w-xs text-black"
          >
            <option value="placeholder" disabled>
              Choose filter
            </option>
            <option>Clothing</option>
            <option>Other</option>
          </select>
        </div>
        <CreateItemButton />
      </div>
      <div className="border-t border-white my-4"></div>
      <div className="grid grid-cols-4 w-full border">
        {shopItems.map((shopItem) => (
          <ShopItemCard key={shopItem._id.toString()} shopItem={shopItem} />
        ))}
      </div>
    </div>
  );
}

import ShopItem, { IShopItem } from "@/app/models/shop-item";
import EditItemForm from "@/app/ui/store-manager/edit-item-form";
import connectMongo from "@/utils/connect-mongo";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  await connectMongo();
  const shopItem: IShopItem | null = await ShopItem.findById(params.id);

  if (!shopItem) {
    notFound();
  }

  return (
    <div className="h-full">
      <EditItemForm item={shopItem} />
    </div>
  );
}

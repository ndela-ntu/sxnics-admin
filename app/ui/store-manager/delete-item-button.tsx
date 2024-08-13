import { deleteShopItem } from "@/app/lib/shop-actions";
import { MdDelete } from "react-icons/md";

export function DeleteItemButton({ id, publicId }: { id: string; publicId: string }) {
  const deleteProductWithId = deleteShopItem.bind(null, id, publicId);

  return (
    <form action={deleteProductWithId}>
      <button
        type="submit"
        className="btn btn-circle bg-white"
      >
        <MdDelete className="text-black h-6 w-6" />
      </button>
    </form>
  );
}

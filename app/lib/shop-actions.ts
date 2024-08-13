"use server";

import connectMongo from "@/utils/connect-mongo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import ShopItem, { IShopItem } from "../models/shop-item";
import uploadImage from "@/utils/upload-image";
import deleteImage from "@/utils/delete-image";

const ShopItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.coerce.number().gt(0, { message: "Price should be greater than 0" }),
  image: z
    .instanceof(File)
    .refine((file: File) => file.size !== 0, "Image is required")
    .refine((file: File) => {
      return !file || file.size <= 1024 * 1024 * 5;
    }, "File size must be less than 5MB"),
});

export type ShopItemState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    image?: string[];
  };
  message?: string | null;
};

const CreateShopItemSchema = ShopItemSchema.omit({ id: true });

export async function createShopItem(
  prevState: ShopItemState,
  formData: FormData
) {
  const validatedFields = CreateShopItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { name, price, description, image } = validatedFields.data;

    const uploadResult = await uploadImage(image);

    if (uploadResult) {
      let { url, publicId } = uploadResult;

      await connectMongo();
      await ShopItem.create({
        name,
        price,
        description,
        imageURL: url,
        imagePublicId: publicId,
      });
    }
  } catch (error) {
    return {
      message: "Error from server",
    };
  }

  revalidatePath("/dashboard/store-manager");
  redirect("/dashboard/store-manager");
}

const UpdateShopItemSchema = ShopItemSchema.omit({ id: true, image: true });

export async function updateShopItem(
  item: IShopItem,
  prevState: ShopItemState,
  formData: FormData
) {
  const validatedFields = UpdateShopItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create product.",
    };
  }

  try {
    const { name, price, description } = validatedFields.data;

    const imageEdited = formData.get("imageEdited") === "true";
    console.log("Image edited:", imageEdited);

    await connectMongo();

    if (imageEdited) {
      const image = formData.get("image");
      if (image instanceof File) {
        console.log("Deleting previous image:", item.imagePublicId);
        await deleteImage(item.imagePublicId);

        console.log("Uploading new image...");
        const result = await uploadImage(image);

        if (result) {
          const { url, publicId } = result;

          console.log("Updating shop item with new image...");
          console.log(item._id)
          const resultItem = await ShopItem.findOneAndUpdate(
            { _id: item._id },
            {
              $set: {
                name,
                description,
                price,
                imagePublicId: publicId,
                imageURL: url,
              },
            },
            { new: true }
          );

          console.log("Update result:", resultItem);
        }
      } else {
        console.error("Image is not a valid file");
      }
    } else {
      console.log("Updating shop item without changing image...");
      const resultItem = await ShopItem.findOneAndUpdate(
        { _id: item._id },
        {
          $set: {
            name,
            description,
            price,
            imagePublicId: item.imagePublicId,
            imageURL: item.imageURL,
          },
        },
        { new: true }
      );

      console.log("Update result:", resultItem);
    }
  } catch (error) {
    console.error("Error updating shop item:", error);
    return { message: "Error from server" };
  } finally {
    revalidatePath("/dashboard/store-manager");
    redirect("/dashboard/store-manager");
  }
}

export async function deleteShopItem(id: string, publicId: string) {
  await ShopItem.findByIdAndDelete(id);
  await deleteImage(publicId);

  revalidatePath("/dashboard/products");
}

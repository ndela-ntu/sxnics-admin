"use server";
import crypto from "crypto";

interface CloudinaryDeleteResponse {
  result: string;
  [key: string]: any; // This allows for additional properties
}

export default async function deleteImage(
  publicId: string
): Promise<{ success: boolean; message: string }> {
  const cloudName = "dmgzksj3l";
  const apiKey = process.env.CLOUDINARY_API_KEY as string;
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature(publicId, apiSecret, timestamp);

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: CloudinaryDeleteResponse = await response.json();
    console.log("Image deletion result:", result);

    if (result.result === "ok") {
      return { success: true, message: "Image deleted successfully." };
    } else {
      return { success: false, message: "Failed to delete image." };
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Error occurred during image deletion." };
  }
}

function createSignature(
  publicId: string,
  apiSecret: string,
  timestamp: number
): string {
  const data = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha1").update(data).digest("hex");
}

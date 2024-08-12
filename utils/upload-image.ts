"use server";

export default async function uploadImage(
  image: File
): Promise<{ publicId: string; url: string } | null> {
  console.log(process.env.CLOUDINARY_API_KEY || null);
  
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "hhwhba0i");
  formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dmgzksj3l/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    let result = await response.json();

    return {
      publicId: result.public_id,
      url: result.url,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function extensionForType(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return null;
}

function assertValidImage(file: File) {
  const extension = extensionForType(file.type);

  if (!extension) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  return extension;
}

async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = randomUUID();
  const signaturePayload = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signaturePayload).digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("public_id", publicId);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  if (!response.ok) {
    throw new Error("IMAGE_UPLOAD_FAILED");
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    throw new Error("IMAGE_UPLOAD_FAILED");
  }

  return result.secure_url;
}

async function saveLocalImage(file: File, folder: string, extension: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("IMAGE_STORAGE_NOT_CONFIGURED");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `uploads/${folder}/${fileName}`;
}

export async function storeContestantImage(file: File, folder = "contestants") {
  const extension = assertValidImage(file);
  const cloudinaryUrl = await uploadToCloudinary(file, folder);

  if (cloudinaryUrl) {
    return cloudinaryUrl;
  }

  return saveLocalImage(file, folder, extension);
}

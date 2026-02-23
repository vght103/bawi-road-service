import imageCompression from "browser-image-compression";

const COMPRESSION_THRESHOLD = 2 * 1024 * 1024; // 2MB
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function compressIfImage(file: File): Promise<File> {
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    return file;
  }

  if (file.size <= COMPRESSION_THRESHOLD) {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
  });

  return new File([compressed], file.name, { type: compressed.type });
}

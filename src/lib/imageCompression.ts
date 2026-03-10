import imageCompression from "browser-image-compression";

const COMPRESSION_THRESHOLD = 1 * 1024 * 1024; // 1MB
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// 이미지이고 1MB 초과 시 압축하여 반환. 그 외는 원본 반환
export async function compressIfImage(file: File): Promise<File> {
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    return file;
  }

  if (file.size <= COMPRESSION_THRESHOLD) {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });

  return new File([compressed], file.name, { type: compressed.type });
}

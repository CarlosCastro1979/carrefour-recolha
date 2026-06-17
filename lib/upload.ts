import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveUploadedPhoto(
  file: File,
  sessionId: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${sessionId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return filename;
}

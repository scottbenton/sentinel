import { getStorage } from "firebase-admin/storage";

export interface FileMetadata {
  md5Hash?: string;
  size?: number;
  updated?: string;
}

export async function uploadAgenda(
  orgId: string,
  filename: string,
  file: Buffer
): Promise<FileMetadata> {
  const storage = getStorage();
  const bucket = storage.bucket();
  const fileRef = bucket.file(`agendas/${orgId}/${filename}`);
  await fileRef.save(file);

  const [metadata] = await fileRef.getMetadata();
  console.debug(metadata);
  return {
    md5Hash: metadata.md5Hash,
    size: typeof metadata.size === "number" ? metadata.size : undefined,
    updated: metadata.updated,
  };
}

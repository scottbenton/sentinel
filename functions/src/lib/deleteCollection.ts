import { defineSecret } from "firebase-functions/params";
// @ts-expect-error - Firebase Tools is not typed
import firebase_tools from "firebase-tools";

export const tokenSecret = defineSecret("FIREBASE_TOKEN");
export async function deleteCollection(path: string): Promise<void> {
  // Run a recursive delete on the given document or collection path.
  // The 'token' must be set in the functions config, and can be generated
  // at the command line by running 'firebase login:ci'.
  const token = tokenSecret.value();

  await firebase_tools.firestore.delete(path, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    force: true,
    token,
  });
}

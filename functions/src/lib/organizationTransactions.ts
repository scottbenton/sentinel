import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

export interface OrganizationDTO {
  id: string;
  name: string;
  url: string;

  adminIds: string[];

  syncError: string | null;
  lastUpdated: Timestamp;
  lastSynced: Timestamp | null;
}

export async function getOrganization(orgId: string) {
  const db = getFirestore();

  logger.info(`Getting organization ${orgId}`);

  const doc = await db.collection("organizations").doc(orgId).get();

  logger.info(`Doc Exists: ${doc.exists}`);

  const data = doc.data();

  logger.info("Got organization", data);

  if (!data) {
    throw new Error("Organization not found");
  }

  return data as OrganizationDTO;
}

export async function updateOrganization(
  orgId: string,
  syncError: string | null,
  lastSynced: Date | null
) {
  const db = getFirestore();
  const doc = db.collection("organizations").doc(orgId);
  const updates: Partial<OrganizationDTO> = {
    syncError,
  };
  if (lastSynced) {
    updates.lastSynced = Timestamp.fromDate(lastSynced);
  }
  await doc.update(updates);
}

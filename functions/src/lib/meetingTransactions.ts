import { ScrapedAgenda } from "../scrapers/types";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

export interface IMeeting {
  organizationId: string;

  meetingLabel: string;
  meetingDate: Timestamp;

  attachedFilename: string;
  fileHash: string;

  uploadedOn: Timestamp;
}

export async function getMeeting(
  organizationId: string,
  meetingId: string
): Promise<IMeeting | undefined> {
  const db = getFirestore();
  const meetingRef = db
    .collection("organizations")
    .doc(organizationId)
    .collection("meetings")
    .doc(meetingId);
  const meetingDoc = await meetingRef.get();
  if (!meetingDoc.exists) {
    return undefined;
  }
  const meetingData = meetingDoc.data();
  if (!meetingData) {
    return undefined;
  }
  return meetingData as IMeeting;
}

export async function addMeeting(
  orgId: string,
  meetingId: string,
  scrapedAgenda: ScrapedAgenda,
  fileHash: string
): Promise<void> {
  const db = getFirestore();
  const meetingRef = db
    .collection("organizations")
    .doc(orgId)
    .collection("meetings")
    .doc(meetingId);

  const meeting: IMeeting = {
    organizationId: orgId,

    meetingLabel: scrapedAgenda.meetingType,
    meetingDate: Timestamp.fromDate(scrapedAgenda.meetingDate),

    attachedFilename: scrapedAgenda.filename,
    fileHash,

    uploadedOn: Timestamp.now(),
  };

  await meetingRef.set(meeting);
}

export async function updateMeeting(
  orgId: string,
  meetingId: string,
  scrapedAgenda: ScrapedAgenda,
  fileHash: string
): Promise<void> {
  const db = getFirestore();
  const meetingRef = db
    .collection("organizations")
    .doc(orgId)
    .collection("meetings")
    .doc(meetingId);
  await meetingRef.update({
    meetingLabel: scrapedAgenda.meetingType,
    meetingDate: Timestamp.fromDate(scrapedAgenda.meetingDate),
    attachedFilename: scrapedAgenda.filename,
    fileHash,
    uploadedOn: Timestamp.now(),
  });
}

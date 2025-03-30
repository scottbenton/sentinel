// import { Download, Page } from "playwright";
// import { formatDateForFilename } from "./scrapeHelpers";
// import fs from "fs/promises";
// import { getMD5Hash } from "../lib/getFileHash";
// import { ScrapedAgenda } from "@/functions-types/ScrapedAgenda.type";

// export abstract class BaseScraper {
//     private orgId: string;

//     private agendaMap: Map<string, ScrapedAgenda> = new Map();
//     private meetingNameMap: Map<string, number> = new Map();

//     // Today minus one day
//     protected meetingCutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

//     constructor(orgId: string) {
//         this.orgId = orgId;
//     }

//     protected addMeetingToMap(
//         meetingName: string,
//         meetingDate: Date,
//     ): ScrapedAgenda {
//         const key = `${formatDateForFilename(meetingDate)}-${
//             encodeURIComponent(
//                 meetingName,
//             )
//         }`;
//         const agenda: ScrapedAgenda = {
//             meetingType: meetingName,
//             meetingDate,
//             filenames: [],
//         };

//         const count = this.meetingNameMap.get(key) ?? 1;
//         this.meetingNameMap.set(key, count + 1);

//         const newKey = count > 1 ? `${key}-${count}` : key;
//         this.agendaMap.set(newKey, agenda);
//         return agenda;
//     }

//     protected addFilenameToMeeting(
//         meetingId: string,
//         filename: string,
//     ): ScrapedAgenda | undefined {
//         const meeting = this.agendaMap.get(meetingId);
//         if (meeting) {
//             meeting.filenames.push(filename);
//             return meeting;
//         }
//         return undefined;
//     }

//     protected removeMeetingFromMap(key: string) {
//         this.agendaMap.delete(key);
//     }

//     protected async downloadFileToTempFolder(
//         download: Download,
//         filename: string,
//     ): Promise<void> {
//         const filePath = `/tmp/${filename}`;
//         await download.saveAs(filePath);
//     }

//     private async getFileFromTempFolder(filename: string): Promise<Buffer> {
//         return await fs.readFile(`/tmp/${filename}`);
//     }

//     abstract checkWillScrape(page: Page): Promise<boolean>;
//     abstract scrape(page: Page): Promise<void>;

//     private async commitMeeting(
//         meetingId: string,
//         meetingAgenda: ScrapedAgenda,
//     ): Promise<void> {
//         // Get file from tmp folder
//         const fileBuffer = await this.getFileFromTempFolder(
//             meetingAgenda.filename,
//         );
//         // Calculate it's hash
//         const newHash = await getMD5Hash(fileBuffer);

//         // Check if meeting already exists
//         const existingMeeting = await getMeeting(this.orgId, meetingId);

//         if (existingMeeting && existingMeeting.fileHash === newHash) {
//             console.log(
//                 `Meeting ${meetingId} already exists and has the same hash`,
//             );
//             return;
//         }

//         // Upload to storage
//         const metadata = await uploadAgenda(
//             this.orgId,
//             meetingAgenda.filename,
//             fileBuffer,
//         );
//         logger.info("Uploaded file", { metadata });
//         // Add to database
//         if (existingMeeting) {
//             await updateMeeting(this.orgId, meetingId, meetingAgenda, newHash);
//         } else {
//             await addMeeting(this.orgId, meetingId, meetingAgenda, newHash);
//         }
//     }

//     public uploadAgendasToStorage(): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const promises = [...this.agendaMap.entries()].map(
//                 ([meetingId, scrapedAgenda]) =>
//                     this.commitMeeting(meetingId, scrapedAgenda),
//             );

//             Promise.all(promises)
//                 .then(() => resolve())
//                 .catch((e) => reject(e));
//         });
//     }
// }

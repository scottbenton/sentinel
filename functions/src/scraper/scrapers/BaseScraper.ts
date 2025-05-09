import { Download, Page } from "playwright";
import { readFile } from "fs/promises";
import { ScrapedDocument, ScrapedMeeting } from "./scrapeResult.type";
import { MeetingsService } from "../../meetings/meetings.service";
import { Logger } from "@nestjs/common";
import * as mime from "mime";
import { randomUUID } from "crypto";

export abstract class BaseScraper {
  protected logger = new Logger(BaseScraper.name);

  private dashboardId: number;
  private orgId: number;

  protected meetingMap: Map<string, ScrapedMeeting> = new Map();
  private meetingNameMap: Map<string, number> = new Map();

  // Today minus one day
  protected meetingCutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

  constructor(dashboardId: number, orgId: number) {
    this.dashboardId = dashboardId;
    this.orgId = orgId;
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  static async checkWillScrape(_page: Page): Promise<boolean> {
    throw new Error("checkWillScrape not implemented");
  }
  abstract scrape(page: Page): Promise<void>;

  private getMeetingKey(): string {
    return randomUUID();
  }

  protected addMeetingToMap(meetingName: string, meetingDate: Date): string {
    const key = this.getMeetingKey();

    const meeting: ScrapedMeeting = {
      name: meetingName,
      date: meetingDate,
      documents: [],
    };

    const count = this.meetingNameMap.get(key) ?? 1;
    this.meetingNameMap.set(key, count + 1);

    const newKey = count > 1 ? `${key}-${count}` : key;
    this.meetingMap.set(newKey, meeting);
    return newKey;
  }

  protected addFilenameToMeeting(
    meetingKey: string,
    document: ScrapedDocument,
  ): ScrapedMeeting | undefined {
    const meeting = this.meetingMap.get(meetingKey);
    if (meeting) {
      meeting.documents.push(document);
      return meeting;
    }
    return undefined;
  }

  protected removeMeetingFromMap(key: string) {
    this.meetingMap.delete(key);
  }

  protected getMeetingPath(meetingKey: string, baseFilename: string): string {
    return `/tmp/${meetingKey}/${baseFilename}`;
  }

  protected async downloadFileToTempFolder(
    meetingKey: string,
    download: Download,
  ): Promise<ScrapedDocument> {
    try {
      const storedFilename = download.suggestedFilename().replace(
        /[^a-zA-Z0-9/!-.()*'&$@=;:+,? ]/g,
        "",
      );

      const filePath = this.getMeetingPath(meetingKey, storedFilename);
      await download.saveAs(filePath);
      return {
        originalFilename: storedFilename,
        storedFilename: filePath,
      };
    } catch {
      // Try again, in case the pathname was too long
      const uuid = crypto.randomUUID();
      const filename = uuid + ".pdf";
      const filePath = this.getMeetingPath(meetingKey, filename);

      await download.saveAs(filePath);
      return {
        originalFilename: filename,
        storedFilename: filePath,
      };
    }
  }

  private getFileMimeType(document: ScrapedDocument): string {
    const type = mime.getType(document.originalFilename);
    if (!type) {
      this.logger.error(
        `Could not determine mime type for ${document.originalFilename}`,
      );
      throw new Error(
        `Could not determine mime type for ${document.originalFilename}`,
      );
    }
    return type;
  }

  private async commitMeeting(
    meeting: ScrapedMeeting,
    meetingService: MeetingsService,
  ): Promise<void> {
    this.logger.log("Committing meeting", meeting);
    // Create a meeting (or get the existing one)
    const meetingId = await meetingService.createMeetingIfNotExists(
      this.orgId,
      meeting.name,
      meeting.date,
    );

    const uploadedDocumentNames: string[] = [];

    // Go through the files
    for (const document of meeting.documents) {
      this.logger.log("Uploading document", {
        name: document.originalFilename,
        meetingId,
      });

      try {
        const file = await readFile(document.storedFilename);
        const mimeType = this.getFileMimeType(document);
        const { alreadyExists } = await meetingService.uploadMeetingDocument(
          this.dashboardId,
          this.orgId,
          meetingId,
          file,
          mimeType,
          document.originalFilename,
          document.skipLogIfHashIsDifferent ?? false,
        );
        if (!alreadyExists) {
          uploadedDocumentNames.push(document.originalFilename);
        }
      } catch (e) {
        let errorMessage = "Unknown error";
        if (e instanceof Error) {
          errorMessage = e.message;
        } else if (typeof e === "string") {
          errorMessage = e;
        }

        this.logger.error(
          `Error uploading document ${document.originalFilename}: ${errorMessage}`,
        );
        throw e;
      }
    }

    if (uploadedDocumentNames.length > 0) {
      try {
        await meetingService.createLog({
          meeting_id: meetingId,
          type: "meeting_document_added",
          additional_context: {
            document_names: uploadedDocumentNames,
          },
        });
      } catch (e) {
        this.logger.error("Error creating log", e);
      }
    }
  }

  public uploadAgendasToStorage(
    meetingsService: MeetingsService,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const promises = [...this.meetingMap.values()].map((scrapedMeeting) =>
        this.commitMeeting(scrapedMeeting, meetingsService)
      );

      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }
}

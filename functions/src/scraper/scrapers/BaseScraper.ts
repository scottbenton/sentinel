import { Download, Page } from "playwright";
import { formatDateForFilename } from "./scrapeHelpers";
import { readFile } from "fs/promises";
import { ScrapedDocument, ScrapedMeeting } from "./scrapeResult.type";
import { MeetingsService } from "../../meetings/meetings.service";
import { Logger } from "@nestjs/common";

export abstract class BaseScraper {
    protected logger = new Logger(BaseScraper.name);

    private dashboardId: number;
    private orgId: number;

    private meetingMap: Map<string, ScrapedMeeting> = new Map();
    private meetingNameMap: Map<string, number> = new Map();

    // Today minus one day
    protected meetingCutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

    constructor(dashboardId: number, orgId: number) {
        this.dashboardId = dashboardId;
        this.orgId = orgId;
    }

    static async checkWillScrape(page: Page): Promise<boolean> {
        throw new Error("checkWillScrape not implemented");
    }
    abstract scrape(page: Page): Promise<void>;

    private getMeetingKey(
        meetingName: string,
        meetingDate: Date,
    ): string {
        return `${formatDateForFilename(meetingDate)}-${
            encodeURIComponent(
                meetingName,
            )
        }`;
    }

    protected addMeetingToMap(
        meetingName: string,
        meetingDate: Date,
    ): string {
        const key = this.getMeetingKey(meetingName, meetingDate);

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

    protected async downloadFileToTempFolder(
        meetingKey: string,
        download: Download,
    ): Promise<ScrapedDocument> {
        const baseFilename = download.suggestedFilename();
        const fullFilename = `${meetingKey}-${baseFilename}`;
        const filePath = `/tmp/${fullFilename}`;
        await download.saveAs(filePath);
        return {
            originalFilename: baseFilename,
            storedFilename: fullFilename,
        };
    }

    private async getFileFromTempFolder(
        document: ScrapedDocument,
    ): Promise<File> {
        const buffer = await readFile(`/tmp/${document.storedFilename}`);
        const file = new File([buffer], document.originalFilename, {
            type: "application/pdf",
        });
        return file;
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

        // Go through the files
        for (const document of meeting.documents) {
            this.logger.log("Uploading document", {
                name: document.originalFilename,
                meetingId,
            });

            try {
                const file = await this.getFileFromTempFolder(document);
                await meetingService.uploadMeetingDocument(
                    this.dashboardId,
                    this.orgId,
                    meetingId,
                    file,
                );
            } catch (e) {
                this.logger.error(
                    `Error uploading document ${document.originalFilename}: ${e.message}`,
                );
                throw e;
            }
        }
    }

    public uploadAgendasToStorage(
        meetingsService: MeetingsService,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = [...this.meetingMap.values()].map(
                (scrapedMeeting) =>
                    this.commitMeeting(scrapedMeeting, meetingsService),
            );

            Promise.all(promises)
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }
}

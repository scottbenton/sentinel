import { Page } from "playwright";
import { BaseScraper } from "./BaseScraper";

export class PennDelcoScraper extends BaseScraper {
    static async checkWillScrape(page: Page): Promise<boolean> {
        const title = await page.title();
        return title.includes("Penn-Delco School District");
    }

    async scrape(page: Page): Promise<void> {
        const agendaSections = await page.locator(
            "main.fsPageContent .fsElement>.fsElementContent tbody tr",
        ).all();

        const meetings: Record<string, string> = {};

        for (const agendaSection of agendaSections) {
            const meetingDateString = await agendaSection.locator("td").nth(0)
                .textContent();
            this.logger.log(meetingDateString);
            const meetingDate = new Date(`${meetingDateString} UTC`);
            if (meetingDate < this.meetingCutoffDate) {
                this.logger.log(
                    `Skipping meeting date: ${meetingDate.toDateString()}`,
                );
                continue;
            } else {
                this.logger.log(
                    `Will parse meeting date: ${meetingDate.toDateString()}`,
                );
            }

            const meetingName = "Board of School Directors Meeting";

            const meetingAgendaLink = agendaSection.locator("td").nth(2)
                .locator(
                    "a",
                );

            const meetingKey = this.addMeetingToMap(
                meetingName,
                meetingDate,
            );
            meetings[meetingDate.toISOString()] = meetingKey;

            const agendaDownloadPromise = page.waitForEvent("download");
            try {
                await meetingAgendaLink.waitFor({
                    state: "visible",
                    timeout: 2000,
                });
                // Add the download attribute to the button
                await meetingAgendaLink.evaluate((el) => {
                    el.setAttribute("download", "");
                    el.setAttribute("target", "_self");
                });

                this.logger.log("Downloading agenda");
                await meetingAgendaLink.click({ modifiers: ["Alt"] });
                const download = await agendaDownloadPromise;
                const filenames = await this.downloadFileToTempFolder(
                    meetingKey,
                    download,
                );
                this.addFilenameToMeeting(meetingKey, filenames);
            } catch {
                this.logger.warn("Agenda link not found");
            }
        }

        // Grab any other documents
        await page.locator(
            "main.fsPageContent a.button-arrow",
        ).first().click();
        // wait for the new page to load
        await page.waitForLoadState("networkidle");
        const meetingMaterialsSections = await page.locator(
            "main.fsPageContent .fsElement>.fsElementContent",
        ).all();

        for (const section of meetingMaterialsSections) {
            const meetingTitle = await section.locator("h3").textContent() ??
                "";
            if (!meetingTitle) {
                throw new Error("Meeting title not found");
            }
            const meetingDateString = meetingTitle.split(" - ")[0];
            const meetingDate = new Date(`${meetingDateString} UTC`);
            if (!meetings[meetingDate.toISOString()]) {
                this.logger.log(
                    `Skipping meeting materials for meeting date: ${meetingDate.toDateString()}`,
                );
                continue;
            } else {
                this.logger.log(
                    `Will parse meeting materials for meeting date: ${meetingDate.toDateString()}`,
                );
            }

            const meetingDocuments = await section.locator("table>tbody>tr")
                .all();
            for (const meetingDocumentRow of meetingDocuments) {
                const meetingDocumentLinks = await meetingDocumentRow.locator(
                    "td",
                ).nth(2).locator("a").all();
                for (const meetingDocumentLink of meetingDocumentLinks) {
                    const meetingKey = meetings[meetingDate.toISOString()];
                    const agendaDownloadPromise = page.waitForEvent("download");
                    try {
                        await meetingDocumentLink.waitFor({
                            state: "visible",
                            timeout: 2000,
                        });
                        // Add the download attribute to the button
                        await meetingDocumentLink.evaluate((el) => {
                            el.setAttribute("download", "");
                            el.setAttribute("target", "_self");
                        });

                        this.logger.log("Downloading agenda");
                        await meetingDocumentLink.click({ modifiers: ["Alt"] });
                        const download = await agendaDownloadPromise;
                        const filenames = await this.downloadFileToTempFolder(
                            meetingKey,
                            download,
                        );
                        this.addFilenameToMeeting(meetingKey, filenames);
                    } catch {
                        this.logger.warn("Agenda link not found");
                    }
                }
            }
        }
    }
}

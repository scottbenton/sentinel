export interface ScrapedDocument {
    originalFilename: string;
    storedFilename: string;
}

export interface ScrapedMeeting {
    name: string;
    date: Date;
    documents: ScrapedDocument[];
}
export interface ScrapeResult {
    meetings: ScrapedMeeting[];
}

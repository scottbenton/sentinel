export type ScrapedAgenda = {
  filename: string;
  meetingType: string;
  meetingDate: Date;
};

export type ScraperFunctionReturnType = ScrapedAgenda[];

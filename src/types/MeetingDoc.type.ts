export interface IMeetingDoc {
  id: string;

  filename: string;
  hash: string | null;
  uploadedOn: Date;
}

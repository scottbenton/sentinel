export interface IMeetingLog {
  id: string;
  text: string;
  type: "action";
  authorId: string | null;
}

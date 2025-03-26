import { MeetingLogsRepository } from "@/repository/meetingLogs.repository";

export enum MeetingLogTypes {
    Lifecycle = "lifecycle",
    Comment = "comment",
}

export class MeetingLogsService {
    public static async createLog(
        uid: string,
        meetingId: number,
        content: string,
        type: MeetingLogTypes,
    ): Promise<void> {
        return await MeetingLogsRepository.createLog({
            meeting_id: meetingId,
            text: content,
            type,
            created_by: uid,
        });
    }
}

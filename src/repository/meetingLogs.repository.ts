import { supabase } from "@/lib/supabase.lib";
import {
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export type MeetingLogDTO = Tables<"meeting_logs">;
export type InsertMeetingLogDTO = TablesInsert<"meeting_logs">;
export type UpdateMeetingLogDTO = TablesUpdate<"meeting_logs">;

export class MeetingLogsRepository {
    private static meetingLogs = () => supabase.from("meeting_logs");

    static createLog(
        log: InsertMeetingLogDTO,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.meetingLogs()
                .insert(log)
                .then(({ status, error }) => {
                    if (error && log.type === "comment") {
                        reject(
                            getRepositoryError(
                                error,
                                ErrorVerb.Create,
                                ErrorNoun.MeetingLogs,
                                false,
                                status,
                            ),
                        );
                    } else {
                        resolve();
                    }
                });
        });
    }
}

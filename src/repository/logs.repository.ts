import { supabase } from "@/lib/supabase.lib";
import {
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export type LogDTO = Tables<"logs">;
export type InsertLogDTO = TablesInsert<"logs">;
export type UpdateLogDTO = TablesUpdate<"logs">;

export class LogsRepository {
    private static logs = () => supabase.from("logs");

    static getLogs(params: {
        meetingId: number | null;
        organizationId: number | null;
        after?: Date;
    }): Promise<LogDTO[]> {
        const { meetingId, organizationId, after } = params;
        if (!meetingId && !organizationId) {
            console.error(
                "Either meetingId or organizationId must be provided",
            );
            return Promise.reject(
                getRepositoryError(
                    new Error(
                        "Either meetingId or organizationId must be provided",
                    ),
                    ErrorVerb.Read,
                    ErrorNoun.MeetingLogs,
                    true,
                ),
            );
        }
        return new Promise((resolve, reject) => {
            const q = this.logs()
                .select("*");

            if (meetingId) {
                q.eq("meeting_id", meetingId);
            } else if (organizationId) {
                q.eq("org_id", organizationId);
            }

            if (after) {
                q.gt("created_at", after.toISOString());
            }

            q.order("created_at", { ascending: false });

            q.then(({ data, status, error }) => {
                if (error) {
                    console.error("Error fetching logs:", error);
                    reject(
                        getRepositoryError(
                            error,
                            ErrorVerb.Read,
                            ErrorNoun.MeetingLogs,
                            true,
                            status,
                        ),
                    );
                } else {
                    resolve(data);
                }
            });
        });
    }

    static createLog(
        log: InsertLogDTO,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logs()
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

    static updateLog(
        logId: number,
        log: UpdateLogDTO,
    ): Promise<LogDTO> {
        return new Promise((resolve, reject) => {
            this.logs()
                .update({ ...log, edited_at: new Date().toISOString() })
                .eq("id", logId)
                .select().single()
                .then(({ data, status, error }) => {
                    if (error) {
                        reject(
                            getRepositoryError(
                                error,
                                ErrorVerb.Update,
                                ErrorNoun.MeetingLogs,
                                false,
                                status,
                            ),
                        );
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    static deleteLog(
        logId: number,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logs()
                .delete()
                .eq("id", logId)
                .then(({ status, error }) => {
                    if (error) {
                        reject(
                            getRepositoryError(
                                error,
                                ErrorVerb.Delete,
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

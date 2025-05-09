import { LogDTO, LogsRepository } from "@/repository/logs.repository";
import { ILog, LogValidationUtilService } from "./logValidationUtil.service";
import { Json } from "@/types/supabase-generated.types";

export enum LogTypes {
    Comment = "comment",
    MeetingCreated = "meeting_created",
    MeetingNameChanged = "meeting_name_changed",
    MeetingDateChanged = "meeting_date_changed",
    MeetingDocumentAdded = "meeting_document_added",
    MeetingDocumentDeleted = "meeting_document_deleted",
}

export class LogsService {
    public static async getLogs(
        id: { organizationId: number | null; meetingId: number | null },
    ): Promise<ILog[]> {
        const logDTOs = await LogsRepository.getLogs(id);
        return await this.getValidatedLogs(logDTOs);
    }

    public static async getLogsAfter(
        params: {
            organizationId: number | null;
            meetingId: number | null;
            after: Date;
        },
    ): Promise<ILog[]> {
        const logDTOs = await LogsRepository.getLogs(params);
        return await this.getValidatedLogs(logDTOs);
    }

    public static async createLog(params: {
        uid: string;
        meetingId: number | null;
        organizationId: number | null;
        content?: string;
        additionalContext?: Record<string, unknown>;
        type: LogTypes;
    }): Promise<void> {
        const {
            uid,
            meetingId,
            organizationId,
            content,
            additionalContext,
            type,
        } = params;
        return await LogsRepository.createLog({
            meeting_id: meetingId,
            org_id: organizationId,
            text: content,
            type,
            created_by: uid,
            additional_context: additionalContext as Json,
        });
    }

    public static async updateLog(
        logId: number,
        content: string,
    ): Promise<ILog> {
        return (await this.getValidatedLogs(
            [await LogsRepository.updateLog(logId, { text: content })],
        ))[0];
    }

    public static async deleteLog(logId: number): Promise<void> {
        return await LogsRepository.deleteLog(logId);
    }

    private static async getValidatedLogs(
        logDTOs: LogDTO[],
    ): Promise<ILog[]> {
        const validatedLogs: ILog[] = [];
        for (const logDTO of logDTOs) {
            try {
                const validatedLog = await LogValidationUtilService
                    .getValidatedLog(logDTO);
                if (validatedLog) {
                    validatedLogs.push(validatedLog);
                }
            } catch (error) {
                console.error("Log validation failed", error);
            }
        }
        return validatedLogs;
    }
}

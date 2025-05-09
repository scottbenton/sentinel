import { array, object, string } from "yup";
import { LogTypes } from "./logs.service";
import { LogDTO } from "@/repository/logs.repository";

interface BaseLog {
    id: number;
    meetingId: number | null;
    organizationId: number | null;
    content: string | null;
    type: LogTypes;
    createdAt: Date;
    createdBy: string | null;
}

export interface ICommentLog extends BaseLog {
    type: LogTypes.Comment;
}
export interface IMeetingCreatedLog extends BaseLog {
    type: LogTypes.MeetingCreated;
}

const meetingNameChangedLogAdditionalContextSchema = object({
    previous_name: string().required(),
    new_name: string().required(),
});
export interface IMeetingNameChangedLog extends BaseLog {
    type: LogTypes.MeetingNameChanged;
    previousName: string;
    newName: string;
}

const meetingDateChangedLogAdditionalContextSchema = object({
    previous_date: string().datetime().required(),
    new_date: string().datetime().required(),
});
export interface IMeetingDateChangedLog extends BaseLog {
    type: LogTypes.MeetingDateChanged;
    previousDate: Date;
    newDate: Date;
}

const meetingDocumentAddedLogAdditionalContextSchema = object({
    document_names: array(string().required()).required(),
});
export interface IMeetingDocumentAddedLog extends BaseLog {
    type: LogTypes.MeetingDocumentAdded;
    documentNames: string[];
}

const meetingDocumentDeletedLogAdditionalContextSchema = object({
    document_names: array(string().required()).required(),
});
export interface IMeetingDocumentDeletedLog extends BaseLog {
    type: LogTypes.MeetingDocumentDeleted;
    documentNames: string[];
}

export type ILog =
    | ICommentLog
    | IMeetingCreatedLog
    | IMeetingNameChangedLog
    | IMeetingDateChangedLog
    | IMeetingDocumentAddedLog
    | IMeetingDocumentDeletedLog;

export class LogValidationUtilService {
    static async getValidatedLog(
        log: LogDTO,
    ): Promise<ILog | null> {
        const defaultLogFields = this.getDefaultLogFields(log);
        switch (log.type) {
            case LogTypes.Comment:
                return {
                    ...defaultLogFields,
                    type: LogTypes.Comment,
                };
            case LogTypes.MeetingCreated:
                return {
                    ...defaultLogFields,
                    type: LogTypes.MeetingCreated,
                };
            case LogTypes.MeetingNameChanged: {
                const meetingNameChangedLogAdditionalContext =
                    await meetingNameChangedLogAdditionalContextSchema.validate(
                        log.additional_context,
                    );
                return {
                    ...defaultLogFields,
                    type: LogTypes.MeetingNameChanged,
                    previousName:
                        meetingNameChangedLogAdditionalContext.previous_name,
                    newName: meetingNameChangedLogAdditionalContext.new_name,
                };
            }
            case LogTypes.MeetingDateChanged: {
                const additionalContext =
                    await meetingDateChangedLogAdditionalContextSchema.validate(
                        log.additional_context,
                    );
                return {
                    ...defaultLogFields,
                    type: LogTypes.MeetingDateChanged,
                    previousDate: new Date(additionalContext.previous_date),
                    newDate: new Date(additionalContext.new_date),
                };
            }
            case LogTypes.MeetingDocumentAdded: {
                const additionalContext =
                    await meetingDocumentAddedLogAdditionalContextSchema
                        .validate(
                            log.additional_context,
                        );
                return {
                    ...defaultLogFields,
                    type: LogTypes.MeetingDocumentAdded,
                    documentNames: additionalContext.document_names,
                };
            }
            case LogTypes.MeetingDocumentDeleted: {
                const additionalContext =
                    await meetingDocumentDeletedLogAdditionalContextSchema
                        .validate(
                            log.additional_context,
                        );
                return {
                    ...defaultLogFields,
                    type: LogTypes.MeetingDocumentDeleted,
                    documentNames: additionalContext.document_names,
                };
            }
            default:
                console.error(
                    `Log type ${log.type} is not supported`,
                );
                return null;
        }
    }

    private static getDefaultLogFields(
        log: LogDTO,
    ): Omit<BaseLog, "type"> {
        return {
            id: log.id,
            meetingId: log.meeting_id,
            organizationId: log.org_id,
            content: log.text,
            createdAt: new Date(log.created_at),
            createdBy: log.created_by,
        };
    }
}

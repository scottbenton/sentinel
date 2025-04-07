import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "src/supabase/supabase.service";
import { Tables, TablesInsert } from "src/types/supabase-generated.types";
import { createHash } from "crypto";

@Injectable()
export class MeetingsService {
    private logger = new Logger(MeetingsService.name);

    private readonly supabase: SupabaseClient;
    constructor(supabaseService: SupabaseService) {
        this.supabase = supabaseService.supabase;
    }

    async getMeetingByOrganizationIdNameAndDate(
        organizationId: number,
        name: string,
        date: string,
    ): Promise<Tables<"meetings"> | null> {
        // Placeholder for fetching meeting logic
        const response = await this.supabase.from("meetings").select().eq(
            "organization_id",
            organizationId,
        ).eq("name", name).eq("meeting_date", date).maybeSingle();
        if (response.error) {
            this.logger.error("Error fetching meeting:", response.error);
            throw new Error(
                `Error fetching meeting: ${response.error.message}`,
            );
        }

        if (response.data) {
            return response.data;
        }

        return null;
    }

    async createMeeting(
        meeting: TablesInsert<"meetings">,
    ): Promise<number> {
        // Placeholder for creating meeting logic
        const { data, error } = await this.supabase
            .from("meetings")
            .insert(meeting)
            .select("id")
            .single();

        if (error) {
            this.logger.error("Error creating meeting:", error);
            throw new Error(`Error creating meeting: ${error.message}`);
        }

        if (data) {
            return data.id;
        }

        throw new Error("Failed to create meeting");
    }

    async createMeetingIfNotExists(
        organizationId: number,
        name: string,
        date: Date,
    ): Promise<number> {
        const meeting = await this.getMeetingByOrganizationIdNameAndDate(
            organizationId,
            name,
            date.toISOString(),
        );

        if (meeting) {
            this.logger.log(`Meeting ${name} already exists`);
            return meeting.id;
        }

        this.logger.log(`Creating meeting ${name}`);
        return await this.createMeeting({
            organization_id: organizationId,
            name,
            meeting_date: date.toISOString(),
        });
    }

    async uploadMeetingDocument(
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        file: File,
    ): Promise<number> {
        this.logger.log(`Uploading document: ${file.name}`);
        const fileHash = await this.getFileHash(file);
        const meetingDocumentId = await this.checkIfFileHasBeenUploaded(
            meetingId,
            fileHash,
        );
        if (meetingDocumentId !== null) {
            this.logger.log(
                `File ${file.name} has already been uploaded`,
            );
            return meetingDocumentId;
        }

        this.logger.log(
            `File ${file.name} has not been uploaded, uploading now`,
        );

        // Upload document to the database
        await this.uploadDocumentToStorage(
            dashboardId,
            organizationId,
            meetingId,
            file,
        );

        this.logger.log(
            `File ${file.name} has been uploaded to storage, deleting old documents with same name`,
        );
        await this.deleteAllMeetingDocumentsWithSameNameIfExists(
            meetingId,
            file.name,
        );

        this.logger.log(
            `File ${file.name} has been uploaded to storage, adding to database`,
        );

        // Insert document metadata into the database
        return await this.addDocumentToDatabase(
            meetingId,
            file.name,
            fileHash,
        );
    }

    private async getFileHash(
        file: File,
    ): Promise<string> {
        const buffer = Buffer.from(await file.bytes());
        const hash = createHash("md5").update(buffer).digest("hex");
        return hash;
    }

    private async checkIfFileHasBeenUploaded(
        meetingId: number,
        hash: string,
    ): Promise<number | null> {
        const { data, error } = await this.supabase
            .from("meeting_documents")
            .select()
            .eq("meeting_id", meetingId)
            .eq("file_hash", hash)
            .maybeSingle();

        if (error) {
            this.logger.error("Error checking document:", error);
            throw new Error(
                `Error checking document: ${error.message}`,
            );
        }

        return data ? data.id : null;
    }

    private async deleteAllMeetingDocumentsWithSameNameIfExists(
        meetingId: number,
        filename: string,
    ): Promise<void> {
        const { error } = await this.supabase
            .from("meeting_documents")
            .delete()
            .eq("meeting_id", meetingId)
            .eq("filename", filename);

        if (error) {
            this.logger.error(
                "Error deleting meeting documents:",
                error,
            );
            throw new Error(
                `Error deleting meeting documents: ${error.message}`,
            );
        }
    }

    private async uploadDocumentToStorage(
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        file: File,
    ): Promise<void> {
        const { error } = await this.supabase.storage.from(
            "meeting-documents",
        ).upload(
            `${dashboardId}/${organizationId}/${meetingId}/${file.name}`,
            file,
            {
                upsert: true,
            },
        );

        if (error) {
            this.logger.error("Error uploading document:", error);
            throw new Error(
                `Error uploading document: ${error.message}`,
            );
        }
    }

    private async addDocumentToDatabase(
        meetingId: number,
        fileName: string,
        fileHash: string,
    ): Promise<number> {
        const { data, error } = await this.supabase
            .from("meeting_documents")
            .insert({
                meeting_id: meetingId,
                filename: fileName,
                file_hash: fileHash,
            })
            .select("id")
            .single();

        if (error) {
            this.logger.error("Error adding document to database:", error);
            throw new Error(
                `Error adding document to database: ${error.message}`,
            );
        }

        return data.id;
    }
}

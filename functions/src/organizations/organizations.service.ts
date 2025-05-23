import { SupabaseClient } from "../types/supabase.type";
import { SupabaseService } from "../supabase/supabase.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationsService {
    private readonly supabase: SupabaseClient;
    constructor(supabaseService: SupabaseService) {
        this.supabase = supabaseService.supabase;
    }

    async getOrganizationFromId(
        organizationId: number,
    ) {
        const result = await this.supabase.from("organizations").select().eq(
            "id",
            organizationId,
        ).single();

        if (result.error) {
            throw new Error(
                `Error fetching organization: ${result.error.message}`,
            );
        }
        if (!result.data) {
            throw new Error(`Organization not found`);
        }
        return result.data;
    }

    async getAllOrganizationIdsFromDashboardId(
        dashboardId: number,
    ): Promise<number[]> {
        const result = await this.supabase.from("organizations").select("id")
            .eq("dashboard_id", dashboardId);

        if (result.error) {
            throw new Error(
                `Error fetching organization IDs: ${result.error.message}`,
            );
        }
        if (!result.data) {
            throw new Error(`No organization IDs found`);
        }
        return result.data.map((org) => org.id);
    }

    async bulkUpdateSyncPending(
        organizationIds: number[],
        syncPending: boolean,
    ) {
        const result = await this.supabase.from("organizations").update({
            sync_pending: syncPending,
        }).in("id", organizationIds);

        if (result.error) {
            throw new Error(
                `Error updating sync pending status: ${result.error.message}`,
            );
        }
    }

    async updateLastScrapedDate(
        organizationId: number,
        lastScrapedDate: Date,
    ) {
        const result = await this.supabase.from("organizations").update({
            last_synced: lastScrapedDate.toISOString(),
            sync_error: null,
            sync_pending: false,
        }).eq("id", organizationId);

        if (result.error) {
            throw new Error(
                `Error updating last scraped date: ${result.error.message}`,
            );
        }
    }

    async updateLastScrapedError(
        organizationId: number,
        errorMessage: string,
    ) {
        const result = await this.supabase.from("organizations").update({
            sync_error: errorMessage,
            sync_pending: false,
        }).eq("id", organizationId);

        if (result.error) {
            throw new Error(
                `Error updating last scraped error: ${result.error.message}`,
            );
        }
    }

    async getNextNOrganizationIds(
        limit: number,
        fromIndex: number = -1,
    ): Promise<number[]> {
        const result = await this.supabase.from("organizations").select("id")
            .order(
                "id",
            )
            .gt("id", fromIndex)
            .limit(limit);

        if (result.error) {
            throw new Error(
                `Error fetching organization IDs: ${result.error.message}`,
            );
        }
        if (!result.data) {
            throw new Error(`No organization IDs found`);
        }
        return result.data.map((org) => org.id);
    }
}

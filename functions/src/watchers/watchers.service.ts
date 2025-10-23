import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase/supabase.service";
import { Database, Tables } from "../types/supabase-generated.types";

@Injectable()
export class WatchersService {
  private readonly logger = new Logger(WatchersService.name);
  private readonly supabase: SupabaseClient<Database>;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.supabase;
  }

  /**
   * Get all watchers for an organization
   */
  async getOrganizationWatchers(
    organizationId: number
  ): Promise<Tables<"watchers">[]> {
    const { data, error } = await this.supabase
      .from("watchers")
      .select("*")
      .eq("organization_id", organizationId)
      .is("meeting_id", null);

    if (error) {
      this.logger.error("Error fetching organization watchers:", error);
      throw new Error(`Error fetching organization watchers: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get all watchers for a meeting
   */
  async getMeetingWatchers(meetingId: number): Promise<Tables<"watchers">[]> {
    const { data, error } = await this.supabase
      .from("watchers")
      .select("*")
      .eq("meeting_id", meetingId)
      .is("organization_id", null);

    if (error) {
      this.logger.error("Error fetching meeting watchers:", error);
      throw new Error(`Error fetching meeting watchers: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Add a user as a watcher to an organization
   */
  async addOrganizationWatcher(
    userId: string,
    dashboardId: number,
    organizationId: number
  ): Promise<void> {
    const { error } = await this.supabase.from("watchers").insert({
      user_id: userId,
      dashboard_id: dashboardId,
      organization_id: organizationId,
      meeting_id: null,
    });

    if (error) {
      this.logger.error("Error adding organization watcher:", error);
      throw new Error(`Error adding organization watcher: ${error.message}`);
    }
  }

  /**
   * Add a user as a watcher to a meeting
   */
  async addMeetingWatcher(
    userId: string,
    dashboardId: number,
    meetingId: number
  ): Promise<void> {
    const { error } = await this.supabase.from("watchers").insert({
      user_id: userId,
      dashboard_id: dashboardId,
      organization_id: null,
      meeting_id: meetingId,
    });

    if (error) {
      this.logger.error("Error adding meeting watcher:", error);
      throw new Error(`Error adding meeting watcher: ${error.message}`);
    }
  }
}

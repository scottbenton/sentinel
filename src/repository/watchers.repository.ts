import { supabase } from "@/lib/supabase.lib";
import { Tables } from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";
import { createSubscription } from "./_subscriptionManager";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type WatcherDTO = Tables<"watchers">;

export class WatchersRepository {
  private static watchers = () => supabase.from("watchers");

  /**
   * Get all watchers for a user in a dashboard
   */
  public static async getWatchersForUserInDashboard(
    userId: string,
    dashboardId: number,
  ): Promise<WatcherDTO[]> {
    const { data, error, status } = await this.watchers()
      .select("*")
      .eq("user_id", userId)
      .eq("dashboard_id", dashboardId);

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Read,
        ErrorNoun.Watchers,
        true,
        status,
      );
    }

    return data || [];
  }

  /**
   * Check if a user is watching an organization
   */
  public static async isWatchingOrganization(
    userId: string,
    organizationId: number,
  ): Promise<boolean> {
    const { data, error } = await this.watchers()
      .select("id")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .is("meeting_id", null)
      .maybeSingle();

    if (error) {
      console.error("Error checking organization watch status:", error);
      return false;
    }

    return data !== null;
  }

  /**
   * Check if a user is watching a meeting
   */
  public static async isWatchingMeeting(
    userId: string,
    meetingId: number,
  ): Promise<boolean> {
    const { data, error } = await this.watchers()
      .select("id")
      .eq("user_id", userId)
      .eq("meeting_id", meetingId)
      .is("organization_id", null)
      .maybeSingle();

    if (error) {
      console.error("Error checking meeting watch status:", error);
      return false;
    }

    return data !== null;
  }

  /**
   * Add a watcher for an organization
   */
  public static async addOrganizationWatcher(
    userId: string,
    dashboardId: number,
    organizationId: number,
  ): Promise<WatcherDTO> {
    const { data, error, status } = await this.watchers()
      .insert({
        user_id: userId,
        dashboard_id: dashboardId,
        organization_id: organizationId,
        meeting_id: null,
      })
      .select("*")
      .single();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Create,
        ErrorNoun.Watchers,
        false,
        status,
      );
    }

    return data;
  }

  /**
   * Add a watcher for a meeting
   */
  public static async addMeetingWatcher(
    userId: string,
    dashboardId: number,
    meetingId: number,
  ): Promise<WatcherDTO> {
    const { data, error, status } = await this.watchers()
      .insert({
        user_id: userId,
        dashboard_id: dashboardId,
        organization_id: null,
        meeting_id: meetingId,
      })
      .select("*")
      .single();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Create,
        ErrorNoun.Watchers,
        false,
        status,
      );
    }

    return data;
  }

  /**
   * Remove a watcher for an organization
   */
  public static async removeOrganizationWatcher(
    userId: string,
    organizationId: number,
  ): Promise<void> {
    const { error, status } = await this.watchers()
      .delete()
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .is("meeting_id", null);

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Delete,
        ErrorNoun.Watchers,
        false,
        status,
      );
    }
  }

  /**
   * Remove a watcher for a meeting
   */
  public static async removeMeetingWatcher(
    userId: string,
    meetingId: number,
  ): Promise<void> {
    const { error, status } = await this.watchers()
      .delete()
      .eq("user_id", userId)
      .eq("meeting_id", meetingId)
      .is("organization_id", null);

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Delete,
        ErrorNoun.Watchers,
        false,
        status,
      );
    }
  }

  /**
   * Subscribe to watchers for a user in a dashboard
   */
  public static subscribeToWatchers(
    userId: string,
    dashboardId: number,
    onPayload: (
      payload: WatcherDTO[],
      type: "initial" | "insert" | "delete",
    ) => void,
  ): () => void {
    const loadInitialData = async () => {
      const data = await this.getWatchersForUserInDashboard(
        userId,
        dashboardId,
      );
      onPayload(data, "initial");
    };

    const handlePayload = (
      payload: RealtimePostgresChangesPayload<WatcherDTO>,
    ) => {
      if (payload.eventType === "INSERT") {
        onPayload([payload.new], "insert");
      } else if (payload.eventType === "DELETE") {
        onPayload([payload.old as WatcherDTO], "delete");
      }
    };

    return createSubscription(
      `watchers:${userId}:${dashboardId}`,
      "watchers",
      `user_id=eq.${userId},dashboard_id=eq.${dashboardId}`,
      loadInitialData,
      handlePayload,
    );
  }
}

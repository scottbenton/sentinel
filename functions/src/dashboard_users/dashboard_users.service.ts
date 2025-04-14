import { Injectable } from "@nestjs/common";
import { SupabaseClient } from "../types/supabase.type";
import { SupabaseService } from "../supabase/supabase.service";
import { Tables } from "src/types/supabase-generated.types";

@Injectable()
export class DashboardUsersService {
  private readonly supabase: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.supabase;
  }

  private async getDashboardUser(
    userId: string,
    dashboardId: number,
  ): Promise<Tables<"dashboard_users">> {
    const result = await this.supabase
      .from("dashboard_users")
      .select()
      .eq("user_id", userId)
      .eq("dashboard_id", dashboardId)
      .single();

    if (result.error) {
      throw new Error(
        `Error fetching user permissions: ${result.error.message}`,
      );
    }
    return result.data;
  }

  async checkUserIsUserMeetingAdmin(
    userId: string,
    dashboardId: number,
  ): Promise<boolean> {
    const dashboardUser = await this.getDashboardUser(userId, dashboardId);
    return dashboardUser.can_manage_meetings;
  }

  async checkUserIsUserUserAdmin(
    userId: string,
    dashboardId: number,
  ): Promise<boolean> {
    const dashboardUser = await this.getDashboardUser(userId, dashboardId);
    return dashboardUser.can_manage_users;
  }

  async getExistingInvitesIfExists(
    dashboardId: number,
    emails: string[],
  ): Promise<{
    existingInvites: Record<string, number>;
    nonPreExistingInvites: string[];
  }> {
    const { data, error } = await this.supabase
      .from("dashboard_user_invites")
      .select("id, email_address")
      .eq("dashboard_id", dashboardId)
      .in("email_address", emails);

    if (error) {
      throw new Error(`Error fetching existing invites: ${error.message}`);
    }

    const existingInvites: Record<string, number> = {};
    data.forEach((invite) => {
      existingInvites[invite.email_address] = invite.id;
    });

    const nonPreExistingInvites = emails.filter(
      (email) => !existingInvites[email],
    );
    return { existingInvites, nonPreExistingInvites };
  }

  async createInvites(
    dashboardId: number,
    emailAddresses: string[],
    invitedBy: string,
  ): Promise<Record<string, number>> {
    const { data, error } = await this.supabase
      .from("dashboard_user_invites")
      .insert(emailAddresses.map((email) => ({
        dashboard_id: dashboardId,
        email_address: email,
        invited_by: invitedBy,
      })))
      .select("id, email_address");

    if (error) {
      throw new Error(`Error creating invite: ${error.message}`);
    }

    const inviteKeys: Record<string, number> = {};
    data.forEach((invite) => {
      inviteKeys[invite.email_address] = invite.id;
    });
    return inviteKeys;
  }
}

import { supabase } from "@/lib/supabase.lib";
import { Tables } from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export type DashboardUserInviteDTO = Tables<"dashboard_user_invites">;

export class DashboardUserInvitesRepository {
    private static dashboardUserInvites = () =>
        supabase.from("dashboard_user_invites");

    public static async getDashboardUserInvites(
        dashboardId: number,
    ): Promise<DashboardUserInviteDTO[]> {
        const { data, error, status } = await this.dashboardUserInvites()
            .select()
            .eq("dashboard_id", dashboardId);

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.UserInvites,
                true,
                status,
            );
        } else {
            return data;
        }
    }

    public static async deleteDashboardUserInvite(
        inviteId: number,
    ): Promise<void> {
        const { error, status } = await this.dashboardUserInvites()
            .delete()
            .eq("id", inviteId);

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.UserInvites,
                true,
                status,
            );
        }
    }
}

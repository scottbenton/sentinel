import {
    DashboardUserInviteDTO,
    DashboardUserInvitesRepository,
} from "@/repository/dashboardUserInvites.repository";
import { AuthService } from "./auth.service";

export interface IDashboardUserInvite {
    id: number;
    dashboard_id: number;
    email: string;
    invitedBy: string;
    createdAt: Date;
}

export class DashboardUserInvitesService {
    public static async inviteUsers(
        dashboardId: number,
        emails: string[],
    ): Promise<void> {
        const accessToken = await AuthService.getAccessToken();
        if (!accessToken) {
            throw new Error("No access token");
        }
        try {
            await fetch(
                import.meta.env.VITE_API_URL +
                    `/dashboard-users/${dashboardId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emailAddresses: emails,
                    }),
                    method: "POST",
                },
            );
        } catch (e) {
            console.error(e);
            throw new Error("Error creating invites");
        }
    }

    public static async getDashboardUserInvites(
        dashboardId: number,
    ): Promise<IDashboardUserInvite[]> {
        const invites = await DashboardUserInvitesRepository
            .getDashboardUserInvites(
                dashboardId,
            );
        return invites.map(
            this.convertDashboardUserInviteDTOToIDashboardUserInvite,
        ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    public static async deleteDashboardUserInvite(
        inviteId: number,
    ): Promise<void> {
        return DashboardUserInvitesRepository.deleteDashboardUserInvite(
            inviteId,
        );
    }

    private static convertDashboardUserInviteDTOToIDashboardUserInvite(
        invite: DashboardUserInviteDTO,
    ): IDashboardUserInvite {
        return {
            id: invite.id,
            dashboard_id: invite.dashboard_id,
            email: invite.email_address,
            invitedBy: invite.invited_by,
            createdAt: new Date(invite.created_at),
        };
    }
}

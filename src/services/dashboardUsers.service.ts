import {
    DashboardUserDTO,
    DashboardUsersRepository,
} from "@/repository/dashboardUsers.repository";

export interface IDashboardUser {
    user_id: string;
    dashboard_id: number;
    canManageUsers: boolean;
    isAdmin: boolean;
    createdAt: Date;
}

export class DashboardUsersService {
    public static async getDashboardUser(
        userId: string,
        dashboardId: number,
    ): Promise<IDashboardUser> {
        return new Promise((resolve, reject) => {
            DashboardUsersRepository.getDashboardUser(userId, dashboardId)
                .then((dashboardUser) => {
                    resolve(
                        this.convertDashboardUserDTOToIDashboardUser(
                            dashboardUser,
                        ),
                    );
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    private static convertDashboardUserDTOToIDashboardUser(
        dashboardUser: DashboardUserDTO,
    ): IDashboardUser {
        return {
            user_id: dashboardUser.user_id,
            dashboard_id: dashboardUser.dashboard_id,
            canManageUsers: dashboardUser.can_manage_users,
            isAdmin: dashboardUser.is_admin,
            createdAt: new Date(dashboardUser.created_at),
        };
    }
}

import { RepositoryError } from "@/repository/_repositoryErrors";
import {
    DashboardUsersRepository,
    DashboardUserWithUserDTO,
} from "@/repository/dashboardUsers.repository";

export interface IDashboardUser {
    user_id: string;
    dashboard_id: number;
    canManageUsers: boolean;
    canManageMeetings: boolean;
    isAdmin: boolean;
    createdAt: Date;

    name: string;
    email: string;
}

export class DashboardUsersService {
    public static async getDashboardUsers(
        dashboardId: number,
    ): Promise<IDashboardUser[]> {
        return new Promise((resolve, reject) => {
            DashboardUsersRepository.getDashboardUsers(dashboardId)
                .then((dashboardUsers) => {
                    resolve(
                        dashboardUsers.map((user) =>
                            this.convertDashboardUserDTOToIDashboardUser(user)
                        ),
                    );
                })
                .catch((error: RepositoryError) => {
                    reject(error);
                });
        });
    }

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

    public static async updateDashboardUserPermissions(
        userId: string,
        dashboardId: number,
        canManageMeetings: boolean,
        canManageUsers: boolean,
        isAdmin: boolean,
    ): Promise<IDashboardUser> {
        return new Promise((resolve, reject) => {
            DashboardUsersRepository.updateDashboardUserPermissions(
                userId,
                dashboardId,
                canManageMeetings,
                canManageUsers,
                isAdmin,
            ).then((dashboardUser) =>
                resolve(
                    this.convertDashboardUserDTOToIDashboardUser(dashboardUser),
                )
            ).catch(reject);
        });
    }

    public static async deleteDashboardUser(
        userId: string,
        dashboardId: number,
    ): Promise<void> {
        return DashboardUsersRepository.deleteDashboardUser(
            userId,
            dashboardId,
        );
    }

    private static convertDashboardUserDTOToIDashboardUser(
        dashboardUser: DashboardUserWithUserDTO,
    ): IDashboardUser {
        return {
            user_id: dashboardUser.user_id,
            name: dashboardUser.users.display_name ?? "Unknown User",
            email: dashboardUser.users.email_address ?? "",
            dashboard_id: dashboardUser.dashboard_id,
            canManageUsers: dashboardUser.can_manage_users,
            canManageMeetings: dashboardUser.can_manage_meetings,
            isAdmin: dashboardUser.is_admin,
            createdAt: new Date(dashboardUser.created_at),
        };
    }
}

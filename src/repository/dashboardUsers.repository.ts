import { supabase } from "@/lib/supabase.lib";
import {
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";
import { UserDTO } from "./users.repository";

export type DashboardUserDTO = Tables<"dashboard_users">;
export type InsertDashboardUserDTO = TablesInsert<"dashboard_users">;
export type UpdateDashboardUserDTO = TablesUpdate<"dashboard_users">;

export type DashboardUserWithUserDTO = DashboardUserDTO & {
    users: UserDTO;
};

export class DashboardUsersRepository {
    private static dashboardUsers = () => supabase.from("dashboard_users");

    public static async getDashboardUsers(
        dashboardId: number,
    ): Promise<DashboardUserWithUserDTO[]> {
        const { data, error, status } = await this.dashboardUsers()
            .select("*, users(*)")
            .eq("dashboard_id", dashboardId);

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.User,
                false,
                status,
            );
        } else {
            return data;
        }
    }

    public static async createDashboardUser(
        dashboardUser: InsertDashboardUserDTO,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dashboardUsers()
                .insert(dashboardUser)
                .select()
                .single()
                .then((response) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(
                            getRepositoryError(
                                response.error,
                                ErrorVerb.Create,
                                ErrorNoun.User,
                                false,
                                response.status,
                            ),
                        );
                    } else {
                        resolve(response.data.user_id);
                    }
                });
        });
    }

    public static async updateDashboardUserPermissions(
        userId: string,
        dashboardId: number,
        canManageMeetings: boolean,
        canManageUsers: boolean,
        isAdmin: boolean,
    ): Promise<DashboardUserWithUserDTO> {
        const { data, error, status } = await this.dashboardUsers()
            .update({
                can_manage_meetings: canManageMeetings,
                can_manage_users: canManageUsers,
                is_admin: isAdmin,
            })
            .eq("user_id", userId)
            .eq("dashboard_id", dashboardId)
            .select("*, users(*)")
            .single();

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Update,
                ErrorNoun.User,
                false,
                status,
            );
        } else {
            return data;
        }
    }

    public static async deleteDashboardUser(
        userId: string,
        dashboardId: number,
    ): Promise<void> {
        const { error, status } = await this.dashboardUsers()
            .delete()
            .eq("user_id", userId)
            .eq("dashboard_id", dashboardId);

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.User,
                false,
                status,
            );
        }
    }
    public static async getDashboardUser(
        userId: string,
        dashboardId: number,
    ): Promise<DashboardUserWithUserDTO> {
        const { data, error, status } = await this.dashboardUsers()
            .select("*, users(*)")
            .eq("user_id", userId)
            .eq("dashboard_id", dashboardId)
            .single();

        if (error) {
            console.error(error);
            throw getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.User,
                false,
                status,
            );
        } else {
            return data;
        }
    }
}

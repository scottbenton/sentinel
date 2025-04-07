import { supabase } from "@/lib/supabase.lib";
import {
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export type DashboardUserDTO = Tables<"dashboard_users">;
export type InsertDashboardUserDTO = TablesInsert<"dashboard_users">;
export type UpdateDashboardUserDTO = TablesUpdate<"dashboard_users">;

export class DashboardUsersRepository {
    private static dashboardUsers = () => supabase.from("dashboard_users");

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

    public static async getDashboardUser(
        userId: string,
        dashboardId: number,
    ): Promise<DashboardUserDTO> {
        return new Promise((resolve, reject) => {
            this.dashboardUsers()
                .select("*")
                .eq("user_id", userId)
                .eq("dashboard_id", dashboardId)
                .single()
                .then(({ data, error, status }) => {
                    if (error) {
                        console.error(error);
                        reject(
                            getRepositoryError(
                                error,
                                ErrorVerb.Read,
                                ErrorNoun.User,
                                false,
                                status,
                            ),
                        );
                    } else {
                        resolve(data);
                    }
                });
        });
    }
}

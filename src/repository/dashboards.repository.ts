import { supabase } from "@/lib/supabase.lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase-generated.types";
import {
  ErrorNoun,
  ErrorVerb,
  getRepositoryError,
  RepositoryError,
} from "./_repositoryErrors";
import { createSubscription } from "./_subscriptionManager";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type DashboardDTO = Tables<"dashboards">;
export type InsertDashboardDTO = TablesInsert<"dashboards">;
export type UpdateDashboardDTO = TablesUpdate<"dashboards">;

export class DashboardsRepository {
  private static dashboards = () => supabase.from("dashboards");

  public static getUsersDashboards(
    userId: string,
  ): Promise<DashboardDTO[] | null> {
    return new Promise((resolve, reject) => {
      this.dashboards()
        .select("*, dashboard_users!inner(*)")
        .eq("dashboard_users.user_id", userId)
        .then(({ data, error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.Dashboards,
                true,
                status,
              ),
            );
          } else {
            resolve(data);
          }
        });
    });
  }

  public static listenToDashboard(
    dashboardId: number,
    onDashboardChanged: (dashboard: DashboardDTO) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    const doInitialLoad = () => {
      this.dashboards().select("*").eq(
        "id",
        dashboardId,
      ).single().then(({ data, error, status }) => {
        if (error) {
          console.error(error);
          onError(
            getRepositoryError(
              error,
              ErrorVerb.Read,
              ErrorNoun.Dashboards,
              false,
              status,
            ),
          );
        } else {
          onDashboardChanged(data);
        }
      });
    };

    const handlePayload = (
      payload: RealtimePostgresChangesPayload<DashboardDTO>,
    ) => {
      if (payload.errors) {
        console.error(payload.errors);
        onError(
          getRepositoryError(
            payload.errors,
            ErrorVerb.Read,
            ErrorNoun.Dashboards,
            false,
          ),
        );
      }
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        onDashboardChanged(payload.new);
      }
    };

    return createSubscription<DashboardDTO>(
      `dashboard:${dashboardId}`,
      "dashboards",
      `id=eq.${dashboardId}`,
      doInitialLoad,
      handlePayload,
    );
  }

  public static createDashboard(
    dashboard: InsertDashboardDTO,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.dashboards().insert(dashboard).select().single().then(
        ({ data, error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Create,
                ErrorNoun.Dashboards,
                true,
                status,
              ),
            );
          } else {
            resolve(data.id);
          }
        },
      );
    });
  }

  public static updateDashboard(
    dashboardId: number,
    dashboard: UpdateDashboardDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dashboards().update(dashboard).eq("id", dashboardId).then(
        ({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Update,
                ErrorNoun.Dashboards,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        },
      );
    });
  }

  public static deleteDashboard(dashboardId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dashboards().delete().eq("id", dashboardId).then(
        ({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.Dashboards,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        },
      );
    });
  }
}

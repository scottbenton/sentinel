import { RepositoryError } from "@/repository/_repositoryErrors";
import {
  DashboardDTO,
  DashboardsRepository,
  InsertDashboardDTO,
} from "@/repository/dashboards.repository";
import { DashboardUsersRepository } from "@/repository/dashboardUsers.repository";
import { AuthService } from "./auth.service";

export interface IDashboard {
  id: number;
  label: string;
  createdAt: Date;
}

export class DashboardsService {
  public static createDashboard(
    dashboardName: string,
    uid: string,
  ): Promise<number> {
    const dashboard: InsertDashboardDTO = {
      label: dashboardName,
    };

    return new Promise((resolve, reject) => {
      DashboardsRepository.createDashboard(dashboard)
        .then((dashboardId) => {
          DashboardUsersRepository.createDashboardUser({
            dashboard_id: dashboardId,
            user_id: uid,
            can_manage_users: true,
            can_manage_meetings: true,
            is_admin: true,
          }).then(() => {
            resolve(dashboardId);
          }).catch((err) => {
            reject(err);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static async getUsersDashboards(
    userId: string,
  ): Promise<IDashboard[]> {
    return new Promise((resolve, reject) => {
      DashboardsRepository.getUsersDashboards(userId)
        .then((dashboards) => {
          if (dashboards) {
            resolve(
              dashboards.map(this.convertDashboardDTOToIDashboard),
            );
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static listenToDashboard(
    dashboardId: number,
    onDashboardChanged: (dashboard: IDashboard) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    return DashboardsRepository.listenToDashboard(
      dashboardId,
      (dashboard) => {
        onDashboardChanged(this.convertDashboardDTOToIDashboard(dashboard));
      },
      onError,
    );
  }

  public static updateDashboardLabel(
    dashboardId: number,
    label: string,
  ): Promise<void> {
    return DashboardsRepository.updateDashboard(dashboardId, { label });
  }

  public static deleteDashboard(dashboardId: number): Promise<void> {
    return DashboardsRepository.deleteDashboard(dashboardId);
  }

  public static async runDashboardSync(
    dashboardId: number,
  ): Promise<void> {
    const accessToken = await AuthService.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/scraper/dashboard/${dashboardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
        },
      );
      if (!response.ok) {
        throw new Error("Error requesting a dashboard sync");
      }
    } catch (e) {
      console.error(e);
      throw new Error("Error requesting a dashboard sync");
    }
  }

  private static convertDashboardDTOToIDashboard(
    dashboard: DashboardDTO,
  ): IDashboard {
    return {
      id: dashboard.id,
      label: dashboard.label,
      createdAt: new Date(dashboard.created_at),
    };
  }
}

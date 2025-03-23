import { RepositoryError } from "@/repository/_repositoryErrors";
import {
  DashboardDTO,
  DashboardsRepository,
  InsertDashboardDTO,
} from "@/repository/dashboards.repository";
import { DashboardUsersRepository } from "@/repository/dashboardUsers.repository";

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

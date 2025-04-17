import { RepositoryError } from "@/repository/_repositoryErrors";
import {
  OrganizationDTO,
  OrganizationsRepository,
} from "@/repository/organizations.repository";
import { AuthService } from "./auth.service";

export interface IOrganization {
  id: number;
  name: string;
  url: string;

  syncError: string | null;
  lastSynced: Date | null;
  createdAt: Date;
}

export class OrganizationsService {
  public static listenToOrganizations(
    dashboardId: number,
    onOrganizationChange: (
      organizations: IOrganization[],
      deletedOrganizationIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    return OrganizationsRepository.listenToOrganizations(
      dashboardId,
      (organizations, deletedOrganizationIds, replaceState) => {
        onOrganizationChange(
          organizations.map(
            this.getIOrganizationFromOrganizationDTO,
          ),
          deletedOrganizationIds,
          replaceState,
        );
      },
      onError,
    );
  }

  public static async createOrganization(
    dashboardId: number,
    name: string,
    url: string,
  ): Promise<number> {
    const orgId = await OrganizationsRepository.createOrganization(
      {
        dashboard_id: dashboardId,
        name,
        url,
      },
    );

    this.runOrganizationSync(orgId).catch((e) => {
      console.error(
        `Error running organization sync for ${orgId}: ${e}`,
      );
    });

    return orgId;
  }

  public static updateOrganization(
    organizationId: number,
    name: string,
    url: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      OrganizationsRepository.updateOrganization(organizationId, {
        name,
        url,
      })
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  public static deleteOrganization(
    organizationId: number,
  ): Promise<void> {
    return OrganizationsRepository.deleteOrganization(organizationId);
  }

  public static async runOrganizationSync(
    organizationId: number,
  ): Promise<void> {
    const accessToken = await AuthService.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/scraper/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
        },
      );
      if (!response.ok) {
        throw new Error("Error requesting an organization sync");
      }
    } catch (e) {
      console.error(e);
      throw new Error("Error requesting an organization sync");
    }
  }

  private static getIOrganizationFromOrganizationDTO(
    organizationDTO: OrganizationDTO,
  ): IOrganization {
    return {
      id: organizationDTO.id,
      name: organizationDTO.name,
      url: organizationDTO.url,
      syncError: organizationDTO.sync_error,
      lastSynced: organizationDTO.last_synced
        ? new Date(organizationDTO.last_synced)
        : null,
      createdAt: new Date(organizationDTO.created_at),
    };
  }
}

import { supabase } from "@/lib/supabase.lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase-generated.type";
import {
  ErrorNoun,
  ErrorVerb,
  getRepositoryError,
  RepositoryError,
} from "./_repositoryErrors";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createSubscription } from "./_subscriptionManager";

export type OrganizationDTO = Tables<"organizations">;
export type InsertOrganizationDTO = TablesInsert<"organizations">;
export type UpdateOrganizationDTO = TablesUpdate<"organizations">;

export class OrganizationsRepository {
  private static organizations = () => supabase.from("organizations");

  public static listenToOrganizations(
    dashboardId: number,
    onOrganizationChanges: (
      organizations: OrganizationDTO[],
      deletedOrganizationIds: number[],
      overwrite: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    const doInitialLoad = () => {
      this.organizations().select().eq("dashboard_id", dashboardId).then(
        ({ data, error, status }) => {
          if (error) {
            console.error(error);
            onError(getRepositoryError(
              error,
              ErrorVerb.Read,
              ErrorNoun.Organizations,
              true,
              status,
            ));
          } else {
            onOrganizationChanges(data, [], true);
          }
        },
      );
    };

    const handlePayload = (
      payload: RealtimePostgresChangesPayload<OrganizationDTO>,
    ) => {
      if (payload.errors) {
        console.error(payload.errors);
        onError(
          getRepositoryError(
            payload.errors,
            ErrorVerb.Read,
            ErrorNoun.Organizations,
            false,
          ),
        );
      }
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        onOrganizationChanges([payload.new], [], false);
      } else if (payload.eventType === "DELETE" && payload.old.id) {
        onOrganizationChanges([], [payload.old.id], false);
      } else {
        onError(
          getRepositoryError(
            "Unknown event type",
            ErrorVerb.Read,
            ErrorNoun.Organizations,
            true,
          ),
        );
        console.error("Unknown event type", payload.eventType);
      }
    };

    return createSubscription<OrganizationDTO>(
      `organizations:dashboard_id=eq.${dashboardId}`,
      "organizations",
      `dashboard_id=eq.${dashboardId}`,
      doInitialLoad,
      handlePayload,
    );
  }

  public static createOrganization(
    organization: InsertOrganizationDTO,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.organizations()
        .insert(organization)
        .select()
        .single()
        .then(({ data, error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Create,
                ErrorNoun.Organizations,
                false,
                status,
              ),
            );
          } else {
            resolve(data.id);
          }
        });
    });
  }

  public static updateOrganization(
    organizationId: number,
    organization: UpdateOrganizationDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.organizations()
        .update(organization)
        .eq("id", organizationId)
        .select()
        .single()
        .then(({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Update,
                ErrorNoun.Organizations,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static deleteOrganization(organizationId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.organizations()
        .delete()
        .eq("id", organizationId)
        .then(({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.Organizations,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}

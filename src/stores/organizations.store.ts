import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import {
  IOrganization,
  OrganizationsService,
} from "@/services/organizations.service";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useEffect } from "react";

interface OrganizationsStoreState {
  organizations: Record<number, IOrganization>;
  organizationsLoading: boolean;
  organizationsError: string | null;
}
interface OrganizationsStoreActions {
  listenToOrganizations: (dashboardId: number) => () => void;
  createOrganization: (
    dashboardId: number,
    name: string,
    url: string,
  ) => Promise<number>;
  updateOrganization: (
    organizationId: number,
    name: string,
    url: string,
  ) => Promise<void>;
  deleteOrganization: (
    organizationId: number,
  ) => Promise<void>;
  runOrganizationSync: (
    organizationId: number,
  ) => Promise<void>;
  resetStore: () => void;
}

const defaultState: OrganizationsStoreState = {
  organizations: {},
  organizationsLoading: true,
  organizationsError: null,
};

export const useOrganizationsStore = createWithEqualityFn<
  OrganizationsStoreState & OrganizationsStoreActions
>()(
  immer((set) => ({
    ...defaultState,
    listenToOrganizations: (dashboardId) => {
      return OrganizationsService.listenToOrganizations(
        dashboardId,
        (organizations, deletedOrganizationIds, replaceState) => {
          set((state) => {
            if (replaceState) {
              state.organizations = {};
            }
            organizations.forEach((organization) => {
              state.organizations[organization.id] = organization;
            });
            deletedOrganizationIds.forEach((id) => {
              delete state.organizations[id];
            });
            state.organizationsLoading = false;
            state.organizationsError = null;
          });
        },
        (error) => {
          set((state) => {
            state.organizationsLoading = false;
            state.organizationsError = error.message;
          });
        },
      );
    },
    createOrganization: (dashboardId, name, url) => {
      return OrganizationsService.createOrganization(dashboardId, name, url);
    },
    updateOrganization: (organizationId, name, url) => {
      return OrganizationsService.updateOrganization(
        organizationId,
        name,
        url,
      );
    },
    deleteOrganization: (organizationId) => {
      return OrganizationsService.deleteOrganization(
        organizationId,
      );
    },

    runOrganizationSync: (organizationId) => {
      return OrganizationsService.runOrganizationSync(
        organizationId,
      );
    },

    resetStore: () => {
      set(defaultState);
    },
  })),
  deepEqual,
);

export function useSyncOrganizations() {
  const dashboardId = useDashboardId();

  const listenToOrganizations = useOrganizationsStore(
    (store) => store.listenToOrganizations,
  );
  const resetStore = useOrganizationsStore((store) => store.resetStore);

  useEffect(() => {
    if (dashboardId) {
      const unsubscribe = listenToOrganizations(dashboardId);
      return () => {
        resetStore();
        unsubscribe();
      };
    }
  }, [dashboardId, listenToOrganizations, resetStore]);
}

export function useCurrentOrganization<T>(
  selector: (organization: IOrganization | undefined) => T,
): T {
  const organizationId = useOrganizationId();

  return useOrganizationsStore((store) =>
    selector(store.organizations[organizationId])
  );
}

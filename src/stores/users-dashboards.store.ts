import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { DashboardsService, IDashboard } from "@/services/dashboards.service";
import { useUID } from "./auth.store";
import { useEffect } from "react";

interface UsersDashboardsStoreState {
  dashboards: Record<number, IDashboard>;
  loading: boolean;
  error: string | null;
}

interface UsersDashboardsStoreActions {
  loadUsersDashboards: (userId: string) => void;
  createDashboard: (dashboardName: string, uid: string) => Promise<number>;
}

export const useUsersDashboardsStore = createWithEqualityFn<
  UsersDashboardsStoreState & UsersDashboardsStoreActions
>()(
  immer((set) => ({
    dashboards: {},
    loading: true,
    error: null,

    loadUsersDashboards: (userId) => {
      DashboardsService.getUsersDashboards(userId)
        .then((dashboards) => {
          set((state) => {
            state.dashboards = dashboards.reduce((acc, dashboard) => {
              acc[dashboard.id] = dashboard;
              return acc;
            }, {} as Record<string, IDashboard>);
            state.loading = false;
            state.error = null;
          });
        })
        .catch((error) => {
          set((state) => {
            state.loading = false;
            state.error = error.message;
          });
        });
    },

    createDashboard: (dashboardName, uid) => {
      return DashboardsService.createDashboard(dashboardName, uid);
    },
  })),
  deepEqual,
);

export function useLoadUsersDashboards() {
  const uid = useUID();

  const loadUserDashboards = useUsersDashboardsStore(
    (store) => store.loadUsersDashboards,
  );

  useEffect(() => {
    if (uid) {
      loadUserDashboards(uid);
    }
  }, [uid, loadUserDashboards]);
}

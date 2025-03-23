import { DashboardsService, IDashboard } from "@/services/dashboards.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useEffect } from "react";
import { DashboardUsersService } from "@/services/dashboardUsers.service";
import { useUID } from "./auth.store";

interface DashboardStoreState {
    dashboard: IDashboard | null;
    loading: boolean;
    error: string | null;

    isUserAdmin: boolean;
    isDashboardAdmin: boolean;
}
interface DashboardStoreActions {
    listenToDashboard: (dashboardId: number, userId: string) => () => void;
    updateDashboardLabel: (label: string) => Promise<void>;
    resetStore: () => void;
}

const defaultState: DashboardStoreState = {
    dashboard: null,
    loading: true,
    error: null,
    isUserAdmin: false,
    isDashboardAdmin: false,
};

export const useDashboardStore = createWithEqualityFn<
    DashboardStoreState & DashboardStoreActions
>()(
    immer((set, getState) => ({
        ...defaultState,
        listenToDashboard: (dashboardId, userId) => {
            DashboardUsersService.getDashboardUser(userId, dashboardId).then(
                (user) => {
                    set((state) => {
                        state.isUserAdmin = user.canManageUsers;
                        state.isDashboardAdmin = user.isAdmin;
                    });
                },
            ).catch(() => {});

            return DashboardsService.listenToDashboard(
                dashboardId,
                (dashboard) => {
                    set((state) => {
                        state.dashboard = dashboard;
                        state.loading = false;
                        state.error = null;
                    });
                },
                (error) => {
                    set((state) => {
                        state.loading = false;
                        state.error = error.message;
                    });
                },
            );
        },
        updateDashboardLabel: (label) => {
            const dashboardId = getState().dashboard?.id;
            if (!dashboardId) {
                console.error("No dashboard to update");
                return Promise.reject("No dashboard to update");
            }
            return DashboardsService.updateDashboardLabel(dashboardId, label);
        },
        resetStore: () => {
            set(defaultState);
        },
    })),
    deepEqual,
);

export function useListenToCurrentDashboard() {
    const uid = useUID();
    const dashboardId = useDashboardId();

    const listenToDashboard = useDashboardStore(
        (store) => store.listenToDashboard,
    );
    const resetStore = useDashboardStore((store) => store.resetStore);

    useEffect(() => {
        if (uid) {
            const unsubscribe = listenToDashboard(dashboardId, uid);

            return () => {
                resetStore();
                unsubscribe();
            };
        }
    }, [uid, dashboardId, listenToDashboard, resetStore]);
}

export function useIsDashboardAdmin() {
    return useDashboardStore((store) => store.isDashboardAdmin);
}
export function useIsUserAdmin() {
    return useDashboardStore((store) => store.isUserAdmin);
}

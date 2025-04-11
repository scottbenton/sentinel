import {
    DashboardUsersService,
    IDashboardUser,
} from "@/services/dashboardUsers.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useEffect } from "react";

interface DashboardUsersStoreState {
    dashboardUsers: Record<string, IDashboardUser>;
    loading: boolean;
    error: string | null;
}

interface DashboardUsersStoreActions {
    getAllDashboardUsers: (dashboardId: number) => Promise<IDashboardUser[]>;
    updateDashboardUserPermissions: (
        userId: string,
        dashboardId: number,
        canManageMeetings: boolean,
        canManageUsers: boolean,
        isAdmin: boolean,
    ) => Promise<IDashboardUser>;
    deleteDashboardUser: (userId: string, dashboardId: number) => Promise<void>;
    resetStore: () => void;
}

const defaultState: DashboardUsersStoreState = {
    dashboardUsers: {},
    loading: true,
    error: null,
};

export const useDashboardUsersStore = createWithEqualityFn<
    DashboardUsersStoreState & DashboardUsersStoreActions
>()(
    immer((set) => ({
        ...defaultState,
        getAllDashboardUsers: (dashboardId) => {
            set((state) => {
                state.loading = true;
            });
            return DashboardUsersService.getDashboardUsers(dashboardId)
                .then((dashboardUsers) => {
                    set((state) => {
                        state.dashboardUsers = Object.fromEntries(
                            dashboardUsers.map((user) => [user.user_id, user]),
                        );
                        state.loading = false;
                    });
                    return dashboardUsers;
                })
                .catch((error) => {
                    set((state) => {
                        state.error = error.message;
                        state.loading = false;
                    });
                    throw error;
                });
        },
        updateDashboardUserPermissions: (
            userId,
            dashboardId,
            canManageMeetings,
            canManageUsers,
            isAdmin,
        ) => {
            return DashboardUsersService.updateDashboardUserPermissions(
                userId,
                dashboardId,
                canManageMeetings,
                canManageUsers,
                isAdmin,
            ).then((user) => {
                set((state) => {
                    state.dashboardUsers[user.user_id] = user;
                });
                return user;
            });
        },
        deleteDashboardUser: (userId, dashboardId) => {
            return DashboardUsersService.deleteDashboardUser(
                userId,
                dashboardId,
            )
                .then(() => {
                    set((state) => {
                        delete state.dashboardUsers[userId];
                    });
                })
                .catch((error) => {
                    set((state) => {
                        state.error = error.message;
                    });
                    throw error;
                });
        },
        resetStore: () => set(() => defaultState),
    })),
    deepEqual,
);

export function useSyncDashboardUsers() {
    const dashboardId = useDashboardId();
    const resetStore = useDashboardUsersStore((store) => store.resetStore);

    useEffect(() => {
        if (dashboardId) {
            return resetStore();
        }
    }, [dashboardId, resetStore]);
}

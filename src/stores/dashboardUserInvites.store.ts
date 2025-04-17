import {
    DashboardUserInvitesService,
    IDashboardUserInvite,
} from "@/services/dashboardUserInvites.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useEffect } from "react";

interface DashboardUserInvitesStoreState {
    invites: IDashboardUserInvite[];
    loading: boolean;
    error: string | null;
}
interface DashboardUserInvitesStoreActions {
    loadInvites: (dashboardId: number) => Promise<void>;
    acceptInvite: (inviteId: number) => Promise<number>;
    createInvites: (
        dashboardId: number,
        emails: string[],
    ) => Promise<void>;
    deleteInvite: (inviteId: number) => Promise<void>;
    resetStore: () => void;
}

const defaultState: DashboardUserInvitesStoreState = {
    invites: [],
    loading: true,
    error: null,
};

export const useDashboardUserInvitesStore = createWithEqualityFn<
    DashboardUserInvitesStoreState & DashboardUserInvitesStoreActions
>()(
    immer((set, getState) => ({
        ...defaultState,
        loadInvites: (dashboardId: number) => {
            return new Promise((resolve, reject) => {
                set((store) => {
                    store.loading = true;
                });

                DashboardUserInvitesService.getDashboardUserInvites(
                    dashboardId,
                ).then((invites) => {
                    set((store) => {
                        store.invites = invites;
                        store.loading = false;
                        store.error = null;
                    });
                    resolve();
                }).catch((error) => {
                    set((store) => {
                        store.loading = false;
                        store.error = "Error loading invites";
                    });
                    reject(error);
                });
            });
        },
        acceptInvite: (inviteId: number) => {
            return DashboardUserInvitesService.acceptInvite(inviteId);
        },
        createInvites: (dashboardId: number, emails: string[]) => {
            return new Promise((resolve, reject) => {
                DashboardUserInvitesService.inviteUsers(
                    dashboardId,
                    emails,
                ).then(() => {
                    getState().loadInvites(dashboardId).catch(() => {});
                    resolve();
                }).catch(reject);
            });
        },
        deleteInvite: (inviteId: number) => {
            return new Promise((resolve, reject) => {
                DashboardUserInvitesService.deleteDashboardUserInvite(inviteId)
                    .then(() => {
                        set((store) => {
                            store.invites = store.invites.filter((invite) =>
                                invite.id !== inviteId
                            );
                            resolve();
                        });
                    }).catch(reject);
            });
        },
        resetStore: () => {
            set(defaultState);
        },
    })),
    deepEqual,
);

export function useSyncDashboardUserInvites() {
    const dashboardId = useDashboardId();
    const resetStore = useDashboardUserInvitesStore((store) =>
        store.resetStore
    );

    useEffect(() => {
        return () => {
            resetStore();
        };
    }, [resetStore, dashboardId]);
}

import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import { INotification, NotificationsService } from "./notifications.service";
import { useUID } from "@/stores/auth.store";
import { useEffect } from "react";

interface NotificationsState {
    notifications: Record<string, INotification>;
    isLoading: boolean;
    error: string | null;
}

interface NotificationsActions {
    subscribeToNotifications: (userId: string) => () => void;
    markNotificationAsRead: (id: string) => void;
    deleteNotification: (id: string) => Promise<void>;
}

const defaultState: NotificationsState = {
    notifications: {},
    isLoading: true,
    error: null,
};

export const useNotificationsStore = createWithEqualityFn<
    NotificationsState & NotificationsActions
>()(
    immer((set) => ({
        ...defaultState,

        deleteNotification: (id: string) => {
            return NotificationsService.deleteNotification(id);
        },

        subscribeToNotifications: (userId: string) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });

            return NotificationsService.subscribeToNotifications(
                userId,
                (changedNotifications, deletedIds, replaceState) => {
                    set((state) => {
                        if (replaceState) {
                            state.notifications = {};
                        }
                        changedNotifications.forEach((notification) => {
                            state.notifications[notification.id] = notification;
                        });
                        deletedIds.forEach((id) => {
                            delete state.notifications[id];
                        });
                        state.isLoading = false;
                        state.error = null;
                    });
                },
                (error) => {
                    set((state) => {
                        state.error = error.message;
                    });
                },
            );
        },
        markNotificationAsRead(id) {
            NotificationsService.markNotificationAsRead(id);
        },
    })),
    deepEqual,
);

export function useSyncNotifications() {
    const subscribeToNotifications = useNotificationsStore((store) =>
        store.subscribeToNotifications
    );
    const uid = useUID();

    useEffect(() => {
        if (uid) {
            return subscribeToNotifications(uid);
        }
    }, [subscribeToNotifications, uid]);
}

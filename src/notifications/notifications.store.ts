import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import { INotification, NotificationsService } from "./notifications.service";
import { useAuthStore } from "@/stores/auth.store";

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

        deleteNotification: async (id: string) => {
            const { error } = await service.deleteNotification(id);
            if (error) {
                set((state) => {
                    state.error = error.message;
                });
                return;
            }

            set((state) => {
                state.notifications = state.notifications.filter((n) =>
                    n.id !== id
                );
                state.unreadCount = state.notifications.filter((n) =>
                    !n.read_at
                ).length;
            });
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

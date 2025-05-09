import { LogsService, LogTypes } from "@/services/logs.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { ILog } from "@/services/logValidationUtil.service";

export interface LogsStoreState {
    logs: ILog[];
    loading: boolean;
    error: string | null;
    lastLoadedDate: Date | null;
}

export interface LogsStoreAcions {
    loadLogs: (params: {
        meetingId: number | null;
        organizationId: number | null;
    }) => void;
    loadNewLogs: (params: {
        meetingId: number | null;
        organizationId: number | null;
    }) => void;
    addLog: (params: {
        uid: string;
        meetingId: number | null;
        organizationId: number | null;
        content: string;
    }) => Promise<void>;
    updateLog: (logId: number, content: string) => Promise<void>;
    deleteLog: (logId: number) => Promise<void>;

    resetStore: () => void;
}

const defaultState: LogsStoreState = {
    logs: [],
    loading: false,
    error: null,
    lastLoadedDate: null,
};

export const useLogsStore = createWithEqualityFn<
    LogsStoreState & LogsStoreAcions
>()(
    immer((set, get) => ({
        ...defaultState,

        loadLogs: (params) => {
            set({ loading: true, error: null });

            LogsService.getLogs(params).then((logs) => {
                set((state) => {
                    state.logs = logs;
                    state.loading = false;
                    state.lastLoadedDate = new Date();
                });
            }).catch((error) => {
                set((state) => {
                    state.loading = false;
                    state.error = error.message;
                });
            });
        },
        loadNewLogs: (params) => {
            const lastLoadedDate = get().lastLoadedDate;
            if (!lastLoadedDate) {
                console.warn("No last loaded date found");
                return;
            }
            LogsService.getLogsAfter({ ...params, after: lastLoadedDate }).then(
                (logs) => {
                    set((state) => {
                        state.logs = [...state.logs, ...logs];
                        state.loading = false;
                        state.lastLoadedDate = new Date();
                    });
                },
            ).catch((error) => {
                set((state) => {
                    state.loading = false;
                    state.error = error.message;
                });
            });
        },
        addLog: async (params) => {
            const { uid, meetingId, organizationId, content } = params;
            return LogsService.createLog({
                uid,
                meetingId,
                organizationId,
                content,
                type: LogTypes.Comment,
            }).then(() => {
                get().loadNewLogs({
                    meetingId,
                    organizationId,
                });
            });
        },
        updateLog: async (logId, content) => {
            return LogsService.updateLog(logId, content).then((log) => {
                set((state) => {
                    const index = state.logs.findIndex((l) => l.id === log.id);
                    if (index !== -1) {
                        state.logs[index] = log;
                    }
                });
            });
        },
        deleteLog: async (logId) => {
            return LogsService.deleteLog(logId).then(() => {
                set((state) => {
                    state.logs = state.logs.filter((log) => log.id !== logId);
                });
            });
        },
        resetStore: () => {
            set(defaultState);
        },
    })),
    deepEqual,
);

export function useSyncLogsForItem(ids: {
    meetingId: number | null;
    organizationId: number | null;
}): void {
    const { meetingId, organizationId } = ids;

    const loadLogs = useLogsStore((store) => store.loadLogs);
    const loadNewLogs = useLogsStore((store) => store.loadNewLogs);
    const resetStore = useLogsStore((store) => store.resetStore);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (meetingId) {
            loadLogs({ meetingId, organizationId: null });
            interval = setInterval(() => {
                loadNewLogs({ meetingId, organizationId: null });
            }, 10000);
        } else if (organizationId) {
            loadLogs({ meetingId: null, organizationId });
            interval = setInterval(() => {
                loadNewLogs({ meetingId: null, organizationId });
            }, 10000);
        }
        return () => {
            resetStore();
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [meetingId, organizationId, loadLogs, resetStore, loadNewLogs]);
}

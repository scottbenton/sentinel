import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_CHECK_INTERVAL_MINUTES = 2;

export function usePWA() {
    return useRegisterSW({
        immediate: true,
        onRegisteredSW: (_, r) => {
            if (r) {
                console.log("Service worker registered");
                setInterval(() => {
                    console.log("Checking for service worker update");
                    r.update();
                }, UPDATE_CHECK_INTERVAL_MINUTES * 60 * 1000);
            }
        },
        onRegisterError(error) {
            console.log("SW registration error", error);
        },
    });
}

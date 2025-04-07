export function delaySeconds(timeInSeconds: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeInSeconds * 1000);
    });
}

export function formatDateForFilename(date: Date) {
    return date.toISOString().split("T")[0];
}

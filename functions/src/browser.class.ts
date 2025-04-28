import { Browser as PWBrowser, chromium, Page } from "playwright";

export class Browser {
    private url: string;
    private displayWidth: number;
    private displayHeight: number;

    private browser: PWBrowser;
    public page: Page;

    private initialPageTimeout = 4000; // 4 seconds

    constructor(url: string, displayWidth: number, displayHeight: number) {
        this.url = url;
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
    }

    async launch() {
        this.browser = await chromium.launch({
            headless: process.env.NODE_ENV === "production",
        });

        const context = await this.browser.newContext({
            viewport: {
                width: this.displayWidth,
                height: this.displayHeight,
            },
        });
        const page = await context.newPage();
        await page.goto(this.url, {
            waitUntil: "domcontentloaded",
        });

        // Wait for any animations or transitions to finish
        await page.waitForTimeout(this.initialPageTimeout);
        this.page = page;
    }

    async screenshot(): Promise<Buffer> {
        return await this.page.screenshot();
    }

    async shutdown() {
        await this.browser.close();
    }
}

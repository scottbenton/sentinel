import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { chromium as playwright } from "playwright";
import chromium from "@sparticuz/chromium";

import { BoardDocsScrapper } from "./scrapers/BoardDocsScraper.class";
import {
  getOrganization,
  updateOrganization,
} from "./lib/organizationTransactions";

export const scrape = onCall(
  {
    memory: "4GiB",
  },
  async (request) => {
    const organizationId = request.data.organizationId;
    const organization = await getOrganization(organizationId);

    const url = organization.url;
    logger.info(`Scraping ${url} for ${organization.name} - ${organizationId}`);
    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);

    let hasSynced = false;

    let boardDocsScraper = new BoardDocsScrapper(organizationId);

    if (await boardDocsScraper.checkWillScrape(page)) {
      hasSynced = true;
      await boardDocsScraper.scrape(page);
      await boardDocsScraper.uploadAgendasToStorage();
    }

    if (hasSynced) {
      await updateOrganization(organizationId, null, new Date());
    }

    await browser.close();
  }
);

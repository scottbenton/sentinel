import { Injectable, Logger } from "@nestjs/common";
import OpenAI from "openai";
import { Browser } from "./browser.class";

@Injectable()
export class AiScraperService {
    private openAI = new OpenAI();

    private readonly logger = new Logger(AiScraperService.name);

    private displayWidth = 1024;
    private displayHeight = 768;

    async scrapeURL(url: string, instruction: string) {
        this.logger.log(
            `Scraping URL: ${url} with instruction: ${instruction}`,
        );
        const browser = new Browser(url, this.displayWidth, this.displayHeight);
        await browser.launch();

        try {
            const response = await this.openAI.responses.create({
                model: "computer-use-preview",
                tools: [
                    {
                        type: "computer-preview",
                        display_width: this.displayWidth,
                        display_height: this.displayHeight,
                        environment: "browser",
                    },
                ],
                input: [
                    {
                        role: "developer",
                        content:
                            "You are a web scraping assistant. You will be given a URL and an instruction. Your task is to scrape the URL and provide the information as per the instruction.",
                    },
                    {
                        role: "user",
                        content: `Instruction: ${instruction}`,
                    },
                    {
                        role: "user",
                        content: `URL: ${url}`,
                    },
                ],
                reasoning: {
                    generate_summary: "concise",
                },
                truncation: "auto",
            });

            console.log("Response from OpenAI:", response);

            await browser.shutdown();

            return response.output_text;
        } catch (e) {
            this.logger.error("Error during scraping:", e);
            await browser.shutdown();
            return `Error during scraping: ${e}`;
        }
    }

    private async getScreenshot(screenshot: Buffer) {
        return screenshot.toString("base64");
    }
}

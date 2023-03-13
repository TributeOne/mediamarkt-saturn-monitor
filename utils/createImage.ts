import { Browser, Page } from "puppeteer"
import { errorWebhook } from "./webhooks/errorWebhook"

export const createImage = async (page: Page, browser: Browser, reasonMessage: string) => {
    let imgPath = reasonMessage + ".png"
    try {
        await page.screenshot({ path: imgPath, fullPage: true })
    }
    catch(e){
        errorWebhook(e)
        await browser.close()
        process.exit()
    }
}
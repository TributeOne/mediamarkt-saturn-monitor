import { Page } from "puppeteer"
import { monitor } from "../utils/monitorLog"

export const prepairWebsiteToScrape = async (page: Page) => {
    await clickAcceptCookiesButton(page)
    await clickLoadMoreButton(page)
    await autoScroll(page)
}

const clickAcceptCookiesButton = async (page: any) => { //TODO
    try {
        await page.waitForXPath('//*[@id="pwa-consent-layer-accept-all-button"]')
        monitor.log(`Click accept cookies button.`)
        const elements = await page.$x('//*[@id="pwa-consent-layer-accept-all-button"]')
        await elements[0].click()
        await page.waitForTimeout(3000) //TODO
        
    } catch (error) {
        //TODO WHAT TO DO WHEN COOKIES ARE ALREADY ACCEPTED?
    }
}

const clickLoadMoreButton = async (page: any) => { //TODO
    monitor.log(`Click load more products button.`)
    //*[@id="main-content"]/div[1]/div/div/div[2]/div[3]/button
    //*[@id="main-content"]/div[1]/div[1]/div/div[2]/div[4]/button'
    try {
        const elements = await page.$x('//*[@id="main-content"]/div[1]/div/div/div[2]/div[3]/button')
        await elements[0].click()
        await page.waitForTimeout(3000) //TODO
    } catch (error) {
        throw `ERROR: Load More Button not found.' ${error}`
    }
}

const autoScroll = async (page: any) => { //TODO
    monitor.log(`Scroll down the whole page to load every product.`)
    let websiteEndReached: Boolean = false
    while (!websiteEndReached) {
        const footerArrea = 3500
        let previousHeight = await page.evaluate('document.body.scrollHeight')
        //console.log(previousHeight)
        let newPreviousHeight = previousHeight - footerArrea
        //console.log(newPreviousHeight)
        await page.evaluate(`window.scrollTo(0, ${previousHeight - footerArrea})`)
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight - footerArrea}`)
        await page.waitForTimeout(4000)
        if (previousHeight == await page.evaluate('document.body.scrollHeight')){
            monitor.log(`End of the page reached`)
            websiteEndReached = !websiteEndReached
        }
    }
}
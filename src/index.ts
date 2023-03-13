import { Browser, executablePath, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { errorWebhook } from '../utils/webhooks/errorWebhook'
import { successWebhook } from '../utils/webhooks/successWebhook'
import { createImage } from '../utils/createImage'
import { getXPathMessage } from '../utils/getXPathMessage'
import { monitor } from '../utils/monitorLog'

const settingsJSON = require('../../config/settings.json');
const mediamarktJSON = require('../../config/mediamarkt.json');


//=============================================
//            Monitor Config
const runHeadless = settingsJSON["config"]["runHeadless"]
//            Webhook Config
//            Other Config
//=============================================

const startMonitor = (URL: string) => {
    puppeteer.use(StealthPlugin()).launch({ headless: runHeadless, defaultViewport: null, args: ['--window-size=1920,1080'], executablePath: executablePath(),}).then(async browser => {
        const page = await browser.newPage()
        runMonitor(page, browser, URL)
    })
}

const runMonitor = async (page: Page, browser: Browser, url: string) => {
    await accessWebsite(page, browser, url)
    await mediamarkt(page, browser, url)
}

const accessWebsite = async (page: Page, browser: Browser, url: string) => {
    try {
        await page.goto(url, {timeout: 30000})
    }
    catch(e){
        monitor.log(`Error, website ${url} unavailable: ${e}`)
        errorWebhook(e)
        await browser.close()
        process.exit()
    }
}

const mediamarkt = async (page: Page, browser: Browser, url: string) => {
        const productNumbers: Array<number> = []
        let runs: number = 1
        while (runs <= 360) {
            productNumbers.push(runs)
            runs++;
        }

        while(true) {
            await accessWebsite(page, browser, url)
            //await prepairWebsiteToScrape(page)
            const productsData = await scrapeProducts(page, browser, productNumbers)
        
            //console.log('productsData', productsData)
            if (productsData) {
                for (let productData of productsData) {
                    //console.log(productData)
                    switch (productData.statusMessage) {
                        case 'Leider keine Lieferung möglich':
                            await handlerInStock(page, browser, productData.statusMessage, "inStock", productData.productTitel, productData.productURL, productData.productImageURL)
                            //await page.waitForTimeout(3000)
                            //await handlerInStock(page, browser, xPathMessage, "inStock")
                            break;
                        case 'Online verfügbar':
                            //console.log('statusMessage', productData.statusMessage)
                            //console.log("productData.productImageURL ", productData.productImageURL)
                            break;
                        default:
                            await handlerUnexpectedCondition(page, browser, "Unexpected Condition" ,"unexpectedCondition")
                    }
                }
            }
            else{
                monitor.log('CRITICAL ERROR PRODUCTSDATA IS EMPTY')
            }

    
            await clearBrowser(page, browser, 'https://www.mediamarkt.de/')

            monitor.log('END HERE')
        }
}

const clearBrowser = async (page: Page, browser: Browser, url: string) => {
    await accessWebsite(page, browser, url)
    const client = await page.target().createCDPSession()
    await client.send('Network.clearBrowserCookies')
    await client.send('Network.clearBrowserCache')
    await page.waitForTimeout(3000)
}

const scrapeProducts = async (page: Page, browser: Browser, productNumbers: Array<number>) => {

    const productsPromises: Array<any> = productNumbers.map(productNumber => {
        const promiseA = new Promise(async (resolve, reject) => {
            let data = await statusMessageFinder(productNumber, page, browser)
            resolve(data)
          });
        return (promiseA)
    })

    const rawProductData = await Promise.all(productsPromises).then((productData) => {
        return productData
    })

    const productsData = await rawProductData.filter(productData => {
        return productData !== undefined;
      })


    if (productsData[0]) {
        monitor.log('Success all products found.')
        return productsData
    }
    else {
        monitor.log('CRITICAL ERROR NO PRODUCT FOUND.') //TODO
    }

}

const returnProductURL = async (page: any, productNumber: number) => {
    //console.log('returnProductURL reached')
    await page.waitForXPath('//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ productNumber +']/div/a', {timeout: 3000})
    const xpath_expression = await page.$x('//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ productNumber +']/div/a')
    const spanHref = 'https://www.mediamarkt.de' + await page.evaluate((span: { getAttribute: (arg0: string) => any }) => span.getAttribute('href'), xpath_expression[0])
    return await spanHref
}

const statusMessageFinder = async (number: number, page: Page, browser: Browser,) => {
    const pathes = [
        //[Status, productTitel, Image, Price]
        ['//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div/div/div[2]/div[4]/div[1]/div/div[1]/div/div/span', '//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div/div/div[2]/div[1]/div[1]/div[2]/p', '//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div/div/div[2]/div[2]/div/div/div/picture/img'],
        ['//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div[2]/div/div[3]/div[4]/div[1]/div/div[1]/div/div/span/span', '//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div[2]/div/div[3]/div[1]/div[1]/div[2]/p', '//*[@id="main-content"]/div[1]/div/div/div[2]/div[2]/div/div['+ number +']/div/a/div/div[2]/div/div[3]/div[2]/div/div/div/picture/img']
    ]

    let runs: number = 0
    for (let path of pathes) {
        runs++;
        try{
            await page.waitForXPath(path[0], {timeout: 3000})
            const productURL = await returnProductURL(page, number)
            const statusMessage = await getXPathMessage(page, browser, path[0])
            const productTitel = await getXPathMessage(page, browser, path[1])
            const productImageURL = await scrapeProductImage(page, path[2])
            //console.log('Message found on product:', giveNumberAZero(number), 'with xPath number:', runs, 'Message:' , statusMessage)
            return {'productURL': productURL, 'statusMessage': statusMessage, 'productTitel': productTitel, 'productImageURL': productImageURL, 'articleNumber': number}
        }
        catch(e){
            //console.log('ERROR XPATH NOT FOUND IN CASE ',runs)
        }
    }
}

const scrapeProductImage = async (page: any, imageXPath: string) => {
    try{
        await page.$x(imageXPath)
        const imageXPathExpression = await page.$x(imageXPath)
        const imageURL = await page.evaluate((span: { getAttribute: (arg0: string) => any }) => span.getAttribute('src'), imageXPathExpression[0])
        //console.log(imageURL)
        return imageURL
    }
    catch(e){
        return mediamarktJSON["products"]["productImageUrl"]
    }
}

const handlerOutOfStock = async (page: Page, browser: Browser, xPathMessage: string, reasonMessage: string) => {
    monitor.log(`Product Out of Stock. Reason: "${xPathMessage}". 30 seconds pause`)
    await createImage(page, browser, reasonMessage)
    await page.waitForTimeout(30000)
}

const handlerInStock = async (page: Page, browser: Browser, xPathMessage: string, reasonMessage: string, produktName: string, productUrl: string, productImage: string) => {
    //console.log(logname() + "Product in Stock. Reason:", xPathMessage, 'Try to send Webhook');
    //console.log(logname() + `30 minutes pause`)
    await successWebhook(produktName, productUrl, productImage)
    //await createImage(page, browser, reasonMessage)
    //await page.waitForTimeout(1800000)
}

const handlerUnexpectedCondition = async (page: Page, browser: Browser, xPathMessage: string, reasonMessage: string) => {
    monitor.log( "Product in unexpected condition. Reason: " + xPathMessage)
    monitor.log(`30 minutes break`)
    await createImage(page, browser, reasonMessage)
    await page.waitForTimeout(1800000)
}

//const oosURL = "https://www.mediamarkt.de/de/search.html?filter=category%3ACAT_DE_MM_626%2F%2FCAT_DE_MM_635%2F%2FCAT_DE_MM_7857&query=ps5"
const inStockURL = "https://www.mediamarkt.de/de/category/playstation-5-spiele-7858.html?ga_query=playstation%25205%2520spiele&ga_queryHash=7e91de0993f9cc16018b384f353f62c39aa2122cee7a13e8105623c56351a715&ga_queryRequestId=7e91de0993f9cc16018b384f353f62c39aa2122cee7a13e8105623c56351a715"

startMonitor(inStockURL)

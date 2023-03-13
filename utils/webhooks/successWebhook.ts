import { monitor } from "../monitorLog";


const {Webhook, MessageBuilder} = require("discord-webhook-node");

const settingsJSON = require('../../../config/settings.json');
const mediamarktJSON = require('../../../config/mediamarkt.json');

//=============================================
//            Monitor Config
const companyName = mediamarktJSON["companyName"]
const monitorVersion = settingsJSON["config"]["version"]
const topLevelDomain = mediamarktJSON["topLevelDomain"]
const companyLogo = mediamarktJSON["companyLogo"]
const webhookUrl = mediamarktJSON["webhooks"]["webhookUrl"]
//            Webhook Config
//            Other Config
//=============================================


export const successWebhook = async (produktName: string, productUrl: string, productImage: string) => {
    await webhook(produktName, productUrl, productImage)
}

const webhook = async (produktName: string, productUrl: string, productImage: string) => {

    const hook = new Webhook(webhookUrl)
    const embed = new MessageBuilder()
        .setTitle('RESTOCK: ' + produktName)
        .setAuthor(companyName + topLevelDomain, 'https://cdn.discordapp.com/attachments/926533178188005386/930150438827872256/completedonegreensuccessvalidicon-1320183462969251652.png', productUrl)
        .setURL(productUrl)
        .setColor('0x008800')
        .setThumbnail(productImage)
        .setDescription('Website is online.')
        .setFooter(monitorVersion + 'Monitor • by @TributeOne#2542', 'https://cdn.discordapp.com/attachments/926533178188005386/926571378214338590/L2.png')
    hook.setUsername(companyName + topLevelDomain)
    hook.setAvatar(companyLogo)

    try {
        await hook.send(embed)
        monitor.log(`Product ${produktName} Send to Webhook successful.`)
    } catch (error) {
        throw `${produktName} ERROR: Unable to send Webhook to Discord' ${error}`
    }
}
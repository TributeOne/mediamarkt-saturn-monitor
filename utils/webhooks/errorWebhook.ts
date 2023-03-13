const {Webhook, MessageBuilder} = require("discord-webhook-node");

const mediamarktJSON = require('../../../config/mediamarkt.json');
const errorWebhookUrl = mediamarktJSON["webhooks"]["errorWebhookUrl"]

export const errorWebhook = async (error: any) => {
    const hook = new Webhook(errorWebhookUrl)

    const embed = new MessageBuilder()
        .setTitle('ERROR:')
        .setColor('0xFF0000')
        .setDescription('Website error, cart button not found.' + error)
        .setFooter('Monitor • by @TributeOne#2542', 'https://cdn.discordapp.com/attachments/926533178188005386/926572593732022272/L_Hangtag.png')
        .setTimestamp()
    hook.send(embed)
}
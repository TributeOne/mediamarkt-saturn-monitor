const {Webhook, MessageBuilder} = require("discord-webhook-node");

export const webhookKermitLUEC = async () => {

    let companyName = "LEGO"
    let topLevelDomain = ".com"
    let produktName = "LEGO Titanic"
    let companyLogo = "https://cdn.discordapp.com/attachments/926533178188005386/957716539975540776/LEGO_logo.svg.png"
    let productUrl = "https://www.lego.com/de-de/product/lego-titanic-10294"
    let productImage = "https://cdn.discordapp.com/attachments/943198560957116527/964244698262831224/10294.webp"
    let webhookUrl = "https://discord.com/api/webhooks/943200984262385777/oRvaX6OybR8CKUC0tk23_vA4eTiCRYPyGwSi1tml8N4SFugQjcjjo8rxXXon3krW9iCG"
    let monitorVersion = "1.0.0 TS"

    const hook = new Webhook(webhookUrl);
    const embed = new MessageBuilder()
        .setTitle('RESTOCK: ' + companyName + ' ' + produktName)
        .setAuthor(companyName + topLevelDomain, 'https://cdn.discordapp.com/attachments/926533178188005386/930150438827872256/completedonegreensuccessvalidicon-1320183462969251652.png', productUrl)
        .setURL(productUrl)
        .setColor('0x008800')
        .setThumbnail(productImage)
        .setDescription('Website is online. An unexpected condition has occurred. It may be a restock.')
        .setFooter(monitorVersion + ' SNKRS-L Monitor • by @TributeOne#2542', 'https://cdn.discordapp.com/attachments/926533178188005386/926572593732022272/L_Hangtag.png')
        .setTimestamp()
    hook.setUsername(companyName + topLevelDomain)
    hook.setAvatar(companyLogo)
    hook.send(embed)
}


export const webhookLaFUEC = async () => {

    let company_name = "LEGO"

    let produktName = "LEGO Titanic"
    let productUrl = "https://www.lego.com/de-de/product/lego-titanic-10294"
    let product_image = "https://cdn.discordapp.com/attachments/943198560957116527/964244698262831224/10294.webp"
    let webhookUrl = "https://discord.com/api/webhooks/923238100220657685/HSj2kSJ8eofr0sMvqVWTQ6o8AL5ysWzyCbOO61gGLd0LsM7ZaB6c-3qEsbYqJrMO1WNg"

    const hook = new Webhook(webhookUrl);

    const embed = new MessageBuilder()
        .setTitle(produktName)
        .setURL(productUrl)
        .setColor('0xf54e04')
        .setDescription('an unexpected condition has occurred. It may be a restock.')
        .setThumbnail(product_image)
        .setFooter('La Familia ', 'https://cdn.discordapp.com/attachments/661244681820045312/690981785252790312/0_LA-FAMILIA_Logo_FINAL_Nov19_ohne-BG_PNG.png')
    hook.setUsername(company_name)
    hook.send(embed)
}
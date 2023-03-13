import { timeStamp } from "./timeStamp"
const mediamarktJSON = require('../../config/mediamarkt.json')
const companyName = mediamarktJSON["companyName"]

class Monitor {
  log(...args: (string | undefined)[]) {
    console.log(`[${timeStamp()} ${companyName} Monitor]`, args.filter(arg => arg !== undefined).join(' '))
  }
}

export const monitor = new Monitor()

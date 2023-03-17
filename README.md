# Mediamarkt Saturn Monitor


---
## _English:_
## Aim of the project
The goal of this project was to program a monitor for the electrical market MediaMarkt, which notifies the user via Discord Webhook about a restock of the desired product. The project was launched because it was almost impossible to get hold of a Playstation 5 from its release on November 12, 2020 until mid-2023. The problem was mainly that retailers made the restocks of PlayStations unannounced.

The script was developed purely for interest and demonstration purposes and was never used productively. I therefore strongly advise against using the script, as it may violate MediaMarkt's terms of use.

Originally, this script was created exclusively for the electronics retailer MediaMarkt. However, since MediaMarkt and Saturn use nearly identical websites, the script can be used for both websites.

Functionality of the script
The monitor is based on a webscraper, which was developed with Puppeteer. On the website of Mediamarkt you can search for a product you want to monitor. Without calling the product itself, you copy the link of the search query and replace this link in the variable _"inStockURL"_ in line 210 in the _"src/index.ts"_.

The script will automatically open the link and check all the product search suggestions shown for availability. If one is available, the link to the product with a matching image will be sent to the Discord webhook of your choice.

In the file _"config/mediamarkt.json"_ you can store the webhook link. How to get a webhook link you can read here:
https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

In the file _"config/settings.json"_ you can define if the webbrowser should be started in headless mode.

In the folder _"utils/webhooks"_ you can change the design of the webhook.

Installation and execution
Download the script with:
``sh
git clone URL
```

Execute yarn once to download the needed packages:
```sh
yarn
```


With "yarn start" you can start the script.
```sh
yarn start
```

To make sure that the script is automatically restarted in case of a crash, I recommend to manage the script from PM2.
https://pm2.keymetrics.io/docs/usage/quick-start/

---
## _German:_

## Ziel des Projekts
Das Ziel dieses Projekts war es, einen Monitor für den Elektromarkt MediaMarkt zu programmieren, der den Anwender per Discord Webhook über einen Restock des gewünschten Produkts benachrichtigt. Das Projekt wurde ins Leben gerufen, da es seit dem Release am 12. November 2020 bis Mitte 2023 nahezu unmöglich war, eine Playstation 5 zu ergattern. Das Problem bestand vor allem darin, dass Retailer die Restocks der PlayStations unangekündigt vorgenommen haben.

Das Script wurde rein aus Interesse und Demonstrationszwecken entwickelt und kam nie produktiv zum Einsatz. Ich rate daher dringlich davon ab, das Script zu verwenden, da es möglicherweise gegen die Nutzungsbedingungen von MediaMarkt verstößt.

Ursprünglich wurde dieses Skript ausschließlich für den Elektrohändler MediaMarkt entwickelt. Da jedoch sowohl MediaMarkt als auch Saturn eine fast identische Webseite verwenden, kann das Skript für beide Webseiten genutzt werden.

Funktionsweise des Scripts
Der Monitor basiert auf einem Webscraper, der mit Puppeteer entwickelt wurde. Auf der Webseite von Mediamarkt kann man nach einem Produkt suchen, welches man monitoren möchte. Ohne das Produkt selbst aufzurufen, kopiert man den Link der Suchanfrage und ersetzt diesen Link in der Variable _"inStockURL"_ in Zeile 210 in der _"src/index.ts"_.

Das Script wird automatisch den Link öffnen und alle gezeigten Produktsuchvorschläge auf die Verfügbarkeit prüfen. Wenn eines verfügbar ist, wird der Link zu dem Produkt mit einem passenden Bild an die Discord Webhook deiner Wahl geschickt.

In der Datei _"config/mediamarkt.json"_ kann man den Webhook Link hinterlegen. Wie man einen Webhook Link erhält, erfährt man hier:
https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

In der Datei _"config/settings.json"_ kann man festlegen, ob der Webbrowser im Headless-Modus gestartet werden soll.

Im Ordner _"utils/webhooks"_ kann man das Design der Webhook anpassen.

Installation und Ausführung
Lade das Script herunter mit:
```sh
git clone URL
```

Führe einmal yarn aus, um die benötigten Pakete herunterzuladen:
```sh
yarn
```


Mit "yarn start" kann man das Script starten.
```sh
yarn start
```

Damit das Script bei einem Absturz automatisch wieder gestartet wird, empfehle ich, das Script von PM2 zu verwalten.
https://pm2.keymetrics.io/docs/usage/quick-start/

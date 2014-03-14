smap-mobile
===========

###Introduction

sMap-mobile is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which supports a range of different browsers and devices (specified in the wiki). The framework can be extended by Leaflet controls.

For more information about smap-mobile, contact Johan Lahti (see below).

###Scope

sMap as a product consists of source code developed in the sMap project. This code is released under the Apache Software License 2.0.

The product is using a number of the third-party libraries, such as Leaflet and Boostrap etc. These are not included in the sMap product and are given as they are. 

Dessa ingår inte i sMap-produkten utan tillhandahålls som de är. The copyright for these libraries belong to their authors and protected by their own license.

The sMap package (i.e. the contents of this repository) consists of the sMap product on one hand, and the required third-party libraries on the other.

###Important information regarding data sources

Data sources, whether belonging to the sMap project, the sMap project's participants or anyone else, is not included neither in the product nor in the package. You need seek permission to use these data – from the publisher and/or from the copyright owner. This applies also when the data is linked from any other code.

###Get started

To get started, follow these steps:
1. Clone or download the source code of this repository
2. Adapt the file configs/config.js so that it refers to published data (e.g. WMS or WFS)
3. Upload the entire repository to a web server and point the browser to the index.html file
4. The map can be adapted by adding parameters to the URL, e.g. ?center=13,55.605&zoom=15&config=test.js

###Support

If you are using sMap mobile to make your own map, or if you change it, we would be grateful if you let us know and share your experiences and your code.

###Questions or suggestions?

We are happy for any type of feed-back. If you have questions regarding smap-mobile, contact Johan Lahti (johan.lahti (at) malmo.se).

For more generic questions about the sMap project – contact our project administrators Ulf Minör (ulf.minor (at) malmo.se) or Karl-Magnus Jönsson (karl-magnus.jonsson (at) kristianstad.se).


===========
Information in Swedish

###Introduktion

sMap-mobile är ett mjukvarupaket som bland annat bygger på Leaflet. Syftet med paketet är att tillhandahålla ett komplett ramverk och tillhörande utökningar som gör det möjligt att bygga enkla kartapplikationer framförallt för mobiler men även för desktop.

###Omfattning

sMap som produkt består av källkod som utvecklats av
sMap-projektet. Denna programkod är släppt under Apache Software
License 2.0.

Produkten i sig bygger på ett antal tredjepartsbibliotek såsom
Leaflet, Bootstrap med flera. Dessa ingår inte i
sMap-produkten utan tillhandahålls som de är. Upphovsrätten för dessa
tillhör sina respektive författare, och de är licenseriade under egen
licens.

Paketeringen av sMap (dvs, innehållet i detta källkodsförråd), består
av dels av sMap-produkten, dels av de nödvändiga
tredjepartsbiblioteken.

###Viktig information gällande datakällor

Datakällor, oavsett om de tillhör sMap-projektet, sMap-projektets deltagare eller någon annan ingår inte i vare sig produkt eller paketering.
Du måste söka tillstånd för att få använda dem hos respektive utgivare och/eller upphovsrättsinnehavare. Detta gäller även om vi skulle länka till dem i någon programkod.

###Komma igång

För att komma igång, gör följande:

1. Klona eller ladda ned källkoden i detta källkodsförråd.
2. Anpassa configs/config.js så att den refererar korrekta datakällor (t.ex. WMS eller WFS)
3. Ladda upp hela förrådet till en webbserver och besök index.html.
4. För att anpassa visningen kan man lägga till flera parametrar till webbadressen t.ex. ?center=13,55.605&zoom=15&config=test.js

###Bidrag

Om du använder sMap-mobile för att göra en egen karta, eller förändrar den, får du gärna höra av dig till oss och dela med dig av dina erfarenheter och dina ändringar.

###Frågor, synpunkter eller förslag?

Vi välkomnar all slags återkoppling!

För frågor som rör smap-mobile kontakta GIT-utvecklare Johan Lahti (johan.lahti (snabel-a) malmo.se).

För generella frågor om sMap – kontakta våra projektsamordnare Ulf Minör (ulf.minor (snabel-a) malmo.se) eller Karl-Magnus Jönsson (karl-magnus.jonsson (snabel-a) kristianstad.se).

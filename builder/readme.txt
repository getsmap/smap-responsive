== build.py ==

build.py är ett Python-skript som används för att slå ihop flera JS-filer och CSS-filer till
en av varje sort (en JS-fil och en CSS-fil). Den sammaslagna filen komprimeras
sedan med yuicompressor (Yahoos minifieringsverktyg). Resultatet blir en
komprimerad JS-fil och en komprimerad CSS-fil. Tanken är att skriptet ska
användas både vid produktifiering för att minska storleken och antalet filer.
Men även under utveckling då antalet CSS-filer överstiger maximalt tillåtna
32 st för IE.

== Konfigurering ==

Alla sökvägar anges antingen absolut (t ex som "C:/..." eller "/var/www/...") eller relativt
från build.py-skriptets perspektiv. T ex pekar "../test.txt" på en fil i mappen ovanför build.py.

Det finns två config-filer:
- configEnv: Anger sökväg till koden samt var filer ska sparas
- configSources: Anger sökvägar (.js och .css) till de filer som ska slås samman samt en
	del alternativ för sammanslagningen, såsom traversera kataloger.

PARAMETRAR FÖR CONFIG-ENV:

yuiPath: Sökvägen till yui-kompressorn. T ex "../yuicompressor-x-y-z.jar" eller ange absolut sökväg.
tempPathJS: Sökväg (med filnamn) där den sammanslagna JS-filen hamnar. T ex "../sMap_uncompressed.js".
tempPathCSS: Sökväg (med filnamn) där den sammanslagna CSS-filen hamnar. T ex "../sMap_uncompressed.css".
outPathJS: Sökvägen till slutliga sammanslagna OCH komprimerade JS-filen. T ex "../sMap_comp.js".
outPathCSS: Sökvägen till slutliga sammanslagna OCH komprimerade CSS-filen. T ex "../sMap_comp.css".
basePath: Rot-mapp för sökvägarna till de JS- och CSS-filer som anges nedan i parametrarna "css" och "js".
        Gör att man slipper ange hela sökvägen till alla filer. T ex basePath: "C:/Program/Apache/htdocs/sMap/modules/" och en
        css-fil: "BaselayerSwticher/BaselayerSwticher.css" så blir resultatet: "C:/Program/Apache/htdocs/modules/BaselayerSwticher/BaselayerSwticher.css"


PARAMETRAR FÖR CONFIG-SOURCES:

traverseDirs: Ange en eller flera mappar i en lista (vektor). Varje mapp söks igenom efter filer med extensionen ".js" eller ".css". Om traverseDirs är True skrivs egenskaperna (d.v.s. nycklarna/properties) "css" och "js" över.
css: En vektor [] med sökvägar (från angiven basePath) till alla CSS-filer som ska slås samman.
js: En vektor [] med sökvägar (från angiven basePath) till alla JS-filer som ska slås samman.



EXEKVERING:

Om jag bara vill använda default-filerna kan jag exekvera med:

python build.py

vilket är ekvivalent med:

python build.py config_env.json config_sources.json


Men om jag vill använda min egen config-fil kan jag exekvera med:

python build.py config_env_johan.json 

Då används sökvägarna i "config_env_johan.json" och källorna (filerna som ska slås samman) hämtas från config_sources.json.

Om jag vill använda andra källor än de som finns i default-configen kan jag skapa en ny fil med godtyckligt namn, t ex: "config_sources_johan.json", och då exekvera med:

python build.py config_env_johan.json config_sources_johan.json

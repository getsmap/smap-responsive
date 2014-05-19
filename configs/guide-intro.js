var config = {
		
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			},
			"91.123.201.52": {
				proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [],
			
		bl: [],
		
		plugins: [
		           {
		        	   init: "L.Control.GuideIntroScreen",
		        	   options: {
		        		   autoActivate: true,
		        		   bgSrc: "img/GuideIntroScreen/element-alfa-grey.png",
		        		   munLogoSrc: "img/GuideIntroScreen/Logotype_stor.jpg",
		        		   euLogoSrc: "img/GuideIntroScreen/EUlogo_Inv_v_RGB.gif",
		        		   autoActivate: true,
		        			
		        			position: 'bottomright',
		        			prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
		        			bgSrc: null,
		        			
		        			langs: {
		        				"sv": "Svenska",
		        				"en": "English"
		        			},
		        			
		        			words: {
		        				"sv": {
		        					btnStartTour: "Starta turen"
		        				},
		        				"en": {
		        					btnStartTour: "Start the tour"
		        				}
		        			},
		        			
		        			header: {
		        				"sv": {
		        					title: "Promenadstaden",
		        					subHeaders: ["Malmö museer, Science Center"]
		        				},
		        				"en": {
		        					title: "The walking city",
		        					subHeaders: ["Malmö museums, Science Center"]
		        				}
		        			},
		        			
		        			configs: [
		        			          {
		        			        	  configName: "guide-vh.js",
		        		        		  "sv": {
		        		        			  title: "Västra hamnen",
		        				        	  description: "Västra hamnen guidar dig genom Malmös modernaste och fräsigaste stadsdel."
		        		        		  },
		        		        		  "en": {
		        		        			  title: "Western harbor",
		        				        	  description: "This tour guides you through the most modern part of Malmö."
		        		        		  }
		        			          },
		        			          {
		        			        	  configName: "guide-industri.js",
		        			        	  disabledText: "Kommer snart!",
		        		        		  "sv": {
		        		        			  title: "Industristaden",
		        		        			  description: "Industrispåret guidar dig genom de gamla industrierna i Malmös innerstad."		        			  
		        		        		  },
		        		        		  "en": {
		        		        			  title: "The industrial city",
		        		        			  description: "This tour guides you to some old industrial buildings of Malmö"
		        		        		  }
		        			          },
		        			         
		        			          {
		        			        	  configName: "guide-rosengard.js",
		        			        	  disabledText: "Kommer snart!",
		        		        		  "sv": {
		        		        			  title: "Rosengård",
		        		        			  description: "Den här turen tar dig genom Sveriges kanske mest omtalade stadsdel."
		        		        		  },
		        		        		  "en": {
		        		        			  title: "Rose garden",
		        		        			  description: "This tour will take you through the infamous Rosengård."
		        		        		  }
		        			          }
		        	          ]
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;
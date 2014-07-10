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
			},
			"mobile.smap.se": {
				proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
			}
		},
		
		ol: [],
			
		bl: [],
		
		plugins: [
					{
	                    init: "L.Control.MalmoHeader",
	                    options: {}
	                },
		           {
		        	   init: "L.Control.GuideIntroScreen",
		        	   options: {
		        		   autoActivate: true,
		        		   bgSrc: "img/GuideIntroScreen/element-alfa-grey.png",
		        		   munLogoSrc: "img/GuideIntroScreen/scm-logg-85px.png", //"img/GuideIntroScreen/Logotype_stor.jpg",
		        		   euLogoSrc: "img/GuideIntroScreen/EUlogo_Inv_v_RGB.gif",
		        			
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
		        					subHeaders: [] //["Malmö museer, Science Center"]
		        				},
		        				"en": {
		        					title: "The walking city",
		        					subHeaders: [] //["Malmö museums, Science Center"]
		        				}
		        			},
		        			
		        			configs: [
		        			          {
		        			        	  configName: "guide-vh.js",
		        		        		  "sv": {
		        		        			  title: "Västra hamnen",
		        				        	  description: "En guide till olika aspekter av hållbarhet, i en av Malmös mest moderna stadsdelar."
		        		        		  },
		        		        		  "en": {
		        		        			  title: "Western harbor",
		        				        	  description: "A guide to different aspects of sustainability, in one of the most modern city districts in Malmö."
		        		        		  }
		        			          },
		        			          {
		        			        	  configName: "guide-industri.js",
		        			        	  disabledText: "Kommer snart!",
		        		        		  "sv": {
		        		        			  title: "Industristaden",
		        		        			  description: "En guide till de gamla industrierna i Malmös innerstad."		        			  
		        		        		  },
		        		        		  "en": {
		        		        			  title: "The industrial city",
		        		        			  description: "A guide to some of the old industrial buildings of Malmö"
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
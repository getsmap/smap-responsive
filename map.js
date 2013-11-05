var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.cloudmade.com/c5981e3f0d7040d2b8c6ca68875612b1/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

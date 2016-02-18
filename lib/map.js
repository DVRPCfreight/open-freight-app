//declare boundary of region
var oLat = 40.018, oLng = -75.148, zLevel = 10;             ///adjust lat-lon coordinates to center on your region
           

//declare basemaps
// Basemap Layers
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Esri_transportation = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 8,
        maxZoom: 18
});

var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});


//create map instance
var map = L.map("mapDIV", {
    minZoom: zLevel,
    zoomControl: false,
    layers: [Esri_WorldGrayCanvas]
}).setView([oLat, oLng],zLevel);

//add Layer Control to map
var baseLayers = {
    "Satellite": Esri_WorldImagery,      
    "Street Map": Esri_WorldGrayCanvas
};
L.control.layers(baseLayers).addTo(map);

//advanced handling of street labels on aerial
//Base and Overlay Handling
var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
function addStreetLabels(){ 
    var topLayer = (Esri_transportation).addTo(map);
    topPane.appendChild(topLayer.getContainer());
    topLayer.setZIndex(2);
};
map.on('moveend', function () {
    if (map.getZoom() > 13 && map.hasLayer(Esri_WorldImagery)){
        addStreetLabels();
               
    };
    if (map.getZoom() <= 13 ){
        map.removeLayer(Esri_transportation);        
    };
}); 
map.on('baselayerchange', function () {
    if (map.getZoom() > 13 && map.hasLayer(Acetate_all)){
           map.removeLayer(Esri_transportation);       
        };
    if (map.getZoom() > 13 && map.hasLayer(Esri_WorldImagery)){
           addStreetLabels();
       };
});



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////      Declare Data Layers Here        ///////////////////
//////////////////////////////////////////////////////////////////

//define Icon Set and Marker Types 
var IconPresets = {iconSet:'dynico', markerSet: 'open-freight', mapMarker: 'circle-cm', legendMarker: 'circle-md'};
 
//declare Base Info for layers
var layer1icon = L.OpenFreightMarkers.icon({
        icon: 'nhs', markerColor: 'red', layer:'layer1', title: 'Layer 1'}, IconPresets),
    layer2icon = L.OpenFreightMarkers.icon({
        icon: 'parking', markerColor: 'red', layer:'layer2', title: 'Layer 2'}, IconPresets),
    layer3icon = L.OpenFreightMarkers.icon({
        icon: 'nhs', markerColor: 'teal', layer:'layer3', title: 'Layer 3', onLoad:'no', legendMarker: 'checkbox'}, IconPresets),
    layer4icon = L.OpenFreightMarkers.icon({
        icon: 'bridge', markerColor: 'teal', layer:'layer4', title: 'Layer 4',legendMarker: 'checkbox'}, IconPresets);

//define search groups for each layer that will be searchable
var layer1Search = [], layer2Search = [], layer3Search = [], layer4Search = [], LayerStyle = [];

//define Layer 1 (polygon only)
var layer1 = L.geoJson(null, {
    style: {fillColor: "#F9AB90", fillOpacity:.50, weight:1, color:"#E0E0E0 ", opacity:.75},  
    onEachFeature: function (feature, layer){		//defines actions to be applied of each feature of layer
        layer.on({										//Event handler on each feature
            click: highlightLayer1,							//action on click --> function to be created in actions.js
            dblclick: zoomToFeature 						//action on double click  --> zoom to polygon function in action.js
        });
        layer1Search.push({							//push variables from json features to search arrays
            name: layer.feature.properties.Name,			//search name/field
            source: "Layer 1",								//layer source
            id: L.stamp(layer),								//leaflet id
            bounds: layer.getBounds()						//geometric bounds declaration for polygon
        });
    }
});
$.getJSON("data/layer1.json", function (data) {		//get data from json source
	layer1.addData(data);
});
polyLayer.push('layer1');

//define Layer 2 (point only)
var layer2 = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: layer2icon});	//declare icon to be used for point
        },
    onEachFeature: function (feature, layer){			//defines actions to be applied of each feature of layer
        layer.on({											//Event handler on each feature
           click: highlightLayer2,								//function on click --> function to be created in actions.js
            dblclick: zoomToPoint								//funciton on double click  --> zoom to point function in actions.js
        });
        layer2Search.push({								//push variables from json features to search arrays
            name: layer.feature.properties.Name,			//search name/field
            source: "Layer 2",								//layer source
            id: L.stamp(layer),								//leaflet id
            lat: layer.feature.geometry.coordinates[1],		//geometric bounds declaration for points (requires lat and lng)
            lng: layer.feature.geometry.coordinates[0]						
        });
    }
});  
$.getJSON("data/layer2.json", function (data) {
	layer2.addData(data);
});

//define Layer 3 (point and poly combo)
//declare point data first [same as point only] -- no search as search will be provided for with polygon feature
var layer3pt = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: layer3icon});	
        },
    onEachFeature: function (feature, layer){			
        layer.on({											
            click: highlightLayer3,					//click function handling specific to data type (one for point and one for polygon)	--> created in actions.js								
            dblclick: zoomToPoint								
        });
    }
});  
$.getJSON("data/layer3pt.json", function (data) {
	layer3pt.addData(data);
});
//declare polygon data for Layer 3 [same as Poly only]
var layer3poly = L.geoJson(null, {
    style: {weight:4, color:"#54C4C8", opacity:.75},    
    onEachFeature: function (feature, layer){
        layer.on({
            click: highlightLayer3,
            dblclick: zoomToFeature
        });
        layer3Search.push({
            name: layer.feature.properties.Name,
            source: "Layer 3",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });
    }
});
$.getJSON("data/layer3poly.json", function (data) {
    layer3poly.addData(data);
});
polyLayer.push('layer3poly');
//create layer group for Layer 3 point and polygon features
var layer3 = new L.FeatureGroup([layer3pt, layer3poly]);

//define Layer 4 (point and poly combo)
//declare point data first 
var layer4pt = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: layer4icon});	
        },
    onEachFeature: function (feature, layer){			
        layer.on({											
            click: highlightLayer4,								
            dblclick: zoomToPoint								
        });
    }
});  
$.getJSON("data/layer4pt.json", function (data) {
	layer4pt.addData(data);
});
//declare polygon data 
var layer4poly = L.geoJson(null, {
    style: {fillColor: "#C1332B", fillOpacity:.50, weight:1, color:"#E0E0E0 ", opacity:.75},   
    onEachFeature: function (feature, layer){
        layer.on({
            click: highlightLayer4,
            dblclick: zoomToFeature
        });
        layer4Search.push({
            name: layer.feature.properties.Name,
            source: "Layer 4",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });
    }
});
$.getJSON("data/layer4poly.json", function (data) {
    layer4poly.addData(data);
});
polyLayer.push('layer4poly');
//create layer group for Layer 4 point and polyline features
var layer4 = new L.FeatureGroup([layer4pt, layer4poly]);


///////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//  Create search functionality using Typeahead   ////
//////////////////////////////////////////////////////
 
$("#searchbox").click(function () {
    $(this).select();
});

// Typeahead search functionality
$(document).one("ajaxStop", function() {
    $("#loading").hide();
    //tokenize each search array using Bloodhound
    var layer1BH = new Bloodhound({
        name: "Layer 1",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: layer1Search,
        limit: 10
    });
    var layer2BH = new Bloodhound({
        name: "Layer 2",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: layer2Search,
        limit: 10
    });
   var layer3BH = new Bloodhound({
        name: "Layer 3",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: layer3Search,
        limit: 10
    });
    var layer4BH = new Bloodhound({
        name: "Layer 4",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: layer4Search,
        limit: 10
    });
   //initialize 
    layer1BH.initialize();
    layer2BH.initialize();
    layer3BH.initialize();
    layer4BH.initialize();
    //activate Typeahead on Searchbox DOM element
    $("#searchbox").typeahead({
    	//define options (see Typeahead documentation)
    	minLength: 2,
        highlight: true,
        hint: false
    },{
    	name: "Layer1data",
        displayKey: "name",
        source: layer1BH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Layer 1</h5>"
        }
    },{
    	name: "Layer2data",
        displayKey: "name",
        source: layer2BH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Layer 2</h5>"
        }
    },{
    	name: "Layer3data",
        displayKey: "name",
        source: layer3BH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Layer 3</h5>"
        }
	},{
    	name: "Layer4data",
        displayKey: "name",
        source: layer4BH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Layer 4</h5>"
        }
    }).on("typeahead:selected", function (obj, datum) {		//define action on selection of a search result
    	if (datum.source === "Layer 1") {						//action based on result source layer
            if (!map.hasLayer(layer1)) {						//Check if map has Layer visible
                map.addLayer(layer1);							//If not add layer
                $("#layer1").prop("checked", true);				//and change layer control item to checked 
            };
            map.fitBounds(datum.bounds);						//zoom to selection based on poly bounds (for polygon results)
            if (map._layers[datum.id]) {						//Apply action to selected result to fire a click event 
                map._layers[datum.id].fire("click");				// (this will fire the onClick event established for the layer and stored as a function in actions.js)
            }; 
        };
        if (datum.source === "Layer 2") {
            if (!map.hasLayer(layer2)) {
                map.addLayer(layer2);
                $("#layer2").prop("checked", true);
            };
            map.setView([datum.lat, datum.lng], 17);			//zoom to selection based on point and zoom level (for point only results)
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }; 
        };
       if (datum.source === "Layer 3") {	
            if (!map.hasLayer(layer3)) {	
                map.addLayer(layer3);	
                $("#layer3").prop("checked", true);				 
            };
            map.fitBounds(datum.bounds);						
            if (map._layers[datum.id]) {						
                map._layers[datum.id].fire("click");
            }; 
        };
        if (datum.source === "Layer 4") {	
            if (!map.hasLayer(layer4)) {	
                map.addLayer(layer4);	
                $("#layer4").prop("checked", true);				 
            };
            map.fitBounds(datum.bounds);						
            if (map._layers[datum.id]) {						
                map._layers[datum.id].fire("click");
            }; 
        };
    }).on("typeahead:opened", function () {
            $(".navbar-collapse.in").css("max-height", $(document).height()-$(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height()-$(".navbar-header").height());
        }).on("typeahead:closed", function () {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });

    

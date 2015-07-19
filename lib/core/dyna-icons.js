/*-----------------------------------------------------------
    Open Freight Dynamic Markers is a customized version of the Leaflet.AwesomeMarkers. 
    This plugin provides Open Freight App with the ability to add icon sets as markers.
    (c) 2014 Michael Ruane DVRPC

/*--------------------------------------------------------
  Leaflet.AwesomeMarkers, a plugin that adds colorful iconic markers for Leaflet, based on the Font Awesome icons
  (c) 2012-2013, Lennard Voogdt

  http://leafletjs.com
  https://github.com/lvoogdt
*/


/*global L*/

(function (window, document, undefined) {
    "use strict";
    /*
     * Leaflet.AwesomeMarkers assumes that you have already included the Leaflet library.
     */

    L.OpenFreightMarkers = {};

    L.OpenFreightMarkers.version = '1.0.0';

    L.OpenFreightMarkers.Icon = L.Icon.extend({
        options: {
            iconSize: [35, 46],
            iconAnchor:   [17, 42],
            popupAnchor: [1, -32],
            shadowAnchor: [10, 12],
            shadowSize: [36, 16],
            markerSet: 'open-freight',
            mapMarker: 'circle-md',
            iconSet: 'dynico',
            spinClass: 'fa-spin',
            extraClasses: '',
            icon: 'home',
            markerPre: '',
            markerColor: 'blue',
            iconColor: 'white',
            legendMarker: 'circle-md',
            layer:'',
            title: '',
            onLoad: 'yes'
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options;

            if (options.icon) {
                div.innerHTML = this._createInner();
            }

            if (options.bgPos) {
                div.style.backgroundPosition =
                    (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }

            this._setIconStyles(div, 'icon-' + options.markerPre + options.markerColor);
            return div;

        },

        _createInner: function() {
            var iconClass, iconSpinClass = "", iconColorClass = "", iconColorStyle = "", options = this.options;

            if(options.icon.slice(0,options.iconSet.length+1) === options.iconSet + "-") {
                iconClass = options.icon;
            } else {
                iconClass = options.iconSet + "-" + options.icon;
            }

            if(options.spin && typeof options.spinClass === "string") {
                iconSpinClass = options.spinClass;
            }

            if(options.iconColor) {
                if(options.iconColor === 'white' || options.iconColor === 'black') {
                    iconColorClass = "icon-" + options.iconColor;
                } else {
                    iconColorStyle = "style='color: " + options.iconColor + "' ";
                }
            }

            return "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.iconSet + " " + iconClass + " " + iconSpinClass + " " + iconColorClass + "'></i>";
        },

        _setIconStyles: function (img, name) {
            var options = this.options,
                size, 
                anchor;
            if (options.mapMarker === 'circle-sm' || options.mapMarker === 'crc-sm') {
                if (name === 'shadow') {size = L.point([30,30]);} else {size = L.point([28,28]);}
            } else if (options.mapMarker === 'circle-md' || options.mapMarker === 'crc-md') {
                if (name === 'shadow') {size = L.point([34,34]);} else {size = L.point([32,32]);}
            } else if (options.mapMarker === 'circle-cm' || options.mapMarker === 'crc-cm') {
                if (name === 'shadow') {size = L.point([34,16]);} else {size = L.point([28,36]);}
            }
            else {
                size = L.point(options[name === 'shadow' ? 'shadowSize' : 'iconSize']);
            }
            

            if (name === 'shadow') {
                if (options.mapMarker === 'circle-cm' || options.mapMarker === 'crc-cm') {
                    anchor = L.point([10,12]);
                } else if(options.mapMarker === 'circle-sm' || options.mapMarker === 'circle-md' || options.mapMarker === 'crc-md' || options.mapMarker === 'crc-sm') {
                    
                }else {
                   anchor = L.point(options.shadowAnchor || options.iconAnchor);
                }
            } else {
                if (options.mapMarker === 'circle-cm') {
                    anchor = L.point([14,34]);
                } else if(options.mapMarker === 'circle-sm' || options.mapMarker === 'circle-md' || options.mapMarker === 'crc-md' || options.mapMarker === 'crc-sm') {
                    
                }else if (options.mapMarker === 'crc-cm') {
                  anchor = L.point([14,34]);
                } else {
                    anchor = L.point(options.iconAnchor);
                }
            }

            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }
            if (name=== 'shadow') {
                img.className = options.mapMarker + '-' + name + ' ' + options.mapMarker;
            } else {
                img.className = options.markerSet + '-' + name + ' ' + options.mapMarker;
            }

            if (anchor) {
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop  = (-anchor.y) + 'px';
            }

            if (size) {
                img.style.width  = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        createShadow: function () {
            var div = document.createElement('div');

            this._setIconStyles(div, 'shadow');
            return div;
      }

      
    });
	//Dynamic Icon Marker Legend + Info Window Functionality
    L.createLegend = function (options) {
        window['DynaIcon' + options.layer] = ''+ options.iconSet +' '+ options.iconSet +'-'+options.icon+'';
        window['DynaClass'+ options.layer] =  ''+options.markerPre + options.markerColor+'';
        window['DynaTitle' + options.layer] = ''+options.title+'';
        if(options.legendMarker === 'checkbox'){
             $('#' + options.layer + '.dyna').wrap('<div class="checkbox" data-toggle="tooltip" title="Click to toggle layer"></div>').after('<label for="' + options.layer + '" class="dynacheck"><div class="legend-check"><i class="dynico dynico-square-o"></i></div> '+options.title+'</label>');
        }else{
            $('#' + options.layer + '.dyna').wrap('<div class="checkbox" data-toggle="tooltip" title="Click to toggle layer"></div>').after('<label for="' + options.layer + '"><div class="'+ options.legendMarker +' legend-icon '+ options.markerSet +'-icon-'+ options.markerPre + options.markerColor +'"><i class="'+options.iconSet+' '+options.iconSet+'-'+options.icon+'"></i></div> '+options.title+'</label>');
        }
        if(options.onLoad === 'no'){
        }else{
        	$('#' + options.layer + '.dyna').attr('checked', true);
        }
        
    };

    L.OpenFreightMarkers.icon = function (options, presets) {
            var Options = $.extend({},presets, options), markerPre = {};
            console.log(Options.markerSet)
            switch (Options.markerSet){
                case 'dyna-mark':
                    markerPre = {markerPre:'dm-'};
                    break;
                default:
                    markerPre = {markerPre:''};
                    break;

            };
            Options = $.extend({},Options, markerPre);
            L.createLegend(Options);
            return new L.OpenFreightMarkers.Icon(Options);
            
           
    };



}(this, document));
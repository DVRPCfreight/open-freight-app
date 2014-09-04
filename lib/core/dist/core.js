//***************************************///
//  Open Freight App Core Functions
//  with Integrate Dynamic Icon Layers and legend builder
//  Core.js
//  Version: 1.0.1
//

//JQuery extend..create functions for easing in place of JQuery UI
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{def: 'easeOutQuad',
easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    }
});

function setMap(){
    $('.landingUI').fadeOut('fast', 'easeOutQuad' , function (){
             $('.mapUI').fadeIn('fast', 'easeInQuad' );
             $('#mapDIV').fadeIn('fast', 'easeInQuad' );
             map.invalidateSize();
             setTimeout(function() {$("#loading").hide();}, 300);
        });  
}

//load content based on hash
$(function() {
  // Javascript to enable link to tab
  var url = document.location.toString();
  if (url.match('#')) {
    var tab_id = url.split('#')[1];
    var prev_tab = url.split('#')[1];
    if (tab_id != 'map' && tab_id != undefined) {
        $('#' + tab_id).show();   
    }else {
       setMap();
   }
  }else {
    $('#home').show();
  }
  // Change hash for page-reload
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    window.location.hash = e.target.hash;  
  });
});
        
function getLocationHash () {
  return window.location.hash.substring(1);
}

//create navigation of content based on hash changes for self contained app
$(window).bind('hashchange', function() {
    var tab_id = getLocationHash();
    if (tab_id != 'map') {
    	$('.mapUI').fadeOut('fast', 'easeOutQuad' , function (){
             $('.landingUI').fadeIn('fast', 'easeInQuad' );
        });
        $('.landtab-content > .tab-pane').hide();
        $("#oFFlanding").animate({ scrollTop: 0 }, 50);
        $('#' + tab_id).show();  
    }else {
        setMap();
    }
});

//change sidebar based on screen size if screen resized
$(window).resize(function () {
    $(".tt-dropdown-menu").css("max-height", $("#container").height() - $(".navbar").height() - 20);
    //sidebar handling if small screen
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").attr("class", "col-sm-12 col-lg-12 leaflet-container leaflet-fade-anim");
        $("#sidebar").css("display", "none");
        $("#toggle i").attr('class', 'glyphicon glyphicon-th-list');
        map.invalidateSize();
    } else {
        var sidebarViz = $("#sidebar").css("display");
        if (sidebarViz == "block") {
            $("#mapDIV").attr('class', 'col-sm-8 col-lg-9 leaflet-container leaflet-fade-anim');
            $("#toggle i").attr('class', 'glyphicon glyphicon-chevron-left');
        } else {
            $("#mapDIV").attr('class', 'col-sm-12 col-lg-12 leaflet-container leaflet-fade-anim');
            $("#toggle i").attr('class', 'glyphicon glyphicon-th-list');
        }
        map.invalidateSize();
    };
});

// Placeholder hack for IE
if (navigator.appName == "Microsoft Internet Explorer") {
    $("input").each(function () {
        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
            $(this).val($(this).attr("placeholder"));
            $(this).focus(function () {
                if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
            });
            $(this).blur(function () {
                if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
            });
        }
    });
}
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
    
//Document Ready
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").css("class", "col-sm-12 col-lg-12");
        $("#sidebar").css("display", "none");
    };
    $('input:checkbox[name="LayerCont"]').each( function () {
        var layers = [];
        if ($('#' + $(this).attr('id')).is(':checked')) {
            $('input:checkbox[name="LayerCont"]').each(function () {
                // Remove all overlay layers
                map.removeLayer(window[$(this).attr('id')]);
                if ($('#' + $(this).attr('id')).is(':checked')) {
                    // Add checked layers to array for sorting
                    layers.push({
                        'z-index': $(this).attr('z-index'),
                        'layer': $(this)
                    });
                }
            });
            // Sort layers array by z-index
            var orderedLayers = sortByKey(layers, 'z-index');
            // Loop through ordered layers array and add to map in correct order
            $.each(orderedLayers, function () {
                map.addLayer(window[$(this)[0].layer[0].id]);
            });
        } else {
            // Simply remove unchecked layers
            map.removeLayer(window[$(this).attr('id')]);
        }     
    });
    $('.panelinfo').addClass('glyphicon glyphicon-info-sign');
    //set checkbox status
    $('.legPanel').each(function(){
        var loadall = $(this).find('input.layer').length;
        var loadchecked = $(this).find('input.layer:checked').length;
        if (loadall == loadchecked) {
            $(this).closest('.panel').find('.checked_all').html('<div class="chkicon dynico dynico-check-square-o"></div>');
            $(this).closest('.panel-body').append('<input type="hidden" class="Chkd" value="false" />');
        } else {
            $(this).closest('.panel').find('.checked_all').html('<div class="chkicon dynico dynico-square-o"></div>');
            $(this).closest('.panel-body').append('<input type="hidden" class="Chkd" value="true" />');
        }
        var cbo = $(this).find('.dynacheck').length;
            if (cbo > 0){
                $(this).find('input.layer:checked').siblings('.dynacheck').find('.legend-check').html('<i class="dynico dynico-check-square-o"></i>');
            }
        });
    //layer group check all functionality
    $('.checked_all').on("click", function (e) {
        var listPanel = $(this).parent().siblings('.panel-collapse').children('.panel-body').children('input.Chkd');
        var $element = $(this);
            if (listPanel.attr('value') == 'true') {
                loadBar().done(function() {
                    $element.children().attr('class', 'chkicon dynico dynico-check-square-o');
                    $(listPanel).siblings('.checkbox').children('input').prop('checked', true).change();
                    $(listPanel).val('false');
                    $("#loading").fadeOut(150);
                });
            } else {
                $element.children().attr('class', 'chkicon dynico dynico-square-o');
                $(listPanel).siblings('.checkbox').children('input').prop('checked', false).change();
                $(listPanel).val('true');
            } 

     });
    function loadBar(){
        return $("#loading").show().delay(100).promise();
    }
   
});

///LayerControls: Order and add to Map as legend items are changed
//Z-index not yet functional in Leaflet

$('input:checkbox[name="LayerCont"]').on('change', function () {
    var layers = [];
    if ($('#' + $(this).attr('id')).is(':checked')) {
        $('input:checkbox[name="LayerCont"]').each(function () {
            // Remove all overlay layers
            map.removeLayer(window[$(this).attr('id')]);
            if ($('#' + $(this).attr('id')).is(':checked')) {
                // Add checked layers to array for sorting
                layers.push({
                    'z-index': $(this).attr('z-index'),
                    'layer': $(this)
                });
            }
        });
        // Sort layers array by z-index
        var orderedLayers = sortByKey(layers, 'z-index');
        // Loop through ordered layers array and add to map in correct order
        $.each(orderedLayers, function () {
            map.addLayer(window[$(this)[0].layer[0].id]);
        });
    } else {
        // Simply remove unchecked layers
        map.removeLayer(window[$(this).attr('id')]);
    }
});
//update check all button on layer toggle
$('.layer').change(function () {
    var all = $(this).closest('.panel-body').find('input.layer').length;
    var checked = $(this).closest('.panel-body').find('input.layer:checked').length;
    if (all == checked) {
        $(this).closest('.panel').find('.checked_all').children().attr('class', 'chkicon dynico dynico-check-square-o');
        $(this).closest('.panel-body').find('.Chkd').val('false');
    } else {
        $(this).closest('.panel').find('.checked_all').children().attr('class', 'chkicon dynico dynico-square-o');
        $(this).closest('.panel-body').find('.Chkd').val('true');
    }
    var cbo = $(this).siblings('.dynacheck').length;
    if (cbo > 0){
        if($(this).is(':checked')){
            $(this).siblings('.dynacheck').find('.legend-check i').attr('class', 'dynico dynico-check-square-o');
        }else{
            $(this).siblings('.dynacheck').find('.legend-check i').attr('class', 'dynico dynico-square-o');
        }
    }
});
//Sidebar Toggle button
$("#toggle").click(function () {
    $("#toggle i").toggleClass("glyphicon-chevron-left glyphicon-th-list");
    $("#mapDIV").toggleClass("col-sm-8 col-lg-9 col-sm-12 col-lg-12");
    var sidebarViz = $("#sidebar").css("display");
    if (sidebarViz == "block") {
        $("#sidebar").css("display", "none");
    } else {
        $("#sidebar").css("display", "block");
    }
    if (document.body.clientWidth <= 767) {
        $("#mapDIV").toggleClass("hidden");
    };
    map.invalidateSize();
    return false;
});

///////////////////////////////////////////////////
/////   Info window Functionality   //////////////
//////////////////////////////////////////////////
function toggleinfo(e) {
    if ($('#togbtn').hasClass('hide')) {
        $('#togbtn').removeClass('hide');
    };
    if ($('#togbtn').hasClass('glyphicon-plus')) {
        $('#togbtn').attr('class', 'glyphicon glyphicon-minus InfoTgl');
    } else {};
    var h = document.getElementById('info').offsetHeight + document.getElementById('infoheader').offsetHeight;
    $('#infobox_').addClass('active').css('bottom', h);
};

function togglemin(e) {
    if ($('#togbtn').hasClass('glyphicon-plus')) {} else {
        $('#togbtn').attr('class', 'glyphicon glyphicon-plus InfoTgl');
    };
    $('#infobox_').css('bottom', 0).removeClass('active');
};

$(".InfoTgl").click(function () {
	if ($('#infobox_').hasClass('active')) {
        togglemin();
    } else {
        toggleinfo();
    };
});
$('#mobileInfo_modal').on('hide.bs.modal',function(){
            resetHighlight();
        }); 

//////////////////////////////////////////////////
////    		UI Functions  			//////////
//////////////////////////////////////////////////

///On load loading bar functionality
$( document ).ajaxStop(function() {
    setTimeout(function() {
              $("#loading").hide();
              
            }, 300);

});


/////////////////////////////////////////////////
//////////// New Leaflet Control ////////////////
/////////// Add Center to Region //////////////
///////////////////////////////////////////////
L.Control.mapCenter = L.Control.Zoom.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
    zoomMinText: "<i class='glyphicon glyphicon-globe'></i>",
    zoomMinTitle: "View Full Region",
    vcLatLng: [oLat, oLng],
    vcZoom: 10
  },

  onAdd: function (map) {
    var zoomName = "leaflet-control-zoom"
      , container = L.DomUtil.create("div", zoomName + " leaflet-bar")
      , options = this.options

    this._map = map

    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
     zoomName + '-in', container, this._zoomIn, this)

    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
     zoomName + '-out', container, this._zoomOut, this)

    this._zoomMinButton = this._createButton(options.zoomMinText, options.zoomMinTitle,
     zoomName + '-min', container, this._zoomMin, this)

    this._updateDisabled()
    map.on('zoomend zoomlevelschange', this._updateDisabled, this)

    return container
  },

  
  
  _zoomMin: function () {
    var opts = this.options
    var zoom = opts.vcZoom || 6;
    this._map.setView(opts.vcLatLng, zoom)
  },

  _updateDisabled: function () {
    var map = this._map
      , className = "leaflet-disabled"

    L.DomUtil.removeClass(this._zoomInButton, className)
    L.DomUtil.removeClass(this._zoomOutButton, className)
    L.DomUtil.removeClass(this._zoomMinButton, className)

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className)
    }

    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className)
    }

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomMinButton, className)
    }
  }
})
//Add controls
map.addControl(new L.Control.mapCenter());


/////////////////////////////////////////// 
//Action on feature selections////////////    
//Initialize highlight function, clear map and define click source
function initializeHL(e){
    resetHighlight(); 
    layersearch = e.feature;            //define layer value for search event
    if (layersearch===undefined){       //if click event set highlight style and define prop value
        highlightMapFeature(e.target);
        props = e.target.feature.properties;
    }else{                              //if search event set highlight style define prop value
        highlightMapFeature(e);
        props = layersearch.properties;
    }
    return props;
}

//Push content to DOM on highlight function
function contentPush(header, content, layerName, titleName, headerClass){
    //push content to DOM elements using JS
    if (titleName === undefined){var preClass = 'DynaTitle'+ layerName +'', FNtitle = '<p>'+ window[preClass] +'</p>';}else{var FNtitle = ''+ featureName +''; }
    
    if (headerClass === undefined){var preHC = 'DynaClass' + layerName +'', dynClass = ''+ window[preHC]+'';}else{ var dynClass = '' + headerClass +'';} 
    
    var dynIco = 'DynaIcon' + layerName+'';
    if (document.body.clientWidth <= 375) {
        document.getElementById('mobileheader').innerHTML = header;                         //push content to info box header
        document.getElementById('mobileinfo').innerHTML = content;                          //push content to info box
        document.getElementById('mobilefeatureName').innerHTML = FNtitle;    //push Feature Type (optional, see below for manual version)
        document.getElementById('mobileMdHeader').className = ''+ dynClass +' modal-header';;                 //push class to create style for info header
        //document.getElementById('mobileiconography').className = ''+ icons +'';       //push icon class information (optional)
        $('#mobileInfo_modal').modal('show');
    } else {    
        document.getElementById('infoheader').innerHTML = header;                   //push content to info box header
        document.getElementById('info').innerHTML = content;                        //push content to info box
        document.getElementById('featureName').innerHTML = FNtitle;             //push Feature Type (optional, see below for manual version)
        document.getElementById('featureName').className = dynClass;          //push class to create style for feature name
        document.getElementById('infoheader').className = dynClass;           //push class to create style for info header
        document.getElementById('iconography').className = window[dynIco];       //push icon class information (optional)
    }
    toggleinfo();
    //activateTooltip();    //function for use with tooltips          
};   
//zoom to polygon feature
function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
}
function zoomToPoint(e){
    var layer= e.target;
    var latLng = layer.getLatLng();
        map.setView(latLng, 15);
}   
//determine feature type and highlight              
function highlightMapFeature(lyr){
    var id = lyr.feature.geometry.type;
    if (id != 'Point'){
        lyr.setStyle({weight: hlweight, color: ""+ hlColor +""});
    } else {
        iconElem = L.DomUtil.get(lyr._icon);
        iconElem.id = 'preselect'
        
        if ($(iconElem).is('img')){
            hlmarkerSize = rdIconSize + 8;
            iconElem.style.border="4px " + hlColor + " solid";
            iconElem.style.height= hlmarkerSize + "px";
            iconElem.style.width= hlmarkerSize + "px";
            iconElem.style.marginTop="-" + hlmarkerSize/2 + "px";
            iconElem.style.marginLeft="-" + hlmarkerSize/2 + "px";
            iconElem.id="selectedIcon";
        } else if($('#preselect').hasClass('circle-cm')) {
            $(iconElem).append('<div class="markerBox cm" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }else if($('#preselect').hasClass('circle-sm')) {
            $(iconElem).append('<div class="markerBox sm" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }else if($('#preselect').hasClass('circle-md')) {
            $(iconElem).append('<div class="markerBox md" style="border-color:'+hlColor+'"></div>');
            iconElem.id='selectedIcon';
        }
    }
}          
//reset all layer styles before highlight (for function not optimum--Revision in works)      
function resetHighlight(){
    //reset poly features individually
    for (var i = 0, l = polyLayer.length; i < l; i++) {
        var nm = polyLayer[i],
        resStyle = window[nm].options.style;
        window[nm].setStyle(resStyle);
    }
    resetIconhighlights();
};

//remove highlight from dyna icon markers and png markers
function resetIconhighlights(){
    var highlticon = document.getElementById('selectedIcon');
    if (highlticon!=undefined){
        highlticon.id = 'prehide';
        $('.markerBox').remove();
        if( $(iconElem).is('img')){
            highlticon.style.border="";
            highlticon.style.height= rdIconSize + "px";
            highlticon.style.width= rdIconSize + "px";
            highlticon.style.marginTop="-" + rdIconSize/2 + "px";
            highlticon.style.marginLeft="-" + rdIconSize/2 + "px";
            highlticon.id="";
        } else {
            highlticon.id="";
        }
    }else{
        //do nothing
    }
};
// Clear the tooltip and clear highlights when map is clicked   
map.on('click',function(e){
        resetHighlight();
        $('#togbtn').addClass('hide');
        $('#infobox_').removeClass('active').css('bottom',0);
        document.getElementById('featureName').innerHTML = '';
        document.getElementById('infoheader').innerHTML = '<p>Click feature to view details</p>';
        document.getElementById('infoheader').className = '';
        document.getElementById('featureName').className = '';
        document.getElementById('iconography').className = '';
        document.getElementById('info').innerHTML = '';
});

// Tooltip Provisions for the Sidebar Legend elements
$('.tab-content').find('.panel-group.legend .panel-heading').first().find('a > div').attr('data-placement', 'bottom');
$('.panel-group.legend').find('.panellink').attr('data-toggle', 'tooltip').attr('title', 'View/hide layers in group');
$('.panel-group.legend').find('.panelinfo').attr('data-toggle', 'tooltip').attr('title', 'Layer Info');
$('.panel-group.legend').find('.checked_all').attr('data-toggle', 'tooltip').attr('title', 'Toggle All Layers').attr('data-placement', 'left');


    

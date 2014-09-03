//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////  Declare Shared Values //////////////////////

var hlweight = 6, 			//weight of highlighted feature outline
	hlColor = "#EFA06A";	//color of point, outline and line highlights


// required variables DO NOT REMOVE
var polyLayer= [],layersearch, props, header, content, titleName, headerClass;

////////////////////////////////////////////////////
///Individual Feature actions /////////////////////	

//Group 1 Layer Selections ////////////
//  layer1
function highlightLayer1(e) {
    initializeHL(e);
    header = '<p>' + props.Name + '</p>',
    content = "<div id='baseInfo'>\
    <div class='datafield'>" + props.Center_Typ + "</div><div class='labelfield'>Type</div>\
    <div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies): </div>\
    </div><!--close baseInfo-->\
    <div class='infoDivider'></div>\
    <div id='indactorInfo'>\
    <ul class='nav nav-tabs'><!--tabs for indicators-->\
    <li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>\
    <div id='indicator' class='tab-content'><!--tab panes-->\
    <div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>\
        <table class='table table-hover'>\
        <tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.Acres).format('0,0.0') + "</td></tr>\
        <tr><td><strong>Output: </strong></td><td>not available</td></tr></table>\
    </div></div>\
    <div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
    layerName = 'layer1';
    contentPush(header, content, layerName, titleName, headerClass);
};
//  layer2
function highlightLayer2(e) {
    initializeHL(e);
    header = '<p>' + props.Name + '</p>',
    content = "<div id='baseInfo'>\
    <div class='datafield'>" + props.Owner+ "</div><div class='labelfield'>Owner</div>\
    <div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>\
    <div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies)</div>\
    </div><!--close baseInfo-->\
    <div class='infoDivider'></div>\
    <div id='indactorInfo'>\
    <ul class='nav nav-tabs'><!--tabs for indicators-->\
    <li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul>\
    <div id='indicator' class='tab-content'><!--tab panes-->\
    <div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>\
        <table class='table table-hover'>\
            <tr class='active'><td><strong>Truck Spaces Available: </strong></td><td>" + props.Capacity + "</td></tr>\
            <tr><td><strong> <a title='Truck space utilization determined by single overnight count' data-toggle='infotooltip'>Truck Spaces Utilized</a>: </strong></td><td> " + props.Activity_1 + " </td></tr>\
        </table>\
    </div></div>\
    <div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
    layerName = 'layer2';
    contentPush(header, content, layerName, titleName, headerClass);     
};

//Group 2 Layer Selections
//  layer3
function highlightLayer3(e) {
    initializeHL(e);
    header = '<p>' + props.Name + '</p>';
    content = "<div id='baseInfo'>\
    <div class='datafield'>" + props.Fac_Served + "</div><div class='labelfield'>Facility Served</div>\
    <div class='datafield'>" + props.Township_s + "</div><div class='labelfield'>Municipality(ies)</div>\
    </div><!--close baseInfo-->\
    <div class='infoDivider'></div>\
    <div id='indactorInfo'>\
    <ul class='nav nav-tabs'><!--tabs for indicators-->\
    <li class='active'><a href='#Cap' data-toggle='tab'>Capacity</a></li><li><a href='#Act' data-toggle='tab'>Activity</a></li></ul></ul>\
    <div id='indicator' class='tab-content'><!--tab panes-->\
    <div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>\
        <table class='table table-hover'>\
        <tr class='active'><td><strong>Lanes per direction: </strong></td><td>" + props.Cap_1 + "</td></tr>\
        <tr><td><strong>AADT: </strong></td><td>not available</td></tr>\
        </table>\
    </div>\
    <div class='tab-pane' id='Act' style='padding-bottom: 12px;'>\
        <table class='table table-hover'>\
        <tr class='active'><td><strong>Activity Data: </strong></td><td>data entry</td></tr>\
        <tr><td><strong>Some data: </strong></td><td>not available</td></tr>\
        </table>\
    </div></div>\
    <div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
    layerName = 'layer3';
    contentPush(header, content, layerName, titleName, headerClass);       
};
//  layer4
function highlightLayer4(e) {
    initializeHL(e);
    header = '<p>' + props.Name + '</p>',
    content = "<div id='baseInfo'>\
    <div class='datafield'>" + props.Owner + "</div><div class='labelfield'>Owner</div>\
    <div class='datafield'>" + props.Operator_s + "</div><div class='labelfield'>Operator(s)</div>\
    <div class='datafield'>" + props.Township + "</div><div class='labelfield'>Municipality(ies)</div>\
    </div><!--close baseInfo-->\
    <div class='infoDivider'></div>\
    <div id='indactorInfo'>\
    <ul class='nav nav-tabs'><!--tabs for indicators-->\
    <li class='active'><a href='#Cap' data-toggle='tab'>Capacity & Activity</a></li></ul></ul>\
    <div id='indicator' class='tab-content'><!--tab panes-->\
    <div class='tab-pane active' id='Cap' style='padding-bottom: 12px;'>\
            <table class='table table-hover'>\
            <tr class='active'><td><strong>Acres: </strong></td><td>" + numeral(props.GIS_Acres).format('0,0.0') + "</td></tr>\
            <tr><td><strong>Activity: </strong></td><td>n/a</td></tr></table>\
    </div></div>\
    <div class='labelfield source'>Data Source: " + props.Source + "</div></div>",
    layerName = 'layer4';
    console.log(e);
    contentPush(header, content, layerName, titleName, headerClass);
};  
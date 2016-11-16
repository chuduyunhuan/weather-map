/**
 * 上海市政信息地图可视化
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-09-22 15:25:49
 * @version $Id$
 */
//命名空间
var BASE_MAP = {
	map: {},
	layers: {},
	commonMethods: {},
	imgCol: {
		'公园': 'images/park.png',
		'幼儿园': 'images/child.png',
		'派出所': 'images/police.png',
		'高校': 'images/university.png',
		'驾校': 'images/drive.png',
		'宾馆': 'images/hotel.png',
		'医院': 'images/hospital.png',
		'电影院': 'images/cinema.png',
		'市政设施': 'images/marker-icon.png',
		'loading': 'images/loading.gif'
	},
	init: function(id,opts){
		BASE_MAP.addBaseMap(id,opts);
		BASE_MAP.initDoms();
	}
};
BASE_MAP.setMapOptions = function(opts){
	var obj = {
		minZoom: 10,
		maxZoom: 18,
		zoom: 11,
		center: [31.147534,121.518992],
		crs: L.CRS.BEPSG3857,
		attributionControl: false
	};
	return BASE_MAP.commonMethods.setOptions(obj,opts);
};
BASE_MAP.addBaseMap = function(id,opts){
	opts = BASE_MAP.setMapOptions(opts);
	BASE_MAP.map = L.map(id,opts);
	BASE_MAP.addBaseLayers();
	BASE_MAP.addLayerControl();
};
BASE_MAP.addBaseLayers = function(){
	var normalLayer = L.tileLayer.baiduLayer('Normal.Map');
	var satelliteLayer = L.tileLayer.baiduLayer('Satellite.Map');
	BASE_MAP.layers.normalLayer = normalLayer;
	BASE_MAP.layers.satelliteLayer = satelliteLayer;
	BASE_MAP.map.addLayer(normalLayer);
};
BASE_MAP.addLayerControl = function(){
	BASE_MAP.layers.layersControl && (BASE_MAP.layers.layersControl = null, BASE_MAP.map.removeControl(BASE_MAP.layers.layersControl));
	var baseLayers = {
		"地图": BASE_MAP.layers.normalLayer,
		"卫星": BASE_MAP.layers.satelliteLayer
	};
	var layersControl = L.control.layers(baseLayers,[]);
	BASE_MAP.layers.layersControl = layersControl;
	layersControl.addTo(BASE_MAP.map);
};
BASE_MAP.initDoms = function(){
	BASE_MAP.getAllTypes();
	//文本框回车事件
	BASE_MAP.commonMethods.customEvent('search','keydown',BASE_MAP.commonMethods.enterPress);
	//文本框失去焦点事件
	BASE_MAP.commonMethods.customEvent('search','blur',BASE_MAP.commonMethods.textBlur)
};
BASE_MAP.getAllTypes = function(){
	var url = 'http://localhost:3000/civicism/types';
	var callback = function(data){
		if(!data.length) return;
		var htmlStr = '';
		data.map(function(valObj){
			htmlStr += '<option>' + valObj.TYPE + '</option>';
		});
		$('#type').html(htmlStr);
		$('#type').on('change',function(){
			var type = $('option:selected').text();
			BASE_MAP.getServerData(type);
		});
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.getServerData = function(type){
	var url = 'http://localhost:3000/civicism/address?type=' + encodeURIComponent(type);
	var callback = function(data){
		BASE_MAP.commonMethods.mapData(data,type);
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.commonMethods.setOptions = function(obj,opts){
	for(var name in opts){
		opts.hasOwnProperty(name) && (obj[name] = opts[name]);
	}
	return obj;
};
BASE_MAP.commonMethods.ajaxQuery = function(obj){
	var url = obj.url,
		type = obj.type || 'get',
		data = obj.data,
		callback = obj.callback;
	$.ajax({
		url: url,
		type: type,
		contentType: 'application/json',
		data: data
	})
		.done(callback);
};
BASE_MAP.commonMethods.mapData = function(data,type){
	if(!data.length || data.length < 1) return;
	BASE_MAP.commonMethods.showLoading();
	BASE_MAP.layers.clearLayer('civicismLayer');
	var civicismLayer = L.featureGroup();
	type = type || '市政设施';
	data.map(function(obj,index){
		var addr = obj.address;
		var name = obj.name;
		var bd_url = 'http://localhost:3000/proxy-server/baidu/geolocation?city=' + encodeURIComponent('上海市') + '&address=' + encodeURIComponent(addr);
		var bd_callback = function(bd_data){
			if(!bd_data.result || !bd_data.result.location) return;
			var icon = BASE_MAP.layers.setIcon(BASE_MAP.imgCol[obj.type],35,35);
			var content = BASE_MAP.commonMethods.createHtml(name,addr);
			var point = bd_data.result.location;
			var parse_obj = {
				layer: civicismLayer,
				point: point,
				icon: icon,
				name: name,
				content: content
			};
			BASE_MAP.layers.setMarker(parse_obj);
			if(index === data.length - 1) {
				BASE_MAP.layers.civicismLayer = civicismLayer;
				BASE_MAP.map.addLayer(civicismLayer);
				BASE_MAP.layers.addToLayerControl(civicismLayer,type);
				BASE_MAP.commonMethods.hideLoading();
			}
		};
		var bd_obj = {
			url: bd_url,
			callback: bd_callback
		};
		BASE_MAP.commonMethods.ajaxQuery(bd_obj);
	});
};
BASE_MAP.commonMethods.searchByName = function(name){
	var url = 'http://localhost:3000/civicism/address/search?name=' + encodeURIComponent(name);
	var callback = function(data){
		BASE_MAP.commonMethods.mapData(data);
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.commonMethods.customEvent = function(id,evtType,fn){
	$('#'+id)[evtType](fn);
};
BASE_MAP.commonMethods.enterPress = function(e){
	var curKey = e.which;
	if(curKey !== 13) return;
	var name = $(this).val();
	if (!name) return;
	BASE_MAP.commonMethods.searchByName(name);
};
BASE_MAP.commonMethods.textBlur = function(e){
	$(e.target).val('请输入目标名称');
};
BASE_MAP.commonMethods.removeDomById = function(id){
	var checkCustomDiv = document.getElementById(id);
	checkCustomDiv != null && (checkCustomDiv.parentNode.removeChild(checkCustomDiv));
};
BASE_MAP.commonMethods.checkDomById = function(id){
	var checkCustomDiv = document.getElementById(id);
	if(!checkCustomDiv){
		return false;
	}else{
		return true;
	}
};
BASE_MAP.commonMethods.createHtml = function(name,val){
	var htmlStr = '';
	htmlStr += '<span>' 
		+ name + ': &nbsp;&nbsp;' 
		+ '<b>' + val + '</b>'
		+ '<span>';
	return htmlStr;
};
BASE_MAP.commonMethods.showLoading = function(){
	var loadingExist = BASE_MAP.commonMethods.checkDomById('customLoading');
	if(loadingExist){
		$('#customLoading').show();
		return;
	}
	var $div = $('<div id="customLoading"></div>');
	var winHeight = $(document).height(),
		winWidth = $(document).width();
	$div.css({
		position: 'absolute', left: winWidth/2, top: winHeight/2, 'z-index': 999
	});
	$div.html('<img src="' + BASE_MAP.imgCol['loading'] + '" />');
	$div.appendTo('body');
};
BASE_MAP.commonMethods.hideLoading = function(){
	$('#customLoading').hide();
};
BASE_MAP.layers.setIcon = function(iconUrl,width,height){
	width = width || 35;
	height = height || 35;
	var icon = L.icon({
		iconUrl: iconUrl,
		iconSize: [width,height]
	});
	return icon;
};
BASE_MAP.layers.setPopup = function(layer,content,opts){
	var obj = {maxWidth: 1000, maxHeight: 800};
	opts = BASE_MAP.commonMethods.setOptions(obj,opts);
	var popup = new L.popup(opts)
		.setContent(content);
	layer.bindPopup(popup);
};
BASE_MAP.layers.setMarker = function(obj){
	var layer = obj.layer || BASE_MAP.layers.civicismLayer,
		point = obj.point,
		name = obj.name || 'A Marker',
		markerIcon = obj.icon,
		content = obj.content || 'A Marker';
	var marker = L.marker(point, {
		title: name, icon: markerIcon, keepInView: true
	});
	BASE_MAP.layers.setPopup(marker,content);
	marker.addTo(layer);
};
BASE_MAP.layers.heatMapRenderer = function(arr){
	var cfg = {
		// radius should be small ONLY if scaleRadius is true (or small radius is intended)
		"radius": 0.1,
		"maxOpacity": 1,
		// scales the radius based on map zoom
		"scaleRadius": true,
		// if set to false the heatmap uses the global maximum for colorization
		// if activated: uses the data maximum within the current map boundaries
		//   (there will always be a red spot with useLocalExtremas true)
		"useLocalExtrema": true,
		// which field name in your data represents the latitude - default "lat"
		latField: 'lat',
		// which field name in your data represents the longitude - default "lng"
		lngField: 'lng',
		// which field name in your data represents the data value - default "value"
		valueField: 'value'
	};
	var testData = {data: arr};
	var heatMapLayer = new HeatmapOverlay(cfg);
	BASE_MAP.map.addLayer(heatMapLayer);
	heatMapLayer.setData(testData);
	BASE_MAP.layers.heatMapLayer = heatMapLayer;
	//添加到图层控制器
	BASE_MAP.layers.addToLayerControl(heatMapLayer,'热力渲染');
};
BASE_MAP.layers.addToLayerControl = function(layer,name){
	BASE_MAP.layers.layersControl.addOverlay(layer,name);
};
BASE_MAP.layers.clearLayer = function(layerName){
	BASE_MAP.layers[layerName] && (BASE_MAP.map.removeLayer(BASE_MAP.layers[layerName]),BASE_MAP.layers.layersControl.removeLayer(BASE_MAP.layers[layerName]));
};
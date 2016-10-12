/**
 * GeoJSON test with Leaflet + BaiduMap
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-09-22 15:25:49
 * @version $Id$
 */
//解决跨域请求数据问题
jQuery.support.cors = true;
//jQuery.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/x-www-form-urlencoded; charset=utf-8"});

var BASE_MAP = BASE_MAP || {};
//地图
BASE_MAP.map = null;
//图层
BASE_MAP.layers = {};
//百度城市geojson编码
BASE_MAP.cityMaps = {
	"北京市": "110100",
	"天津市": "120100",
	"上海市": "310100",
	"重庆市": "500100",

	"崇明县": "310200",
	"湖北省直辖县市": "429000",
	"铜仁市": "522200",
	"毕节市": "522400",

	"石家庄市": "130100",
	"唐山市": "130200",
	"秦皇岛市": "130300",
	"邯郸市": "130400",
	"邢台市": "130500",
	"保定市": "130600",
	"张家口市": "130700",
	"承德市": "130800",
	"沧州市": "130900",
	"廊坊市": "131000",
	"衡水市": "131100",
	"太原市": "140100",
	"大同市": "140200",
	"阳泉市": "140300",
	"长治市": "140400",
	"晋城市": "140500",
	"朔州市": "140600",
	"晋中市": "140700",
	"运城市": "140800",
	"忻州市": "140900",
	"临汾市": "141000",
	"吕梁市": "141100",
	"呼和浩特市": "150100",
	"包头市": "150200",
	"乌海市": "150300",
	"赤峰市": "150400",
	"通辽市": "150500",
	"鄂尔多斯市": "150600",
	"呼伦贝尔市": "150700",
	"巴彦淖尔市": "150800",
	"乌兰察布市": "150900",
	"兴安盟": "152200",
	"锡林郭勒盟": "152500",
	"阿拉善盟": "152900",
	"沈阳市": "210100",
	"大连市": "210200",
	"鞍山市": "210300",
	"抚顺市": "210400",
	"本溪市": "210500",
	"丹东市": "210600",
	"锦州市": "210700",
	"营口市": "210800",
	"阜新市": "210900",
	"辽阳市": "211000",
	"盘锦市": "211100",
	"铁岭市": "211200",
	"朝阳市": "211300",
	"葫芦岛市": "211400",
	"长春市": "220100",
	"吉林市": "220200",
	"四平市": "220300",
	"辽源市": "220400",
	"通化市": "220500",
	"白山市": "220600",
	"松原市": "220700",
	"白城市": "220800",
	"延边朝鲜族自治州": "222400",
	"哈尔滨市": "230100",
	"齐齐哈尔市": "230200",
	"鸡西市": "230300",
	"鹤岗市": "230400",
	"双鸭山市": "230500",
	"大庆市": "230600",
	"伊春市": "230700",
	"佳木斯市": "230800",
	"七台河市": "230900",
	"牡丹江市": "231000",
	"黑河市": "231100",
	"绥化市": "231200",
	"大兴安岭地区": "232700",
	"南京市": "320100",
	"无锡市": "320200",
	"徐州市": "320300",
	"常州市": "320400",
	"苏州市": "320500",
	"南通市": "320600",
	"连云港市": "320700",
	"淮安市": "320800",
	"盐城市": "320900",
	"扬州市": "321000",
	"镇江市": "321100",
	"泰州市": "321200",
	"宿迁市": "321300",
	"杭州市": "330100",
	"宁波市": "330200",
	"温州市": "330300",
	"嘉兴市": "330400",
	"湖州市": "330500",
	"绍兴市": "330600",
	"金华市": "330700",
	"衢州市": "330800",
	"舟山市": "330900",
	"台州市": "331000",
	"丽水市": "331100",
	"合肥市": "340100",
	"芜湖市": "340200",
	"蚌埠市": "340300",
	"淮南市": "340400",
	"马鞍山市": "340500",
	"淮北市": "340600",
	"铜陵市": "340700",
	"安庆市": "340800",
	"黄山市": "341000",
	"滁州市": "341100",
	"阜阳市": "341200",
	"宿州市": "341300",
	"六安市": "341500",
	"亳州市": "341600",
	"池州市": "341700",
	"宣城市": "341800",
	"福州市": "350100",
	"厦门市": "350200",
	"莆田市": "350300",
	"三明市": "350400",
	"泉州市": "350500",
	"漳州市": "350600",
	"南平市": "350700",
	"龙岩市": "350800",
	"宁德市": "350900",
	"南昌市": "360100",
	"景德镇市": "360200",
	"萍乡市": "360300",
	"九江市": "360400",
	"新余市": "360500",
	"鹰潭市": "360600",
	"赣州市": "360700",
	"吉安市": "360800",
	"宜春市": "360900",
	"抚州市": "361000",
	"上饶市": "361100",
	"济南市": "370100",
	"青岛市": "370200",
	"淄博市": "370300",
	"枣庄市": "370400",
	"东营市": "370500",
	"烟台市": "370600",
	"潍坊市": "370700",
	"济宁市": "370800",
	"泰安市": "370900",
	"威海市": "371000",
	"日照市": "371100",
	"莱芜市": "371200",
	"临沂市": "371300",
	"德州市": "371400",
	"聊城市": "371500",
	"滨州市": "371600",
	"菏泽市": "371700",
	"郑州市": "410100",
	"开封市": "410200",
	"洛阳市": "410300",
	"平顶山市": "410400",
	"安阳市": "410500",
	"鹤壁市": "410600",
	"新乡市": "410700",
	"焦作市": "410800",
	"濮阳市": "410900",
	"许昌市": "411000",
	"漯河市": "411100",
	"三门峡市": "411200",
	"南阳市": "411300",
	"商丘市": "411400",
	"信阳市": "411500",
	"周口市": "411600",
	"驻马店市": "411700",
	"省直辖县级行政区划": "469000",
	"武汉市": "420100",
	"黄石市": "420200",
	"十堰市": "420300",
	"宜昌市": "420500",
	"襄阳市": "420600",
	"鄂州市": "420700",
	"荆门市": "420800",
	"孝感市": "420900",
	"荆州市": "421000",
	"黄冈市": "421100",
	"咸宁市": "421200",
	"随州市": "421300",
	"恩施土家族苗族自治州": "422800",
	"长沙市": "430100",
	"株洲市": "430200",
	"湘潭市": "430300",
	"衡阳市": "430400",
	"邵阳市": "430500",
	"岳阳市": "430600",
	"常德市": "430700",
	"张家界市": "430800",
	"益阳市": "430900",
	"郴州市": "431000",
	"永州市": "431100",
	"怀化市": "431200",
	"娄底市": "431300",
	"湘西土家族苗族自治州": "433100",
	"广州市": "440100",
	"韶关市": "440200",
	"深圳市": "440300",
	"珠海市": "440400",
	"汕头市": "440500",
	"佛山市": "440600",
	"江门市": "440700",
	"湛江市": "440800",
	"茂名市": "440900",
	"肇庆市": "441200",
	"惠州市": "441300",
	"梅州市": "441400",
	"汕尾市": "441500",
	"河源市": "441600",
	"阳江市": "441700",
	"清远市": "441800",
	"东莞市": "441900",
	"中山市": "442000",
	"潮州市": "445100",
	"揭阳市": "445200",
	"云浮市": "445300",
	"南宁市": "450100",
	"柳州市": "450200",
	"桂林市": "450300",
	"梧州市": "450400",
	"北海市": "450500",
	"防城港市": "450600",
	"钦州市": "450700",
	"贵港市": "450800",
	"玉林市": "450900",
	"百色市": "451000",
	"贺州市": "451100",
	"河池市": "451200",
	"来宾市": "451300",
	"崇左市": "451400",
	"海口市": "460100",
	"三亚市": "460200",
	"三沙市": "460300",
	"成都市": "510100",
	"自贡市": "510300",
	"攀枝花市": "510400",
	"泸州市": "510500",
	"德阳市": "510600",
	"绵阳市": "510700",
	"广元市": "510800",
	"遂宁市": "510900",
	"内江市": "511000",
	"乐山市": "511100",
	"南充市": "511300",
	"眉山市": "511400",
	"宜宾市": "511500",
	"广安市": "511600",
	"达州市": "511700",
	"雅安市": "511800",
	"巴中市": "511900",
	"资阳市": "512000",
	"阿坝藏族羌族自治州": "513200",
	"甘孜藏族自治州": "513300",
	"凉山彝族自治州": "513400",
	"贵阳市": "520100",
	"六盘水市": "520200",
	"遵义市": "520300",
	"安顺市": "520400",
	"黔西南布依族苗族自治州": "522300",
	"黔东南苗族侗族自治州": "522600",
	"黔南布依族苗族自治州": "522700",
	"昆明市": "530100",
	"曲靖市": "530300",
	"玉溪市": "530400",
	"保山市": "530500",
	"昭通市": "530600",
	"丽江市": "530700",
	"普洱市": "530800",
	"临沧市": "530900",
	"楚雄彝族自治州": "532300",
	"红河哈尼族彝族自治州": "532500",
	"文山壮族苗族自治州": "532600",
	"西双版纳傣族自治州": "532800",
	"大理白族自治州": "532900",
	"德宏傣族景颇族自治州": "533100",
	"怒江傈僳族自治州": "533300",
	"迪庆藏族自治州": "533400",
	"拉萨市": "540100",
	"昌都地区": "542100",
	"山南地区": "542200",
	"日喀则地区": "542300",
	"那曲地区": "542400",
	"阿里地区": "542500",
	"林芝地区": "542600",
	"西安市": "610100",
	"铜川市": "610200",
	"宝鸡市": "610300",
	"咸阳市": "610400",
	"渭南市": "610500",
	"延安市": "610600",
	"汉中市": "610700",
	"榆林市": "610800",
	"安康市": "610900",
	"商洛市": "611000",
	"兰州市": "620100",
	"嘉峪关市": "620200",
	"金昌市": "620300",
	"白银市": "620400",
	"天水市": "620500",
	"武威市": "620600",
	"张掖市": "620700",
	"平凉市": "620800",
	"酒泉市": "620900",
	"庆阳市": "621000",
	"定西市": "621100",
	"陇南市": "621200",
	"临夏回族自治州": "622900",
	"甘南藏族自治州": "623000",
	"西宁市": "630100",
	"海东地区": "632100",
	"海北藏族自治州": "632200",
	"黄南藏族自治州": "632300",
	"海南藏族自治州": "632500",
	"果洛藏族自治州": "632600",
	"玉树藏族自治州": "632700",
	"海西蒙古族藏族自治州": "632800",
	"银川市": "640100",
	"石嘴山市": "640200",
	"吴忠市": "640300",
	"固原市": "640400",
	"中卫市": "640500",
	"乌鲁木齐市": "650100",
	"克拉玛依市": "650200",
	"吐鲁番地区": "652100",
	"哈密地区": "652200",
	"昌吉回族自治州": "652300",
	"博尔塔拉蒙古自治州": "652700",
	"巴音郭楞蒙古自治州": "652800",
	"阿克苏地区": "652900",
	"克孜勒苏柯尔克孜自治州": "653000",
	"喀什地区": "653100",
	"和田地区": "653200",
	"伊犁哈萨克自治州": "654000",
	"塔城地区": "654200",
	"阿勒泰地区": "654300",
	"自治区直辖县级行政区划": "659000",
	"台湾省": "710000",
	"香港特别行政区": "810100",
	"澳门特别行政区": "820000"
};
//数据模块
BASE_MAP.dataCol = {};
//其他全局变量
BASE_MAP.globalCol = {};
//公共方法
BASE_MAP.commonMethods = {};
BASE_MAP.commonMethods.setOptions = function(obj,opts){
	for(var name in opts){
		opts.hasOwnProperty(name) && (obj[name] = opts[name]);
	}
	return obj;
};
BASE_MAP.commonMethods.randomColor = function(){
	var randomNum = parseInt(Math.random() * (999-100) + 100);
	return '#' + randomNum;
};
BASE_MAP.commonMethods.randomFillOpacity = function(){
	var randomNum = Math.random() * (1 - 0) + 0;
	return randomNum.toFixed(2);
};
BASE_MAP.commonMethods.createArrFromObj = function(obj){
	var arr = [];
	for(var name in obj){
		arr.push(name);
	}
	return arr;
};
//dom事件
BASE_MAP.events = {};
BASE_MAP.events.enterPress = function(e){
	var curKey = e.which;
	if(curKey !== 13) return;
	var city = $(this).val();
	if (!city) return;
	for(var name in BASE_MAP.cityMaps){
		if(name.indexOf(city) !== -1){
			var fileName = BASE_MAP.cityMaps[name];
			var url = 'http://echarts.baidu.com/echarts2/doc/example/geoJson/china-main-city/' + fileName + '.json';
			BASE_MAP.addGeoJSON(url);
			return;
		}
	}
};
BASE_MAP.events.customEvent = function(id,evtType,fn){
	$('#'+id).focus();
	$('#'+id)[evtType](fn);
};
BASE_MAP.init = function(id,opts){
	BASE_MAP.addBaseMap(id,opts);
	// BASE_MAP.addOnlineGeoJSON();
	// var url = 'http://localhost:8080/GeoJSON/shanghai.json';
	// BASE_MAP.addGeoJSON(url);
	BASE_MAP.initEvent();
};

BASE_MAP.initEvent = function(){
	var cityMaps = BASE_MAP.commonMethods.createArrFromObj(BASE_MAP.cityMaps);
	var autoComplete = new AutoComplete('cityName','smartAuto',cityMaps);
	// BASE_MAP.globalCol['autoComplete'] = autoComplete;
	var callback = function(){
		autoComplete.start(event);
	};
	//字符串自动提示
	BASE_MAP.events.customEvent('cityName','keyup',callback);
	//回车查询
	BASE_MAP.events.customEvent('cityName','keydown',BASE_MAP.events.enterPress);
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
	BASE_MAP.map = new L.map(id,opts);
	var normalLayer = new L.tileLayer.baiduLayer('Normal.Map');
	var satelliteLayer = new L.tileLayer.baiduLayer('Satellite.Map');
	BASE_MAP.layers.normalLayer = normalLayer;
	BASE_MAP.layers.satelliteLayer = satelliteLayer;
	BASE_MAP.map.addLayer(normalLayer);
	//添加图层控制器
	var baseLayers = {
		"地图": normalLayer,
		"卫星": satelliteLayer
	};
	var layersControl = new L.control.layers(baseLayers,[]);
	layersControl.addTo(BASE_MAP.map);
	BASE_MAP.layers.layersControl = layersControl;
}
BASE_MAP.addGeoJSON = function(url,style){
	$.ajax({
		url: url,
		type: 'get'
	})
		.done(function(data){
			//每次查询成功后清除上次结果
			BASE_MAP.layers.clearLayers();
			//城市下辖地市名称及经纬度信息
			var nameArr = [];
			//GeoJSON方式定义图层
			var jsonLayer = new L.geoJson(data,{
				style: function(feature){	
					style = BASE_MAP.layers.setStyleOptions(style);
					return style;
				},
				onEachFeature: function(feature, layer){
					//绑定popup
					var content = '<iframe width="900px" height="580px" frameborder=no src="pages/city-weather.html?name=' + encodeURIComponent(feature.properties.name) + '"></iframe>';
					BASE_MAP.layers.setPopup(layer,content);
					//构造热力渲染数据
					var pointArr = feature.geometry.coordinates[0][0][0];
					var obj = {
						lng: parseFloat(pointArr[0]),
						lat: parseFloat(pointArr[1]),
						name: feature.properties.name,
						value: Math.random()*(39-10)+10
					};
					nameArr.push(obj);
				}
			});
			//缓存图层,以备后用
			BASE_MAP.layers.jsonLayer = jsonLayer;
			//为图层注册单击事件
			BASE_MAP.layers.clickEvent(jsonLayer);
			//添加图层到地图,并设置中心点
			var center = jsonLayer.getLayers()[0].getBounds().getCenter();
			jsonLayer.addTo(BASE_MAP.map);
			BASE_MAP.map.setView(center,11);
			//添加到图层控制器
			BASE_MAP.layers.addToLayerControl(jsonLayer,'地市矢量图');
			//城市下辖地市温度热力图渲染
			BASE_MAP.layers.heatMapRenderer(nameArr);
			//BASE_MAP.layers.addHeatMap(nameArr);
		});
};
BASE_MAP.addGeoJSON2 = function(url){
	var script = document.createElement("script");
	script.setAttribute("type","text/javascript"); 
	script.src = 'http://localhost:8080/GeoJSON/sh.json';
	$(script).appendTo('body');
	// document.getElementsByTagName('body').item(0).appendChild(script);
	script.onload = function(data){
		console.log(data);
	};
};
BASE_MAP.addOnlineGeoJSON = function(){
	for(var name in BASE_MAP.cityMaps){
		var fileName = BASE_MAP.cityMaps[name];
		var url = 'http://echarts.baidu.com/echarts2/doc/example/geoJson/china-main-city/' + fileName + '.json';
		BASE_MAP.addGeoJSON(url);
	}
};
BASE_MAP.layers.addHeatMap = function(arr){
	BASE_MAP.dataCol.heatMapData = [];
	arr.map(function(objVal){
		BASE_MAP.queryWeatherData(objVal,arr);
	});
	// BASE_MAP.dataCol.heatMapData = [{"lng":119.127345,"lat":33.623843,"name":"清河区","value":22},{"lng":119.295650664063,"lat":33.1425942207031,"name":"金湖县","value":20},{"lng":119.22271609375,"lat":34.0492153144531,"name":"涟水县","value":19},{"lng":118.897345,"lat":33.353843,"name":"洪泽县","value":20},{"lng":118.487345,"lat":33.243843,"name":"盱眙县","value":20}];
	// BASE_MAP.dataCol.heatMapData = [{"lng":121.087345,"lat":31.0538430000001,"name":"青浦区","value":22},{"lng":121.297345,"lat":31.493843,"name":"嘉定区","value":22},{"lng":121.347345,"lat":31.2438430000001,"name":"长宁区","value":19},{"lng":121.027345,"lat":30.9438430000001,"name":"金山区","value":23},{"lng":121.337345,"lat":31.303843,"name":"宝山区","value":23},{"lng":121.397008085938,"lat":31.2888137031251,"name":"普陀区","value":22},{"lng":121.087345,"lat":31.0538430000001,"name":"松江区","value":23},{"lng":121.44982546875,"lat":31.0143874335938,"name":"奉贤区","value":23},{"lng":121.247345,"lat":31.263843,"name":"闵行区","value":22},{"lng":121.787447539063,"lat":31.1987868476563,"name":"浦东新区","value":23}];
	// BASE_MAP.layers.heatMapRenderer(BASE_MAP.dataCol.heatMapData);
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
	BASE_MAP.layers.addToLayerControl(heatMapLayer,'温度热力图');
};
BASE_MAP.queryWeatherData = function(obj,arr){
	var url = 'http://v.juhe.cn/weather/index?callback=?';
	var name = obj.name;
	var cityName = name.replace(/县|区|市|新区|开发区|高新区/g,''),
		key = '7b38cd31ba792380357cffc206d96b01';
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		data: {
			'cityname': cityName,
			'key': key
		}
	})
		.done(function(data){
			var objData = data.result;
			if(!objData){
				console.log('暂无' + name + '天气信息!');
				obj.value = 0;
				BASE_MAP.dataCol.heatMapData.push(obj);
			}else{
				var todayTemArr = objData.today.temperature.split('~');
				var minTem = parseFloat(todayTemArr[0].replace(/[^\d]/g,'')),
					maxTem = parseFloat(todayTemArr[1].replace(/[^\d]/g,''));
				var meanTem = (minTem + maxTem)/2;
				obj.value = maxTem;
				BASE_MAP.dataCol.heatMapData.push(obj);
			}
			if(arr.length === BASE_MAP.dataCol.heatMapData.length) 
				BASE_MAP.layers.heatMapRenderer(BASE_MAP.dataCol.heatMapData);
			console.log(JSON.stringify(BASE_MAP.dataCol.heatMapData));
		});
};
BASE_MAP.layers.clickEvent = function(layer){
	layer.on('click',function(e){
		e.layer.setStyle({
			fillColor: BASE_MAP.commonMethods.randomColor(),
			fillOpacity: BASE_MAP.commonMethods.randomFillOpacity()
		});		
	});
};
BASE_MAP.layers.setStyleOptions = function(opts){
	var obj = {
		color: 'gray',
		weight: 2,
		fillColor: BASE_MAP.commonMethods.randomColor(),
		fillOpacity: BASE_MAP.commonMethods.randomFillOpacity()
	}
	return BASE_MAP.commonMethods.setOptions(obj,opts);
};
BASE_MAP.layers.setPopup = function(layer,content,opts){
	var obj = {maxWidth: 1000, maxHeight: 800};
	opts = BASE_MAP.commonMethods.setOptions(obj,opts);
	var popup = new L.popup(opts)
		.setContent(content);
	layer.bindPopup(popup);
};
BASE_MAP.layers.addToLayerControl = function(layer,name){
	BASE_MAP.layers.layersControl.addOverlay(layer,name);
};
BASE_MAP.layers.clearLayers = function(){
	BASE_MAP.layers.jsonLayer && (BASE_MAP.map.removeLayer(BASE_MAP.layers.jsonLayer),BASE_MAP.layers.layersControl.removeLayer(BASE_MAP.layers.jsonLayer));
	BASE_MAP.layers.heatMapLayer && (BASE_MAP.map.removeLayer(BASE_MAP.layers.heatMapLayer),BASE_MAP.layers.layersControl.removeLayer(BASE_MAP.layers.heatMapLayer));
};
function loadWeather(){fetch("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/"+lon+"/lat/"+lat+"/data.json").then(function(x){return x.json()}).then(processForcast).then(loadForcast)}function processForcast(forcast){var newForcast={};newForcast["approvedTime"]=forcast["approvedTime"];newForcast["referenceTime"]=forcast["referenceTime"];newForcast["geometry"]=forcast["geometry"];var ts=[];newForcast["timeSeries"]=ts;for(var i=0;i<forcast["timeSeries"].length;i++){var timeSerie=forcast["timeSeries"][i];var newTimeSerie={};ts.push(newTimeSerie);newTimeSerie["validTime"]=timeSerie["validTime"];var parameters=timeSerie["parameters"];for(var j=0;j<parameters.length;j++){newTimeSerie[parameters[j]["name"]]=parameters[j]["values"][0]}}return newForcast}function loadForcast(forcast){var currentTs=forcast["timeSeries"][0];console.log(currentTs);$.attr($.id.fcWsymbImg,"src","/res/wsymb/"+wsymb[currentTs["Wsymb2"]-1]);$.txt($.id.fcTemp,currentTs["t"]);$.txt($.id.fcWsymb,wsymbName[currentTs["Wsymb2"]-1]);$.txt($.id.fcWindS,currentTs["ws"]);var windDir=currentTs["wd"];$.txt($.id.fcWindD,getDirectionText(currentTs["wd"]));$.txt($.id.fcPreType,preTypes[currentTs["pcat"]]);$.txt($.id.fcPreMean,currentTs["pmean"]);var timeSeries=forcast["timeSeries"];var currentDay=[];var daysData=[currentDay];var currentDate=new Date(currentTs["validTime"]).getDate();for(var i=0;i<timeSeries.length;i++){var day=new Date(timeSeries[i]["validTime"]).getDate();if(day!=currentDate){currentDay=[];daysData.push(currentDay);currentDate=day}currentDay.push(timeSeries[i])}days=[];for(var i=0;i<daysData.length;i++){var temps=[];var winds=[];var pres=[];var wsymbs={};var dayData=daysData[i];for(var j=0;j<dayData.length;j++){var paras=dayData[j];temps.push(paras["t"]);winds.push(paras["ws"]);pres.push(paras["pmean"]);var symb=paras["Wsymb2"];if(symb in wsymbs){wsymbs[symb]++}else{wsymbs[symb]=1}}function getStats(data){var tot=data.reduce(function(a,b){return a+b});return{min:Math.min.apply(null,data),max:Math.max.apply(null,data),avg:tot/data.length,sum:tot}}var maxValue=-1;var maxKey="N/A";for(var key in wsymbs){if(wsymbs.hasOwnProperty(key)){if(wsymbs[key]>=maxValue){maxValue=wsymbs[key];maxKey=key}}}var date=new Date(dayData[0]["validTime"]);var dateStr=daysInWeek[date.getDay()]+" "+date.getDate()+"/"+(date.getMonth()+1);days.push({date:dateStr,temp:getStats(temps),wind:getStats(winds),pre:getStats(pres),wsymb:maxKey})}console.log(days);for(var i=0;i<Math.min(days.length,10);i++){var day=days[i];var row=$.getById("fcDay"+i);$.txt(row.getElementsByClassName("w-day-date")[0],day["date"]);$.txt(row.getElementsByClassName("w-day-temp-max")[0],day["temp"]["max"]);$.txt(row.getElementsByClassName("w-day-temp-min")[0],day["temp"]["min"]);$.txt(row.getElementsByClassName("w-day-wind")[0],Math.round(day["wind"]["avg"]*10)/10);$.txt(row.getElementsByClassName("w-day-pre")[0],Math.round(day["pre"]["sum"]*10)/10)}currentForcast={forcast:forcast,daysData:daysData,days:days};openDay(0)}function zeroPad(num){var s=num.toString();if(s.length===1){return"0"+s}else{return s}}function openDay(dayNumber){$.query(".w-day-row.selected").forEach(function(x){x.classList.remove("selected")});$.getById("fcDay"+dayNumber).classList.add("selected");$.cls("w-hour").forEach(function(x){x.classList.remove("enabled")});var dayData=currentForcast["daysData"][dayNumber];for(var i=0;i<dayData.length;i++){var hour=dayData[i];var e=$.getById("fcHour"+i);var date=new Date(hour["validTime"]);var timeStr=zeroPad(date.getHours())+":"+zeroPad(date.getMinutes());$.txt(e.getElementsByClassName("w-hour-time")[0],timeStr);$.txt(e.getElementsByClassName("w-hour-temp")[0],hour["t"]);$.txt(e.getElementsByClassName("w-hour-pre")[0],hour["pmean"]);$.txt(e.getElementsByClassName("w-hour-winds")[0],hour["ws"]);$.txt(e.getElementsByClassName("w-hour-windd")[0],getDirectionText(hour["wd"]));e.classList.add("enabled")}}var currentForcast=null;function getDirectionText(degrees){var dirName=directions[Math.min(7,Math.round(degrees/360*8))];return dirName+"("+degrees+"°)"}var directions=["N","NO","O","SO","S","SV","V","NV"];var daysInWeek=["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];var wsymbName=["Klart","Lätt molnighet","Halvklart","Molnigt","Mycket moln","Mulet","Dimma","Lätt regnskur","Regnskur","Kraftig regnskur","Åskskur","Lätt by av regn och snö","By av regn och snö","Kraftig by av regn och snö","Lätt snöby","Snöby","Kraftig snöby","Lätt regn","Regn","Kraftigt regn","Åska","Lätt snöblandat regn","Snöblandat regn","Kraftigt snöblandat regn","Lätt snöfall","Snöfall","Ymnigt snöfall"];var preTypes=["Ingen nederbörd","Snö","Snöblandat regn","Regn","Duggregn","Frysande regn","Frysande duggregn"];var wsymb=["clear.svg","nearly_clear.svg","variable_cloudiness.svg","halfclear_sky.svg","cloudy_sky.svg","overcast.svg","fog.svg","light_rain_showers.svg","moderate_rain_showers.svg","heavy_rain_showers.svg","thunderstorm.svg","light_sleet_showers.svg","moderate_sleet_showers.svg","heavy_sleet_showers.svg","light_snow_showers.svg","moderate_snow_showers.svg","heavy_snow_showers.svg","light_rain.svg","moderate_rain.svg","heavy_rain.svg","thunder.svg","light_sleet.svg","moderate_sleet.svg","heavy_sleet.svg","light_snowfall.svg","moderate_snowfall.svg"];

(function(c){c.fn.extend({tvready:function(j){c(this).bind("tvready",j)}});var e=false;var d=function(j){if(typeof j!="undefined"){e=j}if(e=="wait"){return}c(document).ready(function(){c(document).trigger("tvready")})};var a={unknown:"unknown",loewe:"Loewe",smartbox:"smartBox",videoweb:"VideoWEB",technisat:"TechniSat",philips:"Philips"};var i=false;var f=false;var g=document.querySelector("head");var h=function(){var j=function(k){if(!k){return false}var l=g.querySelectorAll('link[media*="'+k.toLowerCase()+'"]');for(var m=0;m<l.length;++m){l[m].setAttribute("media","screen")}return true};j(c.tv.type==a.unknown?null:c.tv.type);j(c.browser.opera?"opera-tv":null);j(c.browser.webkit?"webkit-tv":null);j(i?"css3ui":null);return true};var b=function(){var j=function(){d("wait");c(document).ready(function(){h();if(!document.getElementById("jquery-tv-hwdetect")){var m=document.createElement("div");m.setAttribute("id","jquery-tv-hwdetect");m.setAttribute("style","display:none; position:absolute; left:0px; top:0px; width:0px; height:0px;");var p=document.createElement("object");p.setAttribute("id","oipf-config");p.setAttribute("type","application/oipfConfiguration");m.appendChild(p);document.querySelector("body").appendChild(m);if(c.browser.opera){i=true}if(!i){var l=document.createElement("input");l.setAttribute("id","css3ui-nav-test");l.setAttribute("type","text");l.setAttribute("style","nav-up:#css3ui-nav-test;nav-down:#css3ui-nav-test;");i=(typeof l.style.navDown!="undefined"&&l.style.navDown=="#css3ui-nav-test")}var o=(navigator.cookieEnabled)?true:false;if(!o&&typeof navigator.cookieEnabled=="undefined"){document.cookie="testcookie";o=(document.cookie.indexOf("testcookie")!=-1)}f=o}var s=function(x){x=x.toLowerCase().split(":");var u="";for(var w=0,v=0;w<x.length;++w){v=parseInt(x[w],16);u+=(v>99?v:(v>9?"0"+v:"00"+v))}return u};var r=function(){if(!f){return a.unknown}var y="__";var v=function(){if(typeof localStorage!="undefined"&&localStorage.getItem("deviceId")!=null){return localStorage.getItem("deviceId")}var D=document.cookie.split("; ");for(var C=0,E;(E=D[C]&&D[C].split("="));C++){if(E.shift()==="deviceId"){if(typeof localStorage!="undefined"){localStorage.setItem("deviceId",E.join("="))}return E.join("=")}}return null};var A=v();if(A!=null){return y+s(A)}var u=[],z="0123456789abcdef";for(var x=0,w="";x<6;x++){w=z.charAt(Math.floor(Math.random()*z.length));w+=z.charAt(Math.floor(Math.random()*z.length));u.push(w)}u=u.join(":");var B=function(D){if(typeof localStorage!="undefined"){localStorage.setItem("deviceId",D);return}var C=new Date();C.setDate(C.getDate()+365*25);document.cookie=["deviceId","=",D,"; expires="+C.toUTCString(),"","",""].join("")};B(u);return y+s(u)};var t=function(u){if(u==a.unknown){return u}switch(c.tv.type){case a.loewe:u="LO"+u;break;case a.smartbox:u="SB"+u;break;case a.videoweb:u="VW"+u;break;case a.technisat:u="TS"+u;break;case a.philips:u="PH"+u;break;default:u="XX"+u;break}return u};var q=document.getElementById("oipf-config");if(typeof q.localSystem!="undefined"){var n=q.localSystem;if(typeof n.serialNumber!="undefined"){c.tv.id=t(n.serialNumber);return d(true)}if(typeof n.deviceID!="undefined"){c.tv.id=t(n.deviceID);return d(true)}if(typeof n.networkInterfaces!="undefined"){c.tv.id=t(s(n.networkInterfaces.item(0).macAddress));return d(true)}}if(typeof q.configuration!="undefined"){}if(typeof NetRangeDevice=="object"){c.tv.id=t(s(NetRangeDevice.getMACID()));return d(true)}c.tv.id=t(r());d(true)})};var k=function(){var m={Loewe:a.loewe,"LOH/":a.loewe,"smart;":a.smartbox,"videoweb;":a.videoweb,TechniSat:a.technisat,Philips:a.philips,NetTV:a.philips};var l=navigator.userAgent.toLowerCase();for(var n in m){if(l.indexOf(n.toLowerCase())>=0){return c.tv.type=m[n]}}return a.unknown};k();j();c.tv.isTv=(c.tv.isHbbtv||c.tv.type!=a.unknown||navigator.userAgent.indexOf("CE-HTML")>=0)};c.extend({tv:{isTv:false,isHbbtv:(navigator.userAgent.indexOf("HbbTV")>=0),type:a.unknown,id:a.unknown}});b();c.extend({tvinfo:function(){if(e!=true){return"TV plugin is starting (concern using $(document).tvready(callback));"}var j=[];if(c.tv.isTv){j.push("TV/TV box")}if(c.tv.isHbbtv){j.push("HbbTV")}var k=document.getElementById("oipf-config");if(typeof k.localSystem!="undefined"){j.push("OIPF config (HW info)")}if(typeof k.configuration!="undefined"){j.push("OIPF config (basic)")}if(i){j.push("CSS3 UI nav-*")}if(f){j.push("Cookies")}if(typeof localStorage!="undefined"){j.push("localStorage")}if(typeof sessionStorage!="undefined"){j.push("sessionStorage")}if(c.browser.webkit){j.push("WebKit")}if(c.browser.opera){j.push("Opera")}j=(j.length>0?(" ("+j.join(", ")+")"):"");return c.tv.type+j+" #"+c.tv.id}});d()})(jQuery);
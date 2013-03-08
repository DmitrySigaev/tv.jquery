/**
 * @author Vladimir Reznichenko <kalessil@gmail.com>
 * @date   12.05.2012
 *
 * https://github.com/kalessil/tv.jquery
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */

(function(c){var d=function(f){var g={loewe:'link[media*="loewe"]',"smart;":'link[media*="smartbox"]',"videoweb;":'link[media*="videoweb"]',technisat:'link[media*="technisat"]',philips:'link[media*="philips"]',nettv:'link[media*="philips"]',"lg netcast":'link[media*="lgelectronics"]'};for(var h in g){if(f.indexOf(h)>=0){return g[h]}}return undefined};var e=function(f){var h=[];var g=d(f);if(g!=undefined){h.push(g)}if(f.indexOf("opera")>=0){h.push('link[media*="opera-tv"]');return h}if(f.indexOf("webkit")>=0){h.push('link[media*="webkit-tv"]');return h}return h};var b=function(){a=document.getElementsByTagName("head")[0];var h=e(navigator.userAgent.toLowerCase());h=h.join(", ");var j="Pseudo medias: "+h;window.console.log(j);var f=a.querySelectorAll(h);for(var g=f.length-1;g>=0;--g){f[g].setAttribute("media","screen")}};var a;c(document).ready(b)})(jQuery);
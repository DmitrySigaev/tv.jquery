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

(function(d){var e=function(g){var h={Loewe:"loewe","smart;":"smartbox","videoweb;":"videoweb",TechniSat:"technisat",Philips:"philips",NetTV:"philips","LG NetCast":"lgelectronics"};g=g.toLowerCase();for(var i in h){if(g.indexOf(i.toLowerCase())>=0){return h[i]}}return undefined};var c;var a=function(k){var g='link[media*="'+k+'"]';var h=c.find(g);for(var j=h.length-1;j>=0;--j){h[j].setAttribute("media","screen")}};var f=function(g){var i=[];var h=e(g);if(h!=undefined){i.push(h)}if(d.browser.opera){i.push("opera-tv");return i}if(d.browser.webkit){i.push("webkit-tv");return i}return i};var b=function(){c=d(document.getElementsByTagName("head")[0]);var h=f(navigator.userAgent);var i="Load pseudo medias: "+h.join(", ");window.console.log(i);for(var g in h){a(h[g])}};d(document).ready(b)})(jQuery);
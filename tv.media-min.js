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

(function(c){var d=function(f){var g={Loewe:"loewe","smart;":"smartbox","videoweb;":"videoweb",TechniSat:"technisat",Philips:"philips",NetTV:"philips","LG NetCast":"lgelectronics"};f=f.toLowerCase();for(var h in g){if(f.indexOf(h.toLowerCase())>=0){return g[h]}}return undefined};var a=function(j){var f='link[media*="'+j+'"]';var g=c("head").find(f);for(var h=0;h<g.length;++h){g[h].setAttribute("media","screen")}};var e=function(f){var h=[];var g=d(f);if(g!=undefined){h.push(g)}if(c.browser.opera){h.push("opera-tv")}if(c.browser.webkit){h.push("webkit-tv")}return h};var b=function(){var g=e(navigator.userAgent);var h;var i="Load pseudo medias: "+g.join(", ");window.console.log(i);for(var f in g){h=g[f];a(h)}};c(document).ready(b)})(jQuery);
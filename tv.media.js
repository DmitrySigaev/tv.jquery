(function ($) {
    var getTvVendorByUserAgent = function (strUserAgent) {
        var patterns = {
            'loewe':      'link[media*="loewe"]',
            'smart;':     'link[media*="smartbox"]',
            'videoweb;':  'link[media*="videoweb"]',
            'technisat':  'link[media*="technisat"]',
            'philips':    'link[media*="philips"]',
            'nettv':      'link[media*="philips"]',
            'lg netcast': 'link[media*="lgelectronics"]'
        };

        for (var p in patterns) {
            if (strUserAgent.indexOf(p) >= 0) {
                return patterns[p];
            }
        }

        return undefined;
    };

    var getMediasForLoad = function (strUserAgent) {
        var arrMediasForLoad = [];

        var strMediaVendorSelector = getTvVendorByUserAgent(strUserAgent);
        if (strMediaVendorSelector != undefined) {
            arrMediasForLoad.push(strMediaVendorSelector);
        }

        if (strUserAgent.indexOf('opera') >= 0) {
            arrMediasForLoad.push('link[media*="opera-tv"]');
            return arrMediasForLoad;
        }
        if (strUserAgent.indexOf('webkit') >= 0) {
            arrMediasForLoad.push('link[media*="webkit-tv"]');
            return arrMediasForLoad;
        }

        return arrMediasForLoad;
    };

    var runPlugin = function () {
        headNode = document.getElementsByTagName('head')[0];

        var arrMediasForLoad = getMediasForLoad(navigator.userAgent.toLowerCase());
        arrMediasForLoad = arrMediasForLoad.join(', ');

        var strLogMessage = 'Pseudo medias: ' + arrMediasForLoad;
        window.console.log(strLogMessage);

        var links = headNode.querySelectorAll(arrMediasForLoad);
        for (var i = links.length - 1; i >= 0 ; --i) {
            links[i].setAttribute('media', 'screen');
        }
    };

    var headNode;
    $(document).ready(runPlugin);

})(jQuery);
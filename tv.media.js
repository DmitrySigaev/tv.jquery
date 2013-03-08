(function ($) {
    var getTvVendorByUserAgent = function (strUserAgent) {
        var patterns = {
            'Loewe':      'loewe',
            'smart;':     'smartbox',
            'videoweb;':  'videoweb',
            'TechniSat':  'technisat',
            'Philips':    'philips',
            'NetTV':      'philips',
            'LG NetCast': 'lgelectronics'
        };

        strUserAgent = strUserAgent.toLowerCase();
        for (var p in patterns) {
            if (strUserAgent.indexOf(p.toLowerCase()) >= 0) {
                return patterns[p];
            }
        }

        return undefined;
    };

    var headNode;
    var loadLinksByMediaName = function (strMediaName) {
        var strLinkSelector = 'link[media*="' + strMediaName + '"]';
        var links = headNode.find(strLinkSelector);

        for (var i = links.length - 1; i >= 0 ; --i) {
            links[i].setAttribute('media', 'screen');
        }
    };

    var getMediasForLoad = function (strUserAgent) {
        var arrMediasForLoad = [];

        var strMediaVendor = getTvVendorByUserAgent(strUserAgent);
        if (strMediaVendor != undefined) {
            arrMediasForLoad.push(strMediaVendor);
        }

        if ($.browser.opera) {
            arrMediasForLoad.push('opera-tv');
            return arrMediasForLoad;
        }
        if ($.browser.webkit) {
            arrMediasForLoad.push('webkit-tv');
            return arrMediasForLoad;
        }

        return arrMediasForLoad;
    }

    var runPlugin = function () {
        headNode = $(document.getElementsByTagName('head')[0]);

        var arrMediasForLoad = getMediasForLoad(navigator.userAgent);

        var strLogMessage = 'Load pseudo medias: ' + arrMediasForLoad.join(', ');
        window.console.log(strLogMessage);

        for (var position in arrMediasForLoad) {
            loadLinksByMediaName(arrMediasForLoad[position]);
        }
    };

    $(document).ready(runPlugin);
})(jQuery);
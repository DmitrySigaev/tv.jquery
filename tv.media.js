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

    var loadLinksByMediaName = function (strMediaName) {
        var strLinkSelector = 'link[media*="' + strMediaName + '"]';
        var links = $('head').find(strLinkSelector);

        for (var i = 0; i < links.length; ++i) {
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
        }
        if ($.browser.webkit) {
            arrMediasForLoad.push('webkit-tv');
        }

        return arrMediasForLoad;
    }

    var runPlugin = function () {
        var arrMediasForLoad = getMediasForLoad(navigator.userAgent);
        var strMediaName;

        var strLogMessage = 'Load pseudo medias: ' + arrMediasForLoad.join(', ');
        window.console.log(strLogMessage);

        for (var position in arrMediasForLoad) {
            strMediaName = arrMediasForLoad[position];
            loadLinksByMediaName(strMediaName);
        }
    };

    $(document).ready(runPlugin);
})(jQuery);
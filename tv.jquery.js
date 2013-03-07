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

/* Run jQuery plugin now */
(function($){
    /* immediate public interface */
    $.fn.extend({
        /**
         * Adds support for tvready event bind proxy function
         * @param callback function
         */
        tvready: function(callback) {
            $(this).bind('tvready', callback);
        }
    });
    /* immediate public interface */

    var __tv_ready_status = false;

    /**
     * Triggers TV ready event
     */
    var __ready = function(newState){
        if(typeof newState != 'undefined') {
            __tv_ready_status = newState;
        }

        if(__tv_ready_status === 'wait') {
            return;
        }

        $(document).ready(function(){
            $(document).trigger('tvready');
            window.console.log('Device: ' + $.tv.type + ' #' + $.tv.id);
        });
    };

    /* constants */
    var deviceType = {
        unknown:   'unknown',
        loewe:     'Loewe',
        smartbox:  'smartBox',
        videoweb:  'VideoWEB',
        technisat: 'TechniSat',
        philips:   'Philips',
        lge:       'LG Electronics'
    };

    var __css3uiNavSupported = false;
    var __cookiesAvailable = false;


    /* variable to be used later in several places, reducing searches */
    var __headNode = document.querySelector('head');

    var __grabInfo = function() {
        var __grabHardwareId = function(){
            /*
             * embeddable object based detection, it non immediate due to
             * domManipulations possible only on document ready
             */
            __ready('wait');

            $(document).ready(function(){

                if(!document.getElementById('jquery-tv-hwdetect'))
                {
                    /**
                     * Inject HTML for futher detection, used direct
                     * domElement creation, instead of pure jQuery, which slow.
                     * Since we are on TV, it's critical.
                     */
                    var container = document.createElement('div');
                    container.setAttribute('id', 'jquery-tv-hwdetect');
                    container.setAttribute('style', 'display:none; position:absolute; left:0px; top:0px; width:0px; height:0px;');

                    /* oipf configuration standart injection */
                    var oipfConfig = document.createElement('object');
                    oipfConfig.setAttribute('id', 'oipf-config'); oipfConfig.setAttribute('type', 'application/oipfConfiguration');
                    container.appendChild(oipfConfig);

                    var lgNetCastDevice = document.createElement('object');
                    lgNetCastDevice.setAttribute('id', 'lgNetCastDevice'); oipfConfig.setAttribute('type', 'application/x-netcast-info');
                    container.appendChild(lgNetCastDevice);

                    /* Modify document now with assembled injection */
                    document.querySelector('body').appendChild(container);

                    /*
                     * CSS3 UI spatial navigation test
                     * Check if data from inline existing is Node style attributes
                    **/
                    if($.browser.opera) {
                        __css3uiNavSupported = true;
                    }
                    if(!__css3uiNavSupported) {
                        var css4uiNav = document.createElement('input');
                        css4uiNav.setAttribute('id', 'css3ui-nav-test');
                        css4uiNav.setAttribute('type', 'text');
                        css4uiNav.setAttribute('style', 'nav-up:#css3ui-nav-test;nav-down:#css3ui-nav-test;');
                        /* Do test */
                        __css3uiNavSupported = (typeof css4uiNav.style.navDown != 'undefined' && css4uiNav.style.navDown == '#css3ui-nav-test');
                    }
                    $.tv.hasSpatialNav = __css3uiNavSupported;

                    /* Test cookie enabled */
                     var cookieEnabled = navigator.cookieEnabled;
                     if (!cookieEnabled && typeof navigator.cookieEnabled == 'undefined')
                     { 
                          document.cookie = 'testcookie';
                          cookieEnabled = (document.cookie.indexOf('testcookie') != -1);
                     }
                     __cookiesAvailable = cookieEnabled;
                     /* Test cookie enabled */
                }
                
                
                /* I don't like using raw MAC, generate some kind of serial from it */
                var __toSerial = function(mac) {
                    mac = mac.toLowerCase().split(':');

                    var result = '';
                    for(var i = 0, tmp = 0; i < mac.length; ++i)
                    {
                        /* each byte to decimal basis in XXX format*/
                        tmp = parseInt(mac[i], 16);
                        result += (tmp > 99 ? tmp : (tmp > 9 ? '0' + tmp : '00' + tmp));
                    }
                    return result;
                };

                /* Generate pseudo MAC address */
                var __serialNumberSelfAssign = function() {
                    if(!__cookiesAvailable) {
                        return deviceType.unknown;
                    }
                    
                    var prefix = '__';
                    
                    /* check cookies first */
                    var __readStored = function() {
                        /* if has local storage support */
                        if(typeof localStorage != 'undefined' && localStorage.getItem('deviceId') != null) {
                            return localStorage.getItem('deviceId');
                        }
                        
                        /* use cookies */
                        var cookies = document.cookie.split('; ');
                        for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
                            if (parts.shift() === 'deviceId') {
                                /* Provide migration cookies -> local storage when soft upgraded */
                                if(typeof localStorage != 'undefined') {
                                    localStorage.setItem('deviceId', parts.join('='));
                                }

                                return parts.join('=');
                            }
                        }
                        return null;
                    };
                    var cooked = __readStored();
                    if(cooked != null) {
                        return prefix + __toSerial(cooked);
                    }

                    /* generate new MAC */
                    var result = [], alphabet = '0123456789abcdef';
                    for (var i = 0, part = ''; i < 6; i++)
                    {
                       /* generate single byte in hex basis */
                       part  = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                       part += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                       result.push(part);
                    }
                    result = result.join(':');
                    /* generate new MAC */

                    /* store it */
                    var __writeStored = function(mac) {
                        /* if has local storage support */
                        if(typeof localStorage != 'undefined') {
                            localStorage.setItem('deviceId', mac);
                            return;
                        }
                        
                        /* use cookies */
                        var expire = new Date(); expire.setDate(expire.getDate() + 365 * 25);
                        /* 25 years is enought, earlier soft update can drop cookies */
                        document.cookie = [
                               'deviceId', '=', mac, /* data */
                               '; expires=' + expire.toUTCString(),
                               '', /* path */
                               '', /* domain */
                               ''  /* secure */
                           ].join('');
                    };
                    __writeStored(result);

                    return prefix + __toSerial(result);
                };

                /* Will add prefix disclosuring manufacturer to given serial */
                var __prefixSerial = function(serial){
                    if(serial == deviceType.unknown) {
                        return serial;
                    }

                    switch($.tv.type)
                    {
                       case deviceType.loewe:
                           serial = 'LO' + serial;
                           break;
                       case deviceType.smartbox:
                           serial = 'SB' + serial;
                           break;
                       case deviceType.videoweb:
                           serial = 'VW' + serial;
                           break;
                       case deviceType.technisat:
                           serial = 'TS' + serial;
                           break;
                       case deviceType.philips:
                           serial = 'PH' + serial;
                           break;
                       case deviceType.lge:
                           serial = 'LG' + serial;
                           break;
                       
                       default:
                           serial = 'XX' + serial;
                           break;
                    }

                    return serial;
                };
                
                /* @see oipf.tv, primary detection */
                var oipfObject = document.getElementById('oipf-config');
                if (typeof oipfObject.localSystem != 'undefined') 
                {
                    var hwInfo = oipfObject.localSystem;

                    /* TODO: how handle extention of supporting festures on soft upgrade? */

                    /* Fine, we have serial from manufacturer */
                    if(typeof hwInfo.serialNumber != 'undefined') {
                        $.tv.id = __prefixSerial(hwInfo.serialNumber);
                        return __ready(true);
                    } 

                    /* Device ID is acceptable as well */
                    if(typeof hwInfo.deviceID != 'undefined') {
                        $.tv.id = __prefixSerial(hwInfo.deviceID);
                        return __ready(true);
                    } 

                    /* Ok, then identify by first Network Interface (MAC address) */
                    if(typeof hwInfo.networkInterfaces != 'undefined') {
                       $.tv.id = __prefixSerial(__toSerial(hwInfo.networkInterfaces.item(0).macAddress));
                       return __ready(true);
                    }
                }
                
                if(typeof oipfObject.configuration != 'undefined') {
                    /* 
                     * Only basics are implemented on current device, no LocalSystem.
                     *
                     * TODO: discuss if langs to be extracted to $.tv container
                     **/
                }

                /* Non-standard capabilities */
                /* Loewe */
                if(typeof NetRangeDevice == 'object') {
                    /* Loewe */
                    $.tv.id = __prefixSerial(__toSerial(NetRangeDevice.getMACID()));
                    return __ready(true);
                }
                /* LG */
                var lgNetCastDeviceObject = document.getElementById('lgNetCastDevice');
                if(typeof lgNetCastDeviceObject.manufacturer != 'undefined') {
                    if(typeof lgNetCastDevice.serialNumber != 'undefine') {
                        $.tv.id = __prefixSerial(lgNetCastDevice.serialNumber);
                        return __ready(true);
                    }

                    if(typeof lgNetCastDevice.net_macAddress != 'undefine') {
                        $.tv.id = __prefixSerial(__toSerial(lgNetCastDevice.net_macAddress));
                        return __ready(true);
                    }
                }
                /* Non-standard capabilities */


                /* failed do detect anything, fallback to fake MAC id */
                $.tv.id = __prefixSerial(__serialNumberSelfAssign());
                return __ready(true);
            });
        };

        /**
         * Check UA to define who is manufacturer/what is device
         * @return string
         */
        var __grabHardwareType = function()
        {
            /* loop on object to match strings */
            var patterns = {
                'Loewe':      deviceType.loewe,
                'smart;':     deviceType.smartbox,
                'videoweb;':  deviceType.videoweb,
                'TechniSat':  deviceType.technisat,
                'Philips':    deviceType.philips,   'NetTV': deviceType.philips,
                'LG NetCast': deviceType.lge
            };
            
            var ua = navigator.userAgent.toLowerCase();
            for(var p in patterns) {
                if (ua.indexOf(p.toLowerCase()) >= 0) {
                    return $.tv.type = patterns[p];
                }
            }

            /* default result is unknown */
            return deviceType.unknown;
        };

        __grabHardwareType();
        __grabHardwareId();

        $.tv.isTv = ($.tv.isHbbtv || $.tv.type != deviceType.unknown || navigator.userAgent.indexOf('CE-HTML') >= 0);
    };


    /* populate data storage */
    $.extend({
        tv: {
            'isTv':    false,
            'isHbbtv': (navigator.userAgent.indexOf('HbbTV') >= 0),
            'type':    deviceType.unknown,
            'id':      deviceType.unknown,
            'hasSpatialNav': false
        }
    });
    __grabInfo();
    /* populate data storage */


    /* public interface */
    $.extend({
        /**
         * Builds human readable device information.
         *
         * @return string
         */
        tvinfo: function() {
            if (__tv_ready_status != true) {
                return 'TV plugin is starting (concern using $(document).tvready(callback));';
            }

            /* Features report */
            var features = [];
            if($.tv.isTv) {                                         features.push('TV/TV box'); }
            if($.tv.isHbbtv) { features.push('HbbTV'); }

            var localSystem = document.getElementById('oipf-config');
            if (typeof localSystem.localSystem != 'undefined') {    features.push('OIPF config (HW info)'); }
            if (typeof localSystem.configuration != 'undefined') {  features.push('OIPF config (basic)'); }

            if(__css3uiNavSupported) {                              features.push('CSS3 UI nav-*'); }
            if(__cookiesAvailable) {                                features.push('Cookies'); }
            if(typeof localStorage != 'undefined') {                features.push('localStorage'); }
            if(typeof sessionStorage != 'undefined') {              features.push('sessionStorage'); }
            if($.browser.webkit) {                                  features.push('WebKit'); }
            if($.browser.opera) {                                   features.push('Opera'); }

            features = (features.length > 0 ? (' (' + features.join(', ') + ')') : '');
            /* Features report */


            return $.tv.type + features + ' #' + $.tv.id;
        }
    });
    /* public interface */


    /* Finalize plugin load */
    __ready();
    /* Finalize plugin load */

})(jQuery);
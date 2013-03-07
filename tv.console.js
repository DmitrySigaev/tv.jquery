/**
 * @author Vladimir Reznichenko <kalessil@gmail.com>
 * @date   14.12.2012
 *
 * https://github.com/kalessil/tv.jquery
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 * This script provides simple error console on TV devices
 */
(function ($) {
    var consoleBuffer = [];

    var consoleBufferEntry_create = function (strMessage) {
        return [strMessage, 1];
    };
    var consoleBufferEntry_isEqual = function (entry, strMessage) {
        return entry[0] === strMessage;
    };
    var consoleBufferEntry_toString = function (entry) {
        var strMessage = entry[0];
        var countAppeared = entry[1];

        var strReportAppeared = '';
        if (countAppeared > 1) {
            strReportAppeared = ' [' + countAppeared + ']';
        }

        return '&rsaquo; ' + strMessage + strReportAppeared;
    };


    var consoleBuffer_clear = function () {
        while (consoleBuffer.length > 1) {
            consoleBuffer.pop();
        }
    };
    var consoleBuffer_hasDuplicates = function (strMessage) {
        var isDuplicate = false;
        var entry;

        for (var position in consoleBuffer) {
            entry = consoleBuffer[position];
            isDuplicate = consoleBufferEntry_isEqual(entry, strMessage);
            if (isDuplicate) {
                return true;
            }
        }

        return false;
    };
    var consoleBuffer_push = function (strMessage) {
        var newEntry = consoleBufferEntry_create(strMessage);
        consoleBuffer.push(newEntry);
    };
    var consoleBuffer_popDuplicateUp = function (strMessage) {
        var isDuplicate;
        var entry;

        for (var position in consoleBuffer) {
            entry = consoleBuffer[position];
            isDuplicate = consoleBufferEntry_isEqual(entry, strMessage);
            if (isDuplicate) {
                var lastEntryPosition = consoleBuffer.length - 1;

                if (lastEntryPosition != position) {
                    var backupLastOne = consoleBuffer[lastEntryPosition];
                    consoleBuffer[lastEntryPosition] = consoleBuffer[position];
                    consoleBuffer[position] = backupLastOne;
                }

                return;
            }
        }
    };
    var consoleBuffer_count = function() {
        return consoleBuffer.length;
    };
    var consoleBuffer_mergeDuplicate = function (strMessage) {
        var isDuplicate;
        var entry;

        for (var position in consoleBuffer) {
            entry = consoleBuffer[position];
            isDuplicate = consoleBufferEntry_isEqual(entry, strMessage);
            if (isDuplicate) {
                ++consoleBuffer[position][1];
                return;
            }
        }
    };

    var consoleBuffer_registerEntry = function (strMessage) {
        var hasDuplicates = consoleBuffer_hasDuplicates(strMessage);

        if (!hasDuplicates) {
            consoleBuffer_push(strMessage);
            return;
        }

        consoleBuffer_mergeDuplicate(strMessage);
        consoleBuffer_popDuplicateUp(strMessage);
    };

    var consoleObject_create = function () {
        var consoleObject = {
            log:function (strMessage) {
                consoleBuffer_registerEntry(strMessage);
                consoleObject.refresh();
            },
            debug:function (strMessage) {
                consoleBuffer_registerEntry('Debug: ' + strMessage);
                consoleObject.refresh();
            },
            error:function (strMessage) {
                consoleBuffer_registerEntry('<span style="color:#F00">' + strMessage + '</span>');
                consoleObject.refresh();
            },
            info:function (strMessage) {
                consoleBuffer_registerEntry('Info: ' + strMessage);
                consoleObject.refresh();
            },
            warn:function (strMessage) {
                consoleBuffer_registerEntry('<span style="color:#FF7000">' + strMessage + '</span>');
                consoleObject.refresh();
            },
            refresh:function () { },
            clear:function () {
                consoleBuffer_clear();
                consoleObject.refresh();
            }

        };

        return consoleObject;
    };

    var ajaxData_toString = function (event, jqXHR, ajaxSettings){
        var strUrl = ajaxSettings.url;
        var strStatus = jqXHR.statusText;
        var strMethod = ajaxSettings.type;

        var isHttpsOn = (window.location.protocol.toLowerCase() === 'https');
        if(isHttpsOn || true) {
            var ajaxProtocol = (strUrl.split(':', 1))[0];
            if(ajaxProtocol === 'http' || true) {
                strUrl = strUrl.replace('http://', '<span style="color:#F00">http</span>://');
            }
        }

        strUrl = '<span style="color:#666;text-decoration:underline">' + strUrl + '</span>';
        strStatus = (strStatus ? (' <span style="color:#a6a6a6">' + strStatus + '</span>') : '');
        return strMethod + ' ' + strUrl + strStatus;
    };

    /* attaching listeners */
    window.addEventListener('error', function (event) {
        var strMessage = event.message;
        window.console.error(strMessage);

        return true;
    });
    $(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
        var strErrorMessage = ajaxData_toString(event, jqXHR, ajaxSettings);
        window.console.error(strErrorMessage + ' ' + (thrownError ? thrownError : ''));
    });
    $(document).ajaxSuccess(function (event, jqXHR, ajaxSettings) {
        var strLogMessage = ajaxData_toString(event, jqXHR, ajaxSettings);
        window.console.info(strLogMessage);
    });


    var gui_redraw = function () {
        var hasEntries = consoleBuffer_count();

        if (hasEntries) {
            gui_writeEntriesDown(consoleBuffer);
        }
    };

    /**
     * @param arrEntries
     */
    var gui_writeEntriesDown = function(arrEntries) {
        var consoleNode = $('#tv-console');

        consoleNode.html('');

        var entry;
        var strEntry;
        var lineBreak = document.createElement('br');
        for(var position in arrEntries) {
            entry = arrEntries[position];

            strEntry = consoleBufferEntry_toString(entry);
            consoleNode.append(strEntry);
            consoleNode.append(lineBreak.cloneNode());
        }

        consoleNode.show();
    };

    var gui_createDiv = function () {
        var cssAttributes = {
            'display':'none',
            'position':'absolute',
            'bottom':'0',
            'left':'0',
            'width':'100%',
            'border-top':'solid 1px #c6c6c6',
            'padding':'7px',
            'color':'#a6a6a6',
            'font-size':'0.9em'
        };


        var divNode = document.createElement('div');
        divNode.setAttribute('id', 'tv-console');

        divNode = $(divNode);
        divNode.css(cssAttributes);

        $('body').append(divNode);

    };

    var runPlugin = function () {
        var strNativeConsoleStatus = '';
        if(typeof window.console != 'undefined') {
            strNativeConsoleStatus = ' (native one is overridden)';
        }

        window.console = consoleObject_create();

        consoleBuffer_registerEntry('TV console started' + strNativeConsoleStatus);
        gui_createDiv();

        window.console.refresh = gui_redraw;
        window.console.refresh();
    };

    $(document).ready(runPlugin);

})(jQuery);
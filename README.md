tv.jquery
=========

TV/HbbTV development supporting environment. jQuery integrated.


 Collects basic device info, provides additional level for development (additional pseudo types for link tag media).
 opera-tv, webkit-tv, css3ui, loewe, philips, smartbox, technisat, smartbox, videoweb and to be extended.

Interface

 Invokes head link[media=loewe|smartbox|other manufactirer|css3ui|opera-tv|webkit-tv] stylefiles automatically
 according to device info accessible.

 jQuery.tv.isTv     bool
 jQuery.tv.isHbbtv  bool
 jQuery.tv.type     string   Device manufacturer/type
 jQuery.tv.id       string   identifier/serial number, 'unknown' if no data can be fetched/generated.

 jQuery.tvinfo();   TV info as single string (bult from jQuery.tv.* attributes)

Usage

 - Load jQuery
 - Load this plugin
 - Load rest scripts

 CSS3 UI:                       <link media="opera-tv css3ui" src="...css3 ui navigation..." />
 Manufacter-specific style/fix: <link media="loewe"           src="...loewe-specific CSS/fix..." />
 Browser-specific style/fix:    <link media="webkit-tv"       src="...webkit-specific CSS/fix..." />

 $(document).tvready(function(){
     ... your code here ...
 });
 $(document).bind('tvready', function(){
      ... your code here ...
  });

TODO:

   - Check if embeddeded object nodes working without being added to document, as CSS3 UI test
   - provide back log of all ids (serial, deviceid, MAC, localStorage)
   - test invoking medias before document.ready
   - document keyup handle
   -- 'numeric' fields, that has automatic mapping characters to numbers as on remote control (delayed init)
   -- fix colored buttons code insertion in text controls (yellow operates as backspace)

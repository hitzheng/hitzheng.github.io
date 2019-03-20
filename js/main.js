(function ($) {
    // initialize highlight.js
    hljs.initHighlightingOnLoad();

    // initialize tooltip
    $("[data-toggle='tooltip']").tooltip();

    // initialize toc-sidebar affix,
    // top: start offset from top, bottom: stop offset from bottom
    var toc = $("#toc-sidebar");
    if (toc.length > 0) {
        var top = toc.offset().top - 20;
        toc.affix({offset: {top: top, bottom: 120}});
    }

    // initialize toc-sidenav scrollspy
    $("body").scrollspy({target: "#toc-sidenav"});
})(jQuery);


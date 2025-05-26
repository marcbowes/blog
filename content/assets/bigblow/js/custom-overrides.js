// Custom overrides for BigBlow theme

$(document).ready(function() {
    // 1. Remove the dashboard sidebar
    $('#left-panel-wrapper').remove();
    $('#right-panel-wrapper').remove();
    
    // 2. Override the generateMiniToc function to change "In this section" to "On this page"
    window.generateMiniToc = function(divId) {
        let headers = null;
        if(divId) {
            $('#minitoc').empty().append('<h2>On this page</h2>');
            headers = $('#' + divId).find('h3');
        }
        else {
            $('#minitoc').empty().append('<h2>On this page</h2>');
            headers = $('div#content').find(':header');
        }
        
        headers.each(function(i) {
            let text = $(this)
                .clone()    //clone the element
                .children() //select all the children
                .remove()   //remove all the children
                .end()  //again go back to selected element
                .text().trim();
            var level = parseInt(this.nodeName.substring(1), 10);
            let prefix = "".padStart(level-1, "  ");
            $("#minitoc").append("<a href='#" + $(this).attr("id") + "'>"
                                 + prefix + text + "</a>");
        });
        
        // Ensure that the target is expanded (hideShow)
        $('#minitoc a[href^="#"]').click(function() {
            var href = $(this).attr('href');
            hsExpandAnchor(href);
        });
    }
    
    // Re-generate the minitoc with our changes
    var divId = $('#content div[aria-expanded=true]').attr('id');
    generateMiniToc(divId);
    
    // Also update when tabs are activated
    $('#content').on('tabsactivate', function(event, ui) {
        var divId = ui.newTab.attr('aria-controls');
        generateMiniToc(divId);
    });
    
    // 3. Add Home link to the tabs
    setTimeout(function() {
        if ($('#tabs').length > 0) {
            $('#tabs').prepend('<li><a href="index.html">Home</a></li>');
        }
    }, 100);
});

// Remove keyboard shortcuts for dashboard (h and ?)
document.onkeypress = function(e) {
    if (!e) var e = window.event;
    var keycode = (e.keyCode) ? e.keyCode : e.which;
    var actualkey = String.fromCharCode(keycode);
    
    switch (actualkey) {
        case "n": // next
            clickNextTab();
            break;
        case "p": // previous
            clickPreviousTab();
            break;
        case "<": // scroll to top
            $(window).scrollTop(0);
            break;
        case ">": // scroll to bottom
            $(window).scrollTop($(document).height());
            break;
        case "-": // collapse all
            hsCollapseAll();
            break;
        case "+": // expand all
            hsExpandAll();
            break;
        case "r": // go to next task
            hsReviewTaskNext();
            break;
        case "R": // go to previous task
            hsReviewTaskPrev();
            break;
        case "q": // quit reviewing
            hsReviewTaskQuit();
            break;
        case "g": // refresh the page
            location.reload(true);
            break;
        // Removed "h" and "?" shortcuts that toggle the dashboard
    }
}

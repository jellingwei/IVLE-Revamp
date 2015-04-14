$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadWorkbinList();
    loadAnnouncementsHandler();
    setClickHandlersOnSidebarItems();
});

// menu
$(".close-menu").click(function () {
    // var toggleWidth = $(".menu").width() == 50 ? "15%" : "50px";
    // $(".menu").animate({ width: toggleWidth });

    if ($(".menu").width() == 50) {
        $(".menu").animate({width: "15%"});
        $(".min-max .row").css("padding", "0 20px");
        $(".category-header").css("display", "block");
        $(".categories a").css("display", "inline");
    } else {
        $(".menu").animate({width: "50px"});
        $(".min-max .row").css("padding", "0 15px");
        $(".category-header").css("display", "none");
        $(".categories a").css("display", "none");
    }

});

// pre-emails

function loadWorkbinList() {
    var todayDate = new Date();
    var todayHeader = '<h3 class="pre-email-dates">Today</h3>';
    var yesterdayHeader = '<h3 class="pre-email-dates">Yesterday</h3>';
    var dateHeader = '<h3 class="pre-email-dates"></h3>';

    var workbinContainer = $(".pre-emails");
    workbinContainer.html("");

    for (var i = 0; i < workbinContent.length; i++) {
        var content = workbinContent[i];
        
        workbinContainer.append(getDateHeaderHtml(content.time));
        var html = '<div class="workbinContent pre-emails-wrapper ' + content.folder + ' ' + content.moduleCode +' " data-announcement-id="' + i + '"><div class="pre-email-head">' +
            '<span class="pre-emails-name">' + content.moduleCode + '</span>' +
            '<span class="">&nbsp;&nbsp;&nbsp;&nbsp;' + content.folder + '</span>' +
            '<div class="right"><span class="pre-emailstime">' + content.time.toLocaleTimeString() + '</span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-checkin"></span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-dropdown"></span>' +
            '</div></div>' +
            '<div class="pre-email-body">' +
            '<a href ="' + content.fileurl + '">' +
            '<h4 class="pre-email-h4">' + content.title + '</h4>' +
            '</a>';
        if (content.content) {
            html += '<p class="pre-email-p truncate">' + stripHtmlTags(content.content) + '</p></div></div>';
        }
        workbinContainer.append(html);
    }
}

function stripHtmlTags(string) {
    // CREDIT: https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
    return string.replace(/(<([^>]+)>)/ig, "");
}

var displayedHeaders = {};

function getDateHeaderHtml(date) {
    var todayDate = new Date();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    var value = "";
    if (date.toDateString() === todayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Today";
    } else if (date.toDateString() === yesterdayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Yesterday";
    } else if (!displayedHeaders[date.toDateString()]){
        displayedHeaders[date.toDateString()] = true;
        value = date.toDateString();
    }
    if (value != "") {
        return '<h3 class="pre-email-dates">' + value + '</h3>';
    }
}

// load announcements
function loadAnnouncementsHandler() {
    $(".pre-emails-wrapper").click(function () {
        $(".pre-emails-wrapper").removeClass('active');
        $(this).addClass('active');

        var index = $(this).data('announcement-id');

        $(".email-title-header").html("");
        $(".email-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
        $(".email-inside-content").html("");
        $(".email-inside-content").append(announcements[index].content);

    });
}

// view-modules content

function setClickHandlersOnSidebarItems() {
    $(".category-modules ul li").click(function () {
        
        var modCode = $(this).data("module");
        var contentToShow = 
               $(".workbinContent").filter(function(val) {
                        return ($(this).hasClass(modCode));
                });
        contentToShow.show();
        
        var contentToHide = 
               $(".workbinContent").filter(function(val) {
                        return $(this).hasClass(modCode) !== true;
                });
        contentToHide.hide();
    });
}
$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadAnnouncementsList();
    loadAnnouncementsHandler();
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

function loadAnnouncementsList() {
    var announcementsContainer = $(".pre-emails");
    announcementsContainer.html("");

    for (var i = 0; i < announcements.length; i++) {
        var announcement = announcements[i];
        // TODO:
        announcementsContainer.append(getDateHeaderHtml(announcement.time));
        var announcementHtml = '<div class="pre-emails-wrapper" data-announcement-id="' + i + '"><div class="pre-email-head">' +
            '<span class="pre-emails-name">' + announcement.moduleCode + '</span>' +
            '<div class="right"><span class="pre-emailstime">' + announcement.time.toLocaleTimeString() + '</span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-checkin"></span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-dropdown"></span>' +
            '</div></div>' +
            '<div class="pre-email-body">' +
            '<h4 class="pre-email-h4">' + announcement.title + '</h4>' +
            '<p class="pre-email-p truncate">' + stripHtmlTags(announcement.content) + '</p></div></div>';
        announcementsContainer.append(announcementHtml);
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

        //console.log($(this).data('announcement-id'));
        var index = $(this).data('announcement-id');

        $(".email-title-header").html("");
        $(".email-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
        $(".email-inside-content").html("");
        $(".email-inside-content").append(announcements[index].content);

    });
}

// view-email
$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadAnnouncementsList();
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
    var todayDate = new Date();
    var todayHeader = '<h3 class="pre-email-dates">Today</h3>';
    var yesterdayHeader = '<h3 class="pre-email-dates">Yesterday</h3>';
    var dateHeader = '<h3 class="pre-email-dates"></h3>';

    var announcementsContainer = $(".pre-emails");
    announcementsContainer.html("");

    for (var i = 0; i < announcements.length; i++) {
        var announcement = announcements[i];
        // TODO:
        announcementsContainer.append(getDateHeaderHtml(announcement.time));
        var announcementHtml = '<div class="pre-emails-wrapper"><div class="pre-email-head">' +
            '<span class="pre-emails-name">' + announcement.moduleCode + '</span>' +
            '<div class="right"><span class="pre-emailstime">' + announcement.time.toLocaleTimeString() + '</span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-checkin"></span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-emails-dropdown"></span>' +
            '</div></div>' +
            '<div class="pre-email-body">' +
            '<h4 class="pre-email-h4">' + announcement.title + '</h4>' +
            '<p class="pre-email-p">asd</p></div></div>';
        announcementsContainer.append(announcementHtml);
    }
}

function getDateHeaderHtml(date) {
    var todayDate = new Date();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    var value = "";
    if (date.toDateString() === todayDate.toDateString()) {
        value = "Today";
    } else if (date.toDateString() === yesterdayDate.toDateString()) {
        value = "Yesterday";
    } else {
        value = date.toDateString();
    }
    return '<h3 class="pre-email-dates">' + value + '</h3>';
}

// load announcements
$(".pre-emails-wrapper").click(function () {
    $(".pre-emails-wrapper").removeClass('active');
    $(this).addClass('active');

    // console.log($(this).index());
    var index = $(this).index() - 1;

    if (index > 2) {
        index = 3;
    }
    $(".email-title-header").html("");
    $(".email-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
    $(".email-inside-content").html("");
    $(".email-inside-content").append(announcements[index].content);

});

// view-email
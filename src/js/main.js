$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadAnnouncementsList();
    loadAnnouncementsHandler();
    loadFilters();
    loadFavouriteButtons();
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
var unreadAnnouncementCount = 0;
function loadAnnouncementsList(predicate) {
    var announcementsContainer = $(".pre-emails");
    announcementsContainer.html("");
    displayedHeaders = [];
    unreadAnnouncementCount = 0;

    for (var i = 0; i < announcements.length; i++) {
        var announcement = announcements[i];
        var favouritedClass = announcement.favourited ? "selected" : "";
        var readClass = announcement.read ? "" : "unread";

        if (predicate == null || predicate(announcement)) {
            // TODO:
            announcementsContainer.append(getDateHeaderHtml(announcement.time));
            var announcementHtml = '<div class="pre-emails-wrapper ' + readClass + '" data-announcement-id="' + announcement.id + '">' +
                '<div class="pre-email-head">' +
                '<span class="pre-emails-name">' + announcement.moduleCode + '</span>' +
                '<div class="right"><span class="pre-emailstime">' + getNiceTimeString(announcement.time) + '</span>' +
                '<span class="middot">&middot;</span>' +
                '<span class="pre-announcements-favourite ' + favouritedClass + '"></span>' +
                '<span class="middot">&middot;</span>' +
                '<span class="pre-emails-dropdown"></span>' +
                '</div></div>' +
                '<div class="pre-email-body">' +
                '<h4 class="pre-email-h4">' + announcement.title + '</h4>' +
                '<p class="pre-email-p truncate">' + stripHtmlTags(announcement.content) + '</p></div></div>';
            announcementsContainer.append(announcementHtml);
        }

        if (!announcement.read) {
            unreadAnnouncementCount++;
        }
    }
    updateAnnouncementCounter();
}

function updateAnnouncementCounter() {
    $('#announcements-counter').text(unreadAnnouncementCount);
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

    var value = date.toDateString();
    if (date.toDateString() === todayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Today, " + value;
    } else if (date.toDateString() === yesterdayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Yesterday, " + value;
    } else if (!displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
    }
    return '<h3 class="pre-email-dates">' + value + '</h3>';
}

function getNiceDateString(date) {
    var todayDate = new Date();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    var value = date.toDateString() + ' ' + getNiceTimeString(date);
    if (date.toDateString() === todayDate.toDateString()) {
        value = 'Today, ' + value;
    } else if (date.toDateString() === yesterdayDate.toDateString()) {
        value = 'Yesterday, ' + value;
    }
    return value;
}

function getNiceTimeString(date) {
    var value;
    value = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    value += ':';
    value += date.getMinutes();
    value += ' ';
    value += date.getHours() >= 12 ? 'PM' : 'AM';
    return value;
}

// load announcements
function loadAnnouncementsHandler() {
    $('.pre-emails-wrapper').click(function () {
        $('.pre-emails-wrapper').removeClass('active');
        $(this).addClass('active');
        $(this).removeClass('unread');

        //console.log($(this));
        var index = $(this).data('announcement-id');
        var announcement = announcements[index];
        var favouritedClass = announcement.favourited ? "selected" : "";

        if (!announcement.read) {
            announcement.read = true;
            unreadAnnouncementCount--;
            updateAnnouncementCounter();
        }

        var announcementTitleHeader = $('.email-title-header');
        var announcementContent = $('.email-inside-content');
        var announcementTime = $('.email-from-time');
        var announcementFavouriteIcon = $('.announcement-favourite-icon');

        announcementTitleHeader.html('');
        announcementTitleHeader.append("<b>" + announcement.moduleCode + ":</b> " + announcement.title);
        announcementTime.html('');
        announcementTime.append(getNiceDateString(announcement.time));
        announcementFavouriteIcon.html("");
        announcementFavouriteIcon.append('<span class="pre-announcements-favourite ' + favouritedClass + '"></span>');
        announcementContent.html('');
        announcementContent.append(announcement.content);
    });
}

// initialise filters
function loadFilters() {
    var filters = $('.announcements-filters li');
    filters.click(function () {
        filters.removeClass('selected');
        $(this).addClass('selected');

        switch ($(this).attr('id')) {
            case 'announcements-filters-read':
                var predicate = function (announcement) {
                    return announcement.read;
                };
                loadAnnouncementsList(predicate);
                break;
            case 'announcements-filters-unread':
                var predicate = function (announcement) {
                    return !announcement.read;
                };
                loadAnnouncementsList(predicate);
                break;
            case 'announcements-filters-favourites':
                var predicate = function (announcement) {
                    return announcement.favourited;
                };
                loadAnnouncementsList(predicate);
                break;
            case 'announcements-filters-all':
            default:
                var predicate = function (announcement) {
                    return true;
                };
                loadAnnouncementsList(predicate);
        }
        loadAnnouncementsHandler();
        loadFavouriteButtons();
    });
}

// initialise favourite buttons
function loadFavouriteButtons() {
    var favouriteButtons = $('.pre-announcements-favourite');
    favouriteButtons.click(function () {
        $(this).toggleClass('selected');
        var announcementId = $(this).parents('.pre-emails-wrapper').data('announcement-id');
        announcements[announcementId].favourited = $(this).hasClass('selected');
    });
}

// view-email
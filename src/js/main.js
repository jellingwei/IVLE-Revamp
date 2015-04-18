$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadAnnouncementsList();
    loadAnnouncementsHandler();
    loadFilters();
    loadFavouriteButtons();
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

function isAnnouncementOfViewingModule(modCode) {
    if (viewingModule) {
        return viewingModule === modCode;   
    }
    return true;
}

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
        var modCode = announcement.moduleCode;

        if (predicate == null || (predicate(announcement) && isAnnouncementOfViewingModule(modCode)) ) {
            // TODO:
            announcementsContainer.append(getDateHeaderHtml(announcement.time));
            var announcementHtml = '<div class="pre-emails-wrapper ' + readClass + ' ' + modCode + ' announcement" data-announcement-id="' + announcement.id + '">' +
                '<div class="pre-email-head">' +
                '<span class="pre-emails-name">' + announcement.moduleCode + '</span>' +
                '<div class="right"><span class="pre-emailstime">' + getNiceTimeString(announcement.time) + '</span>' +
                '<span class="middot">&middot;</span>' +
                '<span class="pre-announcements-favourite ' + favouritedClass + '"></span>' +
                '<span class="middot">&middot;</span>' +
                '<span class="pre-announcements-reminder" data-toggle="modal" data-target="#myModal"></span>' +
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
// reminder buttons
// clock
$('.clockpicker').clockpicker({
    placement: 'bottom',
    align: 'left',
    donetext: 'Done',
    'default': 'now',
    autoclose: true

});


$('.reminder-8am').click(function() {
    $('.reminders.time-input').val('08:00');
});

$('.reminder-12pm').click(function() {
    $('.reminders.time-input').val('12:00');
});

$('.reminder-6pm').click(function() {
    $('.reminders.time-input').val('18:00');
});

$('.reminder-10pm').click(function() {
    $('.reminders.time-input').val('22:00');
});

$('.reminders.time-input').val(moment().format('hh:mm'));

// calendar
$('#datetimepicker').datetimepicker({
     format: 'DD/MM/YYYY'
});

$('.reminder-today').click(function() { 
    $('.reminders.date-input').val(moment().format('DD/MM/YYYY'));

});

var tomorrow = moment().add(1, 'days');
$('.reminder-tomorrow').click(function() {  
    $('.reminders.date-input').val(tomorrow.format('DD/MM/YYYY'));

});

var nextWeek = moment().add(1, 'weeks');
$('.reminder-nextWeek').click(function() {
    $('.reminders.date-input').val(nextWeek.format('DD/MM/YYYY'));
});

var nextMonth = moment().add(1, 'months');
$('.reminder-nextMonth').click(function() {
    $('.reminders.date-input').val(nextMonth.format('DD/MM/YYYY'));
});

$('.reminders.date-input').val(moment().format('DD/MM/YYYY'));

// save changes
$('.reminder-save').click(function() {
    console.log("saved:");
    console.log($('.reminders.date-input').val());
    console.log($('.reminders.time-input').val());
    $('.modal-body').html("");
    $('.modal-body').append("<h4>Reminder added</h4>")
    $('.modal-footer').html("");
})

// view-email

var viewingModule;


function setClickHandlersOnSidebarItems() {
    $(".category-modules ul li").click(function () {
        
        var modCode = $(this).data("module");
        
        viewingModule = modCode;

        hideAnnouncements();
    });
    
    $(".category-folders ul li").click(function () {
         var folder = $(this).data("folder");
        
         viewingFolder = folder;    
        hideAnnouncements();
    });    
}


function hideAnnouncements() {
    var contentToShow = 
               $(".announcement").filter(function(val) {
                        return ($(this).hasClass(viewingModule));
                });
        contentToShow.show();
        
        var contentToHide = 
              $(".announcement").filter(function(val) {
                        return ($(this).hasClass(viewingModule) !== true);

                });
        contentToHide.hide();
}

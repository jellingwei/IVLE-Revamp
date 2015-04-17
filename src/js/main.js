var favouriteAnnouncements = [];

$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadAnnouncementsList();
    loadAnnouncementsHandler();
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
            '<span class="pre-announcements-favourite"></span>' +
            '<span class="middot">&middot;</span>' +
            '<span class="pre-announcements-reminder" data-toggle="modal" data-target="#myModal"></span>' +
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

        //console.log($(this));
        var index = $(this).data('announcement-id');

        $(".email-title-header").html("");
        $(".email-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
        $(".email-inside-content").html("");
        $(".email-inside-content").append(announcements[index].content);
    });
}

// initialise favourite buttons
function loadFavouriteButtons() {
    var favouriteButtons = $('.pre-announcements-favourite');
    favouriteButtons.click(function () {
        $(this).toggleClass('selected');
        var announcementId = $(this).parents('.pre-emails-wrapper').data('announcement-id');
        favouriteAnnouncements[announcementId] = $(this).hasClass('selected');
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
})

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
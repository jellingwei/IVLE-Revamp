// reminder buttons
// clock
$('.clockpicker').clockpicker({
	placement: 'bottom',
	align: 'left',
	donetext: 'Done',
	'default': moment().add(1, 'hours').format('hh:mm'),
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

$('.reminders.time-input').val(moment().add(1, 'hours').format('hh:mm'));

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

// setting reminders
// html string:
$('#reminderModal').on('show.bs.modal', function (e) {
	var $invoker = $(e.relatedTarget);
	var index = ($invoker).data('announcement-id');

	// clear fields
	$('.modal-title, .reminder-heading, .reminders.time-input, .reminders.date-input').html("");

	// write title
	$('.modal-title').append("<b>" + announcements[index].moduleCode + ":</b> ");
	$('.modal-title').append(announcements[index].title);
	// create form
	$('.modal-body .container-fluid').show();
	$('.modal-body .reminder-saved-msg').hide();
	$('.modal-footer').show();
	
	if (announcements[index].remindOn == null) {
		$('.reminder-heading').append("Add a reminder: <br><h4></h4>");
		$('.reminders.time-input').val(moment().add(1, 'hours').format('HH:mm'));
		$('.reminders.date-input').val(moment().format('DD/MM/YYYY'));

		$('.modal-footer .btn-danger').hide();
		$('.modal-footer .btn-default').html("Cancel");

	} else {
		$('.reminder-heading').append("Edit existing reminder: <br><h4></h4>");
		$('.reminders.time-input').val(moment(announcements[index].remindOn).format('HH:mm'));
		$('.reminders.date-input').val(moment(announcements[index].remindOn).format('DD/MM/YYYY'));

		$('.modal-footer .btn-danger').show();
		$('.modal-footer .btn-default').html("Discard Changes");
		$('.modal-footer .btn-primary').html("Save Changes");

		$('.reminder-delete').off('click').click(function() {
			console.log("delete");
			console.log(announcements[index]);
			clearTimeout(announcements[index].remindInstance);
			announcements[index].remindOn = null;
			announcements[index].remindInstance = null;
			// console.log(announcements[index]);
			($invoker).removeClass("selected");
		})

	}

	$('.reminder-save').off('click').click(function() {
		($invoker).addClass("selected");
		saveChanges(index);

		$('.modal-body .container-fluid').hide();
		$('.modal-body .reminder-saved-msg').show();
		$('.modal-footer').hide();

	})

});

function saveChanges(index) {
	var reminderTimeStr = moment($('.reminders.date-input').val(), 'DD/MM/YYYY').format('MMMM D, YYYY');
	reminderTimeStr += " " + $('.reminders.time-input').val() + ":00";

	var reminderTime = new Date(reminderTimeStr);
	announcements[index].remindOn = reminderTime;
	// console.log(announcements[index]);

	var announcementTitle = announcements[index].moduleCode + ": " + announcements[index].title;
	if (announcements[index].files != "") {
		announcementTitle += " Click here to download file.";
	}
	setAlarm(index, reminderTime, announcementTitle);

	// hide modal after 700ms
	setTimeout(function() {$('#reminderModal').modal('hide');}, 700);

}

// from Mozilla developers
function setAlarm(index, reminderTime, announcementTitle) {
	var timeDiff = reminderTime - new Date();
	clearTimeout(announcements[index].remindInstance);

	if (timeDiff > 0) {
		if (Notification.permission === "granted") {
			announcements[index].remindInstance = setTimeout(function(){ show(index, announcementTitle); }, timeDiff);

		}

		// Otherwise, we need to ask the user for permission
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				// If the user is okay, let's create a notification
				if (permission === "granted") {
					announcements[index].remindInstance = setTimeout(function(){ show(index, announcementTitle); }, timeDiff);

				}
			});
		} else {
			console.log("duno what happened.");
		}

	}
}

function show(index, announcementTitle) {
	var instance = new Notification(
		"ModFeed: Announcments", {
			body: announcementTitle,
			icon: "img/reminder-icon-original.png"
		}
	);

	instance.onclick = function () {
		// TODO: somehow not working
		location = location.href;
	};

	instance.onerror = function () {
		// Something to do
	};
	instance.onshow = function () {
		$('*[data-announcement-id="' + index + '"]').removeClass("selected");
	};
	instance.onclose = function () {
		// Something to do
	};

}
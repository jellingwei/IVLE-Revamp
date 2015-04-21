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
	$('.modal-body .reminder-added-msg').hide();
	$('.modal-footer').show();
	
	if (announcements[index].remindOn == null) {
		$('.reminder-heading').append("Add a reminder: <br><h4></h4>");
		$('.reminders.time-input').val(moment().add(1, 'hours').format('HH:mm'));
		$('.reminders.date-input').val(moment().format('DD/MM/YYYY'));

		$('.modal-footer .btn-default').html("Cancel");

	} else {
		$('.reminder-heading').append("Edit a reminder: <br><h4></h4>");
		$('.reminders.time-input').val(moment(announcements[index].remindOn).format('HH:mm'));
		$('.reminders.date-input').val(moment(announcements[index].remindOn).format('DD/MM/YYYY'));

		$('.modal-footer .btn-default').html("Discard Changes");

	}

	$('.reminder-save').click(function() {
		($invoker).addClass("selected");
		saveChanges(index);

	})

});

function saveChanges(id) {
	var reminderTimeStr = moment($('.reminders.date-input').val(), 'DD/MM/YYYY').format('MMMM D, YYYY');
	reminderTimeStr += " " + $('.reminders.time-input').val() + ":00";

	// console.log("reminderTimeStr: " + reminderTimeStr);
	var reminderTime = new Date(reminderTimeStr);
	// console.log("reminderTime: " + reminderTime);

	announcements[id].remindOn = reminderTime;
	console.log(announcements[id]);



	$('.modal-body .container-fluid').hide();
	$('.modal-body .reminder-added-msg').show();
	$('.modal-footer').hide();

	// hide modal after 1s
	setTimeout(function() {$('#reminderModal').modal('hide');}, 1000);

}
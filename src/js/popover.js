moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : '[Next Week]',
        sameElse : 'L'
    }
});

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
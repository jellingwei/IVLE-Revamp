// reminders
var date = new Date();

// clock
$('.clockpicker').clockpicker({
	placement: 'bottom',
    align: 'left',
    autoclose: true,
    'default': 'now'

});

var time = (date.getHours() + 1) + ':' + date.getMinutes();
$('.reminders.time-input').val(time)

// calendar
$('#datetimepicker1').datetimepicker({
	 format: 'DD/MM/YYYY'
});
var date = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
$('.reminders.date-input').val(date);
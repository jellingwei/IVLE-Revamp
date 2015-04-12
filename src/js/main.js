$(document).ready(function() {
	$(".pre-emails").slimscroll({
		height: 'auto'
	});
});

// menu
$(".close-menu").click( function() {
	// var toggleWidth = $(".menu").width() == 50 ? "15%" : "50px";
	// $(".menu").animate({ width: toggleWidth });
	
	if ($(".menu").width() == 50) {
		$(".menu").animate({ width: "15%" });
		$(".min-max .row").css("padding", "0 20px");
		$(".category-header").css("display", "block");
		$(".categories a").css("display", "inline");
	} else {
		$(".menu").animate({ width: "50px" });
		$(".min-max .row").css("padding", "0 15px");
		$(".category-header").css("display", "none");
		$(".categories a").css("display", "none");
	}

});

// pre-emails
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
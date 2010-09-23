$(document).ready(function(){
	if ($("input#fix_width_check").attr("checked") == true)
	{
		$("input#fix_width_check").attr({ checked : false });
	}
	$("input#column_amount").keyup( function() { setNumberOfColumns(); } );
	$("input#column_width").keyup( function() { setColumnWidth(); calculateWidth(); } );
	$("input#gutter_width").keyup( function() { setGutterWidth(); setOuterGutters(); calculateWidth(); } );	
	$("input#full_width").keyup( function() { setGutterWidth(); setOuterGutters(); calculateWidth(); } );
	$("input#fix_width_check").click( function() { $("input#full_width").toggle(); $("span#full_width_text").toggle(); $("input#column_width").toggle(); $("span#column_width_text").toggle();  } );
	setNumberOfColumns();
});
		

function setColumnWidth() {
	var width = parseInt($("input#column_width").attr("value"));
	$(".column").width(width);
}

function setGutterWidth() {
	var width = parseInt($("input#gutter_width").attr("value"));
	$(".gutter").width(width);
}

function setOuterGutters() {
	var width = parseInt($("input#gutter_width").attr("value"));
	$(".gutter_outer").width(width/2);
}

function calculateWidth() {
	
	if ($("input#fix_width_check").attr("checked") == true)
	{		
		var width_for_columns = parseInt($("input#full_width").attr("value")) - (parseInt($("input#gutter_width").attr("value"))) * (parseInt($("input#column_amount").attr("value")));	
		var column_width = width_for_columns / parseInt($("input#column_amount").attr("value"));		
		$("input#column_width").attr({ value : parseInt(column_width) });
		$("span#column_width_text").text(parseInt(column_width));
		$("span#full_width_text").text(parseInt($("input#full_width").attr("value")));
		
		var width = (parseInt($("input#column_width").attr("value")) * parseInt($("input#column_amount").attr("value"))) +  (parseInt($("input#gutter_width").attr("value")) * (parseInt($("input#column_amount").attr("value")) - 1));
		$("#content_width").text(width);
		$("#grid").width(parseInt($("input#full_width").attr("value")));
		
		setColumnWidth();
	}
	else
	{
		var width = (parseInt($("input#column_width").attr("value")) * parseInt($("input#column_amount").attr("value"))) +  (parseInt($("input#gutter_width").attr("value")) * (parseInt($("input#column_amount").attr("value")) - 1));
		$("#content_width").text(width);
		width = width + ((parseInt($("input#gutter_width").attr("value"))/2) * 2);
		$("input#full_width").attr({ value : width});
		$("span#full_width_text").text(width);
		$("span#column_width_text").text(parseInt($("input#column_width").attr("value")));
		$("#grid").width(width);	
	}
		$("#download_css a").attr({href : "/grids/grid.css?column_width=" + parseInt($("input#column_width").attr("value")) + "&column_amount=" + parseInt($("input#column_amount").attr("value")) + "&gutter_width=" + parseInt($("input#gutter_width").attr("value")) });
		$("#preview_grid a").attr({href : "/grids/grid/?column_width=" + parseInt($("input#column_width").attr("value")) + "&column_amount=" + parseInt($("input#column_amount").attr("value")) + "&gutter_width=" + parseInt($("input#gutter_width").attr("value")) });
}

function setNumberOfColumns() {
	$("#grid").empty();	
	$("#grid").append("<div class='gutter_outer'>&nbsp;</div>");
	var numberOfColumns = parseInt($("input#column_amount").attr("value"));
	for(var i=0; i<numberOfColumns; i=i+1) {
		$("#grid").append("<div class='column'>&nbsp;</div>");
		if(i < numberOfColumns-1) {
			$("#grid").append("<div class='gutter'>&nbsp;</div>");
		}
	}
	$("#grid").append("<div class='gutter_outer'>&nbsp;</div>");
	setColumnWidth();
	setGutterWidth();
	setOuterGutters();
	calculateWidth();
}
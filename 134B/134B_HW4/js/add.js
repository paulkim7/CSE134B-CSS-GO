/**
 * validateCustomDays()
 * Description: Checks to make sure the input type is a numerical
 *              value above 0 and below max integer size
 *              to prevent int overflow.
 *
 * Inputs:
 *      input -- User input for day input
 * Output: Returns true on success or false if invalid input.
 **/
function validateCustomDays(input) {
	if(typeof input != integer) {
		return false;
	} else if(input > Number.MAX_VALUE) {
		return false;
	} else {
		return true;
	}
}


// JQuery, create listeners when the document is ready
$(document).ready(function() {
	// Handle checkbox
	$("#freq1Btn").click(function() {
		$("#freq1Btn").toggle();
		$("#freq2Btn").prop("checked", false);
		$("#freq3Btn").prop("checked", false);

		// If enabling, make text input readonly
		if(document.getElementById('freq1Btn').checked)  {
			$("#others").prop("readonly",true);
		} else {
			document.getElementById("others").readonly = false;	
			$("#others").prop("readonly",false);

		}
	});

	$("#freq2Btn").click(function() {
		$("#freq2Btn").toggle();
		$("#freq1Btn").prop("checked", false);
		$("#freq3Btn").prop("checked", false);

		// If enabling, make text input readonly
		if(document.getElementById('freq2Btn').checked)  {
			$("#others").prop("readonly",true);
		} else {
			document.getElementById("others").readonly = false;	
			$("#others").prop("readonly",false);

		}
	});

	$("#freq3Btn").click(function() {	
		$("#freq3Btn").toggle();
		$("#freq1Btn").prop("checked", false);
		$("#freq2Btn").prop("checked", false);

		// If enabling, make text input readonly
		if(document.getElementById('freq3Btn').checked)  {
			$("#others").prop("readonly",true);
		} else {
			document.getElementById("others").readonly = false;	
			$("#others").prop("readonly",false);

		}
	});
});

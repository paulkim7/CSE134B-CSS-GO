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

/** 
 * readURL()
 * Description: Reads an image and displays it as a preview.
 *              Image will be uploaded to parse Database later.
 *
 * Inputs: 
 *       input -- The File input DOM element
 * Return Val: N/A.
 **/
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#icon4').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// JQuery, create listeners when the document is ready
$(document).ready(function() {
    // Handle checkbox for daily frequency, allow only one to be selected at a time,
    // or, only the custom input
    $("#freq1Btn").click(function() {
        $("#freq1Btn").toggle();
        $("#freq2Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
    $("#freq2Btn").click(function() {
        $("#freq2Btn").toggle();
        $("#freq1Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
    $("#freq3Btn").click(function() {   
        $("#freq3Btn").toggle();
        $("#freq1Btn").prop("checked", false);
        $("#freq2Btn").prop("checked", false);
    });
    $("#others").click(function() {
        console.log("other click");
        $("#freq1Btn").prop("checked", false);
        $("#freq2Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
});
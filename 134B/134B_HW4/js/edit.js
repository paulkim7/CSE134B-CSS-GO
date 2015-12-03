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
        selectImage('icon4', 'img4');
    }
}


/**
 * updateParseHabit()
 * Description: Updates Parse Habit Object, then saves to Parse.
 * 
 * Parameters:
 *     habit - The Parse habit name as a String object
 * Return Value: Returns a Promise to resolve if saved succesfully,
 *               rejects on failure.
 **/
function updateParseHabit(habit) {
    return new Promise(function(resolve,reject){
        var user = Parse.User.current();
        var habitQuery = new Parse.query(user);
        habitQuery.equalTo()
        habitQuery.find().then(function(habitList){
            if(habitList!==1)
                reject("Error retrieving habit");

            var habit = habitList[0];
            // You have one habit now, do stuff

            // Set values
            var titleValue = document.getElementById("title").value;
            var habitValue = document.getElementById("habits").value;
            var iconImgNum = document.getElementById("habits").selectedIndex;

            var dayArray = document.getElementsByName("date[]");
            var dayLength = dayArray.length;
            var dayData = Array();
            for (k = 0; k < dayLength; k++)
            {
                dayData[k] = dayArray[k].checked;
            }
            var dayString = JSON.stringify(dayData);

            var freqArray = document.getElementsByName("day[]");
            var freqLength = freqArray.length;
            var freqData = Array();
            var dailyFreq = 0;
            for (i = 0; i < freqLength; i++)
            {
                freqData[i] = freqArray[i].checked;

                if( freqArray[i].checked === true ) {
                    dailyFreq = i + 1;
                }
            }

            if(dailyFreq===0)
                dailyFreq = document.getElementById("others").value;

            // change individualHabit.dailyFreq to dailyFreq if there's a problem
            if( individualHabit.dailyFreq != habitBeforeEdit.dailyFreq ) {
                habit.set("progVal", 0);
                habit.set("streak", 0);
                habit.set("record", 0);
            }
            var freqString = JSON.stringify(freqData);
            var iconUploader = document.getElementById("iconUploaderEdit");
            if(iconImgNum!==4 || iconUploader.files.length>0 ) // Do not change value if no custom icon selected
                habit.set("icon", habitValue);                 // and user icon was selected before
            habit.set("title", titleValue);
            habit.set("iconNum", iconImgNum);  // Change later to reference file directly
            habit.set("day", dayString);
            habit.set("freq", freqString);
            habit.set("dailyFreq", numDailyFreak);
            habit.save().then(function(){
                resolve();
            },function(err){
                reject(err);
            });
        });
    });
    //location.href = 'list.html'; Do this on sucess maybe
}

function updateHabit() {
    var removedHabit = localStorage.getItem("habitList");
    var arrayHabit = JSON.parse(removedHabit);

    var j = 0;

    // If I have the index number in which it's in, it's easier (figure out more efficient way)
    // Inefficient way
    while (j < arrayHabit.length) {

        var individualHabit = JSON.parse(arrayHabit[j]);
        var updatedHabitID = localStorage.getItem("habitEditID");
        var habitBeforeEdit = JSON.parse(localStorage.getItem("habitBeforeChanges"));

        if (updatedHabitID === individualHabit.id) {
            
            var titleValue = document.getElementById("title").value;
            var habitValue = document.getElementById("habits").value;
            var iconImgNum = document.getElementById("habits").selectedIndex;

            var dayArray = document.getElementsByName("date[]");
            var dayLength = dayArray.length;
            var dayData = Array();
            for (k = 0; k < dayLength; k++)
            {
                dayData[k] = dayArray[k].checked;
            }
            var dayString = JSON.stringify(dayData);

            var freqArray = document.getElementsByName("day[]");
            var freqLength = freqArray.length;
            var freqData = Array();
            var dailyFreq = 0;
            for (i = 0; i < freqLength; i++)
            {
                freqData[i] = freqArray[i].checked;

                if( freqArray[i].checked === true ) {
                    dailyFreq = i + 1;
                }
            }

            if(dailyFreq===0)
                individualHabit.dailyFreq = document.getElementById("others").value;
            else
                individualHabit.dailyFreq = dailyFreq;


            // change individualHabit.dailyFreq to dailyFreq if there's a problem
            if( individualHabit.dailyFreq != habitBeforeEdit.dailyFreq ) {
                individualHabit.progVal = 0;
                individualHabit.streak = 0;
                individualHabit.record = 0;
            }
            var freqString = JSON.stringify(freqData);

            individualHabit.iconNum = iconImgNum;
            individualHabit.title = titleValue;
            var iconUploader = document.getElementById("iconUploaderEdit");
            if(iconImgNum!==4 || iconUploader.files.length>0 ) // Do not change value if no custom icon selected
                individualHabit.icon = habitValue;           // and user icon was selected before
            individualHabit.day = dayString;

            individualHabit.freq = freqString;
            arrayHabit[j] = JSON.stringify(individualHabit);

            break;
        }

        j++;

    }
    localStorage.setItem("habitList", JSON.stringify(arrayHabit));

  //  location.href = 'list.html';
}

// recurring code, TODO remove and merge app.js calls with this file
function uploadUserIcon(fileInput) {
    return new Promise(function(resolve, reject){
        var file = fileInput.files[0];
    
        var serverUrl = 'https://api.parse.com/1/files/' + file.name;

        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("X-Parse-Application-Id", 'd2claNl95q01NDPLvJ5c6wss7ePAqKGn9l048Zqb');
                request.setRequestHeader("X-Parse-REST-API-Key", 'F74LnjmLlP0yCRE9wUEyoo0H3T23UWrf9UqZ5eAR');
                request.setRequestHeader("Content-Type", file.type);
            },
            url: serverUrl,
            data: file,
            processData: false,
            contentType: false,
            success: function(data) {
                alert("File available at: " + data.url);
                document.getElementById("img4").value = data.url;
                resolve(0);
            },
            error: function(data) {
                var obj = jQuery.parseJSON(data);
                reject(obj.error);
            }
        }); 
    });
}


function editHabit(element) {
	var child = element.parentNode.parentNode;

	var habitToEdit = localStorage.getItem("habitList");
	var arrayHabit = JSON.parse(habitToEdit);

	var i = 0;

	while( i < arrayHabit.length ) {
                    
        var individualHabit = JSON.parse(arrayHabit[i]);

        if(child.id == ("habit-" + individualHabit.id) ) {

            localStorage.setItem("editHabit", JSON.stringify(individualHabit));

            break;
        }

        i++;
    }
}

function validateInputs() {
    var titleValue = document.getElementById("title").value;
    var habitValue = document.getElementById("habits").value;
    
    var dayArray = document.getElementsByName("date[]");
    var dailyFreqArray = document.getElementsByName("day[]");
    var otherValue = document.getElementById("others").value;

    var numDaysChecked = 0;
    var numFreqChecked = 0;

    var inputsValidated = true;
    var inputMsg = "";

    if( titleValue === "" ) {
        inputMsg = "- Please enter a habit title.\n";
        inputsValidated = false;
    }
    
    if( habitValue === "unselected" ) {
        inputMsg = inputMsg + "- Please select an icon image.\n"
        inputsValidated = false;
    }
    
    // Checks whether days are selected for the habit
    for( i = 0; i < dayArray.length; i++) {
        if( dayArray[i].checked === true ) {
            numDaysChecked++;
        }   
    }

    if( numDaysChecked === 0 ) {
        inputMsg = inputMsg + "- Please select at least ONE day.\n";
        inputsValidated = false;
    }

    // Checks whether daily frequency is checked
    for( j = 0; j < dailyFreqArray.length; j++ ) {
        if( dailyFreqArray[j].checked === true ) {
            numFreqChecked++;
            break;
        }
    }

    // If both daily frequency NOT checked and other value doesn't exist
    if( numFreqChecked === 0 && otherValue === "" ) {
        inputMsg = inputMsg + "- Please specify daily frequency of habit.\n";
        inputsValidated = false;
    }

    if( inputsValidated === true ) {
        checkDuplicateTitle();
    }
    else {
        alert(inputMsg);
    }

}

function checkDuplicateTitle() {
    var titleValue = document.getElementById("title").value;
    
    var habitArray = JSON.parse(localStorage.getItem("habitList"));
    var updatedHabitID = localStorage.getItem("habitEditID"); // ID of the habit you're editing

    var j = 0

    while( j < habitArray.length ) {
                    
        var individualHabit = JSON.parse(habitArray[j]);

        if( titleValue === individualHabit.title ) {
            if( individualHabit.id != updatedHabitID ) {
                alert("The following habit title already exists. Please edit the existing habit.");
                return;
            }
        }

        j++;

    }
    if(document.getElementById('habits').selectedIndex===4) {
        uploadUserIcon(document.getElementById("iconUploaderEdit")).then(function() {
        updateHabit();
        }).catch(function(err){
            alert(err);
        }); 
    }
    else {
        updateHabit();
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
        $("#freq1Btn").prop("checked", false);
        $("#freq2Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
});
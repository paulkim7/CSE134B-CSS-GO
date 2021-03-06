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
 * clickEditHabit()
 * Description: Edit habit function for Parse
 *
 * Return Value: Returns a promise to resolve.
 *               Rejects on error.
 **/
function clickEditHabit() {
    getUserHabits().then(function (habitList) {
        var habitId = localStorage.getItem("habitEditID");
        var habitIndex;
        for (i = 0; i < habitList.length; i++) {
            if (habitList[i].id === habitId)
                habitIndex = i;      // Set current index of the habit we want to this
        }

        var habit = habitList[habitIndex];

        var tuple = isValidEditHabit(habitList, habitIndex);
        if (!tuple[0]) {
            alert(tuple[1]);
            return;
        }

        updateParseHabit(habit).then(function () {
            alert("Edit success!");
            location.href = 'list.html';
            return;
        }).catch(function (err) {
            alert(err);
        });
    });
}

/** 
 * isValidHabitInput()
 * Description: Takes the add habit inputs and makes sure they are valid.
 *
 * Inputs:
 *   habitList -- List of Parse Habit objects
 *   habitInd  -- The index of the current habit being edited
 * Return Value: Returns a tuple containing true if valid, false if invalid, and a err msg.
 **/
function isValidEditHabit(habitList, habitInd) {
    var titleValue = document.getElementById("title").value;
    var habitValue = document.getElementById("habits").value;

    var dayArray = document.getElementsByName("date[]");
    var dailyFreqArray = document.getElementsByName("day[]");
    var otherValue = document.getElementById("others").value;

    var numDaysChecked = 0;
    var numFreqChecked = 0;

    var inputsValidated = true;
    var inputMsg = "";

    if (titleValue === "") {
        inputMsg = "- Please enter a habit title.\n";
        inputsValidated = false;
    }

    if (titleValue.length >= 30) {
        inputMsg = inputMsg + "- Habit title must be under 30 characters.";
        inputsValidated = false
    }

    if (habitValue === "unselected") {
        inputMsg = inputMsg + "- Please select an icon image.\n"
        inputsValidated = false;
    }

    // Checks whether days are selected for the habit
    for (i = 0; i < dayArray.length; i++) {
        if (dayArray[i].checked === true) {
            numDaysChecked++;
        }
    }

    if (numDaysChecked === 0) {
        inputMsg = inputMsg + "- Please select at least ONE day.\n";
        inputsValidated = false;
    }

    // Checks whether daily frequency is checked
    for (j = 0; j < dailyFreqArray.length; j++) {
        if (dailyFreqArray[j].checked === true) {
            numFreqChecked++;
            break;
        }
    }

    // If both daily frequency NOT checked and other value doesn't exist
    if (numFreqChecked === 0 && otherValue === "") {
        inputMsg = inputMsg + "- Please specify daily frequency of habit.\n";
        inputsValidated = false;
    }

        // Make sure input value for OTHER is > 3
    if((numFreqChecked === 0) && (otherValue < 4)) {
        inputMsg = inputMsg + "- Please enter a value greater than 3 for other.\n";
        inputsValidated = false;
    }

    // Check for dup title
    for (i = 0; i < habitList.length; i++) {
        if (habitList[i].get("title") === titleValue && i !== habitInd) {
            inputMsg = inputMsg + "- Habit title already exists, please change.";
            inputsValidated = false;
        }

    }
    var tuple = [inputsValidated, inputMsg];
    return tuple;
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
    return new Promise(function (resolve, reject) {
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

            if (freqArray[i].checked === true) {
                dailyFreq = i + 1;
            }
        }

        if (dailyFreq === 0)
            dailyFreq = Number(document.getElementById("others").value);

        var iconUploader = document.getElementById("iconUploaderEdit");

        var dayArrayResetFlag = false;
        var oldArray = JSON.parse(habit.get("day"));
        for(i=0;i<oldArray.length;i++){
            if(oldArray[i]!==dayArray[i]) {
                dayArrayResetFlag = true;
            }
        }

        if (document.getElementById('habits').selectedIndex === 4 && iconUploader.files.length > 0) {
            uploadUserIcon(document.getElementById("iconUploaderEdit")).then(function () {
                // change individualHabit.dailyFreq to dailyFreq if there's a problem
                if (habit.get("dailyFreq") !== dailyFreq || dayArrayResetFlag) {
                    habit.set("progVal", 0);
                    habit.set("streak", 0);
                    habit.set("record", 0);
                }
                habitValue = document.getElementById("img4").value;
                if (iconImgNum !== 4 || iconUploader.files.length > 0) // Do not change value if no custom icon selected
                    habit.set("iconLoc", habitValue);                 // and user icon was selected before
                habit.set("title", titleValue);
                habit.set("iconNum", iconImgNum);  // Change later to reference file directly
                habit.set("day", dayString);
                habit.set("freq", freqData);
                habit.set("dailyFreq", dailyFreq);

                // Now save changes to parse
                habit.save().then(function (habitParseObj) {
                    resolve();
                }, function (err) {
                    reject(err['message']);
                });
            });
        } else {
            // change individualHabit.dailyFreq to dailyFreq if there's a problem
            if (habit.get("dailyFreq") !== dailyFreq || dayArrayResetFlag) {
                habit.set("progVal", 0);
                habit.set("streak", 0);
                habit.set("record", 0);
            }
            var iconUploader = document.getElementById("iconUploaderEdit");
            if (iconImgNum !== 4 || iconUploader.files.length > 0) // Do not change value if no custom icon selected
                habit.set("iconLoc", habitValue);                 // and user icon was selected before
            habit.set("title", titleValue);
            habit.set("iconNum", iconImgNum);  // Change later to reference file directly
            habit.set("day", dayString);
            habit.set("freq", freqData);
            habit.set("dailyFreq", dailyFreq);

            // Now save changes to parse
            habit.save().then(function (habitParseObj) {
                resolve();
            }, function (err) {
                reject(err['message']);
            });
        }
    });
}

// recurring code, TODO remove and merge app.js calls with this file
function uploadUserIcon(fileInput) {
    return new Promise(function (resolve, reject) {
        var file = fileInput.files[0];

        var serverUrl = 'https://api.parse.com/1/files/' + file.name;

        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("X-Parse-Application-Id", 'd2claNl95q01NDPLvJ5c6wss7ePAqKGn9l048Zqb');
                request.setRequestHeader("X-Parse-REST-API-Key", 'F74LnjmLlP0yCRE9wUEyoo0H3T23UWrf9UqZ5eAR');
                request.setRequestHeader("Content-Type", file.type);
            },
            url: serverUrl,
            data: file,
            processData: false,
            contentType: false,
            success: function (data) {
                alert("File available at: " + data.url);
                document.getElementById("img4").value = data.url;
                resolve(0);
            },
            error: function (data) {
                var obj = jQuery.parseJSON(data);
                reject(obj.error);
            }
        });
    });
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

    if (titleValue === "") {
        inputMsg = "- Please enter a habit title.\n";
        inputsValidated = false;
    }

    if (habitValue === "unselected") {
        inputMsg = inputMsg + "- Please select an icon image.\n"
        inputsValidated = false;
    }

    // Checks whether days are selected for the habit
    for (i = 0; i < dayArray.length; i++) {
        if (dayArray[i].checked === true) {
            numDaysChecked++;
        }
    }

    if (numDaysChecked === 0) {
        inputMsg = inputMsg + "- Please select at least ONE day.\n";
        inputsValidated = false;
    }

    // Checks whether daily frequency is checked
    for (j = 0; j < dailyFreqArray.length; j++) {
        if (dailyFreqArray[j].checked === true) {
            numFreqChecked++;
            break;
        }
    }

    // If both daily frequency NOT checked and other value doesn't exist
    if (numFreqChecked === 0 && otherValue === "") {
        inputMsg = inputMsg + "- Please specify daily frequency of habit.\n";
        inputsValidated = false;
    }

    if (inputsValidated === true) {
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

    while (j < habitArray.length) {

        var individualHabit = JSON.parse(habitArray[j]);

        if (titleValue === individualHabit.title) {
            if (individualHabit.id != updatedHabitID) {
                alert("The following habit title already exists. Please edit the existing habit.");
                return;
            }
        }

        j++;

    }
    if (document.getElementById('habits').selectedIndex === 4) {
        uploadUserIcon(document.getElementById("iconUploaderEdit")).then(function () {
            updateHabit();
        }).catch(function (err) {
            alert(err);
        });
    }
    else {
        updateHabit(titleValue);
    }
}


// JQuery, create listeners when the document is ready
$(document).ready(function () {
    // Handle checkbox for daily frequency, allow only one to be selected at a time,
    // or, only the custom input
    $("#freq1Btn").click(function () {
        $("#freq1Btn").toggle();
        $("#freq2Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
    $("#freq2Btn").click(function () {
        $("#freq2Btn").toggle();
        $("#freq1Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
    $("#freq3Btn").click(function () {
        $("#freq3Btn").toggle();
        $("#freq1Btn").prop("checked", false);
        $("#freq2Btn").prop("checked", false);
    });
    $("#others").click(function () {
        $("#freq1Btn").prop("checked", false);
        $("#freq2Btn").prop("checked", false);
        $("#freq3Btn").prop("checked", false);
    });
});
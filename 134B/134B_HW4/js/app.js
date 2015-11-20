
// Initialize dependency (Parse backend)
Parse.initialize("d2claNl95q01NDPLvJ5c6wss7ePAqKGn9l048Zqb", "N344LtQrb8LdEIKU1M4dlsMSUZiXf1fEtSY16Of7");

/**
 * authenticate()
 * Description: Look for email in the database and compare password input with what is
 *              stored on the database.
 * Inputs:
 *    email - String value of email input
 *    pass  - String value of password input to be compared
 * Return Val: Returns the Parse object if the username is found and
 *             the password matches, returns null if nah
 **/
function authenticate(email,pass) {
    return new Promise(function(resolve,reject) {
        var UserClass = Parse.Object.extend('UserAccount');
        var userQuery = new Parse.Query(UserClass);
        userQuery.equalTo("email", email);
        userQuery.find().then(function(result){
            if(result === undefined || result.size === 0 || result.size > 1 ) {
                console.log("resolve null");
                resolve(null);
            }
            else {
                console.log("returning result");
                resolve(result[0]);
            }
        },function(err){reject(err);});
    });
}


//*****************************
//*
//*  Parse Functions go here
//*
//*****************************
function createUser(email, pass) {
    return new Promise(function(resolve,reject) {
        var UserClass = Parse.Object.extend('UserAccount');
        var newUser = new UserClass();

        newUser.set("email",email);
        newUser.set("password",pass);
        newUser.save().then(function(newUser){
            resolve(newUser);    // Return new user object
        });
    });
}

/**
 * validateImageUpload()
 * Description: Checks a filename and determines whether it is an
 *              image or not by comparing the filename extension with
 *              an array of acceptable image formats.
 * 
 * Inputs:
 *    filename -- The filename to be validated
 * Return Value: Returns true if the filename is valid for an image file, false if not
 **/
function validateImageUpload(filename) {
    // Check for a file-extension, return false if none
    if(filename.lastIndexOf(".")===(-1)) {
        return false;
    }

    var extension = filename.substring(filename.lastIndexOf(".")+1,filename.length);
    var extList = ['jpg','jpeg','png','gif'];         // Array of all common image formats

    for(ext of extList) {
        if(extension === ext) {
            return true;
        }
    }

    return false;
}

function uploadUserIconV2(fileInput, savename) {
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


function uploadUserIcon(fileInput, savename) {

    var fileUploadControl = fileInput;
    if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        var name = Math.random()*1000;     // Do this for now since we aren't getting unique habit ID's from parse

        // TODO, change this when we refactor code for Parse, should support HTML5 promises
        // instead of relying on setting the doc value directly
        document.getElementById("img4").value = name;


        var parseFile = new Parse.File(name, file);

        //put this inside if {
        parseFile.save().then(function() {
        // The file has been saved to Parse.
            alert("File successfully saved to parse");
            alert(name);
        }, function(error) {
        // The file either could not be read, or could not be saved to Parse.
            return null;
        });

        // Upload file to parse, do later since we have no parse DB for habits yet
        // prod.set("picture", parseFile);
        // prod.save();
        return name;
   }
   return null; // Return this if false if statement
}



// Sample code for using readURL
    // <form id="form1" runat="server">
    //     <input type='file' id="imgInp" />
    //     <img id="userIco" src="#" alt="your image" />
    // </form>





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
        if(!isDuplicateHabitTitle(titleValue)) {
            // Filename parameter currently unused
            if(document.getElementById('habits').selectedIndex===4)
                uploadUserIconV2(document.getElementById("iconUploaderAdd"),"notAny").then(function() {
                createHabit();
                }).catch(function(err){
                    alert(err);
                }); 
            else
                createHabit();
        }
        else 
            return;
    }
    else {
        alert(inputMsg);
    }

}

/**
 * isDuplicateHabitTitle() 
 * Description: Check if the habit title already exists.
 * 
 * Inputs:
 *   titleValue -- The title value to be checked.
 * Return Val: Returns true if a habit with the same name already exists.
 *             False if titleValue does not exist as a habit title already.
 **/
function isDuplicateHabitTitle(titleValue) {
    if( localStorage.getItem("habitList") == null ) {
        return false;
    }
    
    var habitArray = JSON.parse(localStorage.getItem("habitList"));

    var j = 0

    while( j < habitArray.length ) {
                    
        var individualHabit = JSON.parse(habitArray[j]);

        if( titleValue === individualHabit.title ) {
            alert("The following habit title already exists. Please edit the existing habit.");
            return true;
        }

        j++;

    }

    return false;
}

function createHabit()
{
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
    var numDailyFreq = 0;
    for (i = 0; i < freqLength; i++)
    {
        freqData[i] = freqArray[i].checked;

        if(freqArray[i].checked === true) {
            numDailyFreq = i + 1;
        }
    }
    var freqString = JSON.stringify(freqData);
    var otherValue = document.getElementById("others").value;

    console.log(otherValue);

    var d = new Date();
    var n = d.getTime();
    var idStr = n.toString();
    var id = titleValue.substring(0,4)+idStr.substring(idStr.length - 3);
    var idClean = id.replace(/ /g,'');
    var progValue = 0;

    var habitObject = {id: idClean, title: titleValue, icon: habitValue, iconNum: iconImgNum, day: dayString, freq: freqString, progVal: progValue, dailyFreq: numDailyFreq, freqOther: otherValue, streak: 0, record: 0};
    var habit = JSON.stringify(habitObject);
    var habitList = localStorage.getItem("habitList");
    
    if(!habitList)
    {
        var newHabitList = Array();
        newHabitList.push(habit);
        localStorage.setItem("habitList", JSON.stringify(newHabitList));
        //location.href='list.html';
    }
    else
    {
        var parList = JSON.parse(habitList);
        parList.push(habit);
        localStorage.setItem("habitList", JSON.stringify(parList));
        //location.href='list.html';
    }
    console.log(JSON.parse(localStorage.getItem("habitList")));
    //var formData = new FormData(document.querySelector('form'));
    //console.log(localStorage.getItem("habit"));
    location.href='list.html'; //TODO put back
}



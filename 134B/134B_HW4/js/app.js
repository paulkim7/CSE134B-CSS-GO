
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


// <form id="fileupload" name="fileupload" enctype="multipart/form-data" method="post">
//   <fieldset>
//     <input type="file" name="fileselect" id="fileselect"></input>
//     <input id="uploadbutton" type="button" value="Upload to Parse"/>
//   </fieldset>
// </form>


/**
 * uploadImage() 
 * Description: Take form data and use it to upload an image to parse using a post method.
 *              Image upload is stored at data.url.
 * TODO: Check for recurring filenames or something
 * Inputs: None, directly accessed from DOM
 * Outputs: Returns file URL on success, throw error on failure
 **/
function uploadImage(imageFormData) {
    var file;
    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function() {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", 'MY-APP-ID');
          request.setRequestHeader("X-Parse-REST-API-Key", 'MY-REST-API-ID');
          request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: file,
        processData: false,
        contentType: false,
        success: function(data) {
          alert("File available at: " + data.url);
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
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

    if( localStorage.getItem("habitList") == null ) {
        createHabit(); // create first habit
        return;
    }
    
    var habitArray = JSON.parse(localStorage.getItem("habitList"));

    var j = 0

    console.log(titleValue);
    while( j < habitArray.length ) {
                    
        var individualHabit = JSON.parse(habitArray[j]);

        if( titleValue === individualHabit.title ) {
            alert("The following habit title already exists. Please edit the existing habit.");
            return;
        }

        j++;

    }

    createHabit(); // create habit after confirming unique title

}

function createHabit()
{
    var titleValue = document.getElementById("title").value;
    var habitValue = document.getElementById("habits").value;
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
    for (i = 0; i < freqLength; i++)
    {
        freqData[i] = freqArray[i].checked;
    }
    var freqString = JSON.stringify(freqData);
    var otherValue = document.getElementById("others").value;

    console.log(otherValue);

    var d = new Date();
    var n = d.getTime();
    var idStr = n.toString();
    var id = titleValue.substring(0,4)+idStr.substring(idStr.length - 3);
    var idClean = id.replace(/ /g,'');
    var habitObject = {id: idClean, title: titleValue, icon: habitValue, day: dayString, freq: freqString, freqOther: otherValue, streak: 0, record: 0};
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
    location.href='list.html';
}



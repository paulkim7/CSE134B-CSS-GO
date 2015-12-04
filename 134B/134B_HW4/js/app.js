
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
function login(email,pass) {
    return new Promise(function(resolve,reject) {
        Parse.User.logIn(email, pass, {
              success: function(user) {
                // Do stuff after successful login.
                resolve(user);
              },
              error: function(user, error) {
                // The login failed. Check error to see why.
                reject(error);
              }
        });
    });
}

/** 
 * checkForCacheUser() 
 * Description: Check if a user is cached.
 *              If found, show the users info immediately.
 *              If not, then show the user login page.
 **/
function checkForCacheUser() {
    var currentUser = Parse.User.current();
    if (currentUser) {
        // do stuff with the user
        return true;
    } else {
        // show the signup or login page
        return false;
    }
}

/**
 * Removes current user
 * Return Value: Returns false on failure (current user val not changed to null)
 *               or true on success.
 **/
function logOut() {
    Parse.User.logOut().then(function(){
        var user = Parse.User.current();
        if(user === null)
        {
            location.href = 'login.html';
            return true;
        }
        else
        {
            return false;
        }
    });

}

//*****************************
//*
//*  Parse Functions go here
//*
//*****************************
function checkForLogin() {
    if (!checkForCacheUser()) {
        // do stuff with the user
        alert("You must log in first.");
        location.href='login.html';
    }
    else
    {
        alert(Parse.User.current().get("username"));
    }
}
/**
 * createUser()
 * Description: Create new Parse user using the
 *              Parse specific User class
 **/
function createUser(email, pass) {
    return new Promise(function(resolve,reject) {
        var newUser = new Parse.User();
        if(!isValidEmail(email)){
            alert("Is invalid email");
            reject("invalid email");
            return;
        }

        // Check for one cap letter, one numerical character, and a pass length of 5<=x<=15
        if(!isValidPassword(pass)) {
            alert("Password must contain one capital letter, one number, and must be between 5 and 15 characters");
            reject("invalid pass");
            return;
        }
        console.log(Parse.User.current());

        console.log(email);
        console.log(pass);
        newUser.set("username",email);    // Username is email in this app
        newUser.set("password",pass);
        newUser.signUp().then(function(newUser){
            resolve();    // Return new user object
            alert("success save");
            location.href='list.html';
        },function(err){
            reject(err);
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
                // alert("File available at: " + data.url);
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

/** 
 * isValidHabitInput()
 * Description: Takes the add habit inputs and makes sure they are valid.
 *
 * Return Value: Returns a tuple containing true if valid, false if invalid, and a err msg.
 **/
function isValidHabitInput(habitList) {
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

    // Check for duplicate title in habitList
    for(i=0;i<habitList.length;i++) {
        if(habitList[i].get("title")===titleValue) {
            inputMsg = inputMsg + "- Habit title already exists, please change.\n";
            inputsValidated = false;
            break;
        }
    }
    var tuple = [inputsValidated,inputMsg];
    return tuple; 
}

// function validateInputs() {
//     var titleValue = document.getElementById("title").value;
//     var habitValue = document.getElementById("habits").value;
    
//     var dayArray = document.getElementsByName("date[]");
//     var dailyFreqArray = document.getElementsByName("day[]");
//     var otherValue = document.getElementById("others").value;

//     var numDaysChecked = 0;
//     var numFreqChecked = 0;

//     var inputsValidated = true;
//     var inputMsg = "";

//     if( titleValue === "" ) {
//         inputMsg = "- Please enter a habit title.\n";
//         inputsValidated = false;
//     }
    
//     if( habitValue === "unselected" ) {
//         inputMsg = inputMsg + "- Please select an icon image.\n"
//         inputsValidated = false;
//     }
    
//     // Checks whether days are selected for the habit
//     for( i = 0; i < dayArray.length; i++) {
//         if( dayArray[i].checked === true ) {
//             numDaysChecked++;
//         }   
//     }

//     if( numDaysChecked === 0 ) {
//         inputMsg = inputMsg + "- Please select at least ONE day.\n";
//         inputsValidated = false;
//     }

//     // Checks whether daily frequency is checked
//     for( j = 0; j < dailyFreqArray.length; j++ ) {
//         if( dailyFreqArray[j].checked === true ) {
//             numFreqChecked++;
//             break;
//         }
//     }

//     // If both daily frequency NOT checked and other value doesn't exist
//     if( numFreqChecked === 0 && otherValue === "" ) {
//         inputMsg = inputMsg + "- Please specify daily frequency of habit.\n";
//         inputsValidated = false;
//     }

//     if( inputsValidated === true ) {
//         if(!isDuplicateHabitTitle(titleValue)) {
//             // Filename parameter currently unused
//             if(document.getElementById('habits').selectedIndex===4)
//                 uploadUserIcon(document.getElementById("iconUploaderAdd")).then(function() {
//                 createHabit();
//                 }).catch(function(err){
//                     alert(err);
//                 }); 
//             else
//                 createHabit();
//         }
//         else 
//             return;
//     }
//     else {
//         alert(inputMsg);
//     }

// }


/**
 * clickAddHabit()
 * Description: Button handler to handle everything it leads to more concise code
 **/
function clickAddHabit() {
    getUserHabits().then(function(habitList){
        var tuple = isValidHabitInput(habitList);
        if(!tuple[0]) {
            alert(tuple[1]);
            return;
        }

        createParseHabit().then(function(){
            alert("Create habit success!");
            location.href='list.html';
            return;
        }).catch(function(err){
            alert(err);
        });
    });
}

/** 
 * createParseHabit() 
 * Description: Creates Parse Habit object by pulling values
 *              from the DOM and creating a new Object.
 *              also creates a relationship with the userId
 *              when done.
 * Inputs: N/A
 * Return Value: Returns a Promise to return a resolve on success,
 *               or rejects Promise on failure.
 **/
function createParseHabit() 
{
    return new Promise(function(resolve,reject){
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
        
        if(numDailyFreq===0)
            var numDailyFreq = Number(document.getElementById("others").value);

        var d = new Date();
        var n = d.getTime();
        var idStr = n.toString();
        var id = titleValue.substring(0,4)+idStr.substring(idStr.length - 3);
        var idClean = id.replace(/ /g,'');
        var progValue = 0;

        // Create new habit and add to current user, then resolve
        var HabitClass =  Parse.Object.extend("Habit");
        var newHabit = new HabitClass();
        //newHabit.set("id",idClean);
        newHabit.set("title", titleValue);
        newHabit.set("iconLoc", habitValue);
        newHabit.set("iconNum", iconImgNum);  // Change later to reference file directly
        newHabit.set("day", dayString);
        newHabit.set("freq", freqData);
        newHabit.set("progVal", progValue);
        newHabit.set("dailyFreq", numDailyFreq);
        newHabit.set("streak", 0);
        newHabit.set("record", 0);

        var user = Parse.User.current();
        newHabit.save().then(function(habitParseObj){
            // We have the UserAccount, create parse relationship
            var relation = user.relation('habits');
            relation.add(habitParseObj);
            return user.save();
        }).then(function(result){
            resolve();
        },function(err){
            reject(err['message']);
        });
    });
}



// function createHabit()
// {
//     var titleValue = document.getElementById("title").value;
//     var habitValue = document.getElementById("habits").value;
//     var iconImgNum = document.getElementById("habits").selectedIndex;
//     var dayArray = document.getElementsByName("date[]");
//     var dayLength = dayArray.length;
//     var dayData = Array();
//     for (k = 0; k < dayLength; k++)
//     {
//         dayData[k] = dayArray[k].checked;
//     }
//     var dayString = JSON.stringify(dayData);

//     var freqArray = document.getElementsByName("day[]");
//     var freqLength = freqArray.length;
//     var freqData = Array();
//     var numDailyFreq = 0;
//     for (i = 0; i < freqLength; i++)
//     {
//         freqData[i] = freqArray[i].checked;

//         if(freqArray[i].checked === true) {
//             numDailyFreq = i + 1;
//         }
//     }
//     var freqString = JSON.stringify(freqData);

//     if(numDailyFreq===0)
//         var numDailyFreq = document.getElementById("others").value;

//     var d = new Date();
//     var n = d.getTime();
//     var idStr = n.toString();
//     var id = titleValue.substring(0,4)+idStr.substring(idStr.length - 3);
//     var idClean = id.replace(/ /g,'');
//     var progValue = 0;

//     var habitObject = {id: idClean, title: titleValue, icon: habitValue, iconNum: iconImgNum, day: dayString, freq: freqString, progVal: progValue, dailyFreq: numDailyFreq, streak: 0, record: 0};
//     var habit = JSON.stringify(habitObject);
//     var habitList = localStorage.getItem("habitList");
    
//     if(!habitList)
//     {
//         var newHabitList = Array();
//         newHabitList.push(habit);
//         localStorage.setItem("habitList", JSON.stringify(newHabitList));
//         //location.href='list.html';
//     }
//     else
//     {
//         var parList = JSON.parse(habitList);
//         parList.push(habit);
//         localStorage.setItem("habitList", JSON.stringify(parList));
//         //location.href='list.html';
//     }
    
//     //var formData = new FormData(document.querySelector('form'));
    
//     // location.href='list.html';
// }

function removeParseHabit(habitId){
    return new Promise(function(resolve,reject){
        var HabitClass = Parse.Object.extend("Habit");
        var query = new Parse.Query(HabitClass);
        query.equalTo("objectId",habitId);
        query.find().then(function(returnArray){
            if(returnArray.length!==1) {
                reject("Could not find your habit in the table.");
            }

            var habit = returnArray[0];
            return habit.destroy();
        }).then(function(){
            resolve();
        },function(err){
            alert(err["message"]);
            reject();
        });
    });
}

function getUserHabits() {
    return new Promise(function(resolve,reject){
        var user = Parse.User.current();
        var relations = user.relation('habits');
        var query = relations.query();
        query.equalTo("Habit");
        relations.query().find().then(function(result){
            resolve(result);
        });
    });
}
function storeHabitID(habitID)
{
    localStorage.setItem("habitEditID", habitID);
}
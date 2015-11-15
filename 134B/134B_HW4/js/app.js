
// Initialize dependency (Parse backend)
Parse.initialize("d2claNl95q01NDPLvJ5c6wss7ePAqKGn9l048Zqb", 
                        "N344LtQrb8LdEIKU1M4dlsMSUZiXf1fEtSY16Of7");

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
        userQuery.contains('email', email);
        fileQuery.get(email).then(function(result){
            if(result.size != 0)
                return null;
            else {
                // Check password
                if(pass==result.get(password))
                    resolve(result);
                else
                    return null;
            }
        },function(err){reject(err);});
    });
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
    //location.href='list.html';
}

/*function editHabit(element) {

    console.log("Edit Habit Accessed");    
}*/



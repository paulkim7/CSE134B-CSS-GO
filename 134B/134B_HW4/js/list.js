// Initialize dependency (Parse backend)
Parse.initialize("d2claNl95q01NDPLvJ5c6wss7ePAqKGn9l048Zqb", "N344LtQrb8LdEIKU1M4dlsMSUZiXf1fEtSY16Of7");

window.onload = function () {
    checkForLogin();
    var user = Parse.User.current();
    var tagList = [];
    var relations = user.relation('habits');
    var query = relations.query();
    var output = document.getElementById('habit-list');
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    query.equalTo("Habit");
    relations.query().find().then(function(result){
        for(habit of result)
        {
            // For each habit, do stuff in this for each loop to make it RESTFUL
            console.log(habit);
            
            console.log("Habit: " + habit.get("title"));
        
   


    
//    var habitArray = JSON.parse(localStorage.getItem("habitList"));
//    var habitLength = habitArray.length;
//    console.log(habitArray);
//    console.log("Habit List Length: " + habitLength);
//    var ind = 0;

    


//    while (ind < habitLength)
//    {
//       var habit1 = JSON.parse(habitArray[ind]);
        var i = habit.id;
        var title=habit.get("title");
        var iconLoc=habit.get("iconLoc");
        var iconNum=habit.get("iconNum");  // Change later to reference file directly
        var day=habit.get("day");
        var freq=habit.get("freq");
        var progVal=habit.get("progVal");
        var dailyFreq=habit.get("dailyFreq");
        var streak=habit.get("streak");
        var record=habit.get("record");
        if (!document.getElementById('habit-' + i) &&
                !document.getElementById('nameLi-' + i) &&
                !document.getElementById('nameDiv-' + i) &&
                !document.getElementById('totalSpan-' + i) &&
                !document.getElementById('messSvg-' + i) &&
                !document.getElementById('messLine1-' + i) &&
                !document.getElementById('messLine2-' + i) &&
                !document.getElementById('today-' + i) &&
                !document.getElementById('habitOp-' + i) &&
                !document.getElementById('done-' + i) &&
                !document.getElementById('edit-' + i) &&
                !document.getElementById('del-' + i) &&
                !document.getElementById('doneImg-' + i) &&
                !document.getElementById('editImg-' + i) &&
                !document.getElementById('delImg-' + i) &&
                !document.getElementById('iconLi-' + i) &&
                !document.getElementById('iconImg-' + i) &&
                !document.getElementById('info-' + i))
        {
        
            var list = document.createElement("li");
            var nameLi = document.createElement("li");
            var nameDiv = document.createElement("div");
            var iconLi = document.createElement("li");
            var iconImg = document.createElement("img");
            var info = document.createElement("ul");
            var messDiv = document.createElement("div");
            var totalSpan = document.createElement("span");
            var messSvg = document.createElement("svg");
            var messLine1 = document.createElement("line");
            var messLine2 = document.createElement("line");
            var today = document.createElement("span");
            var habitOp = document.createElement("div");
            var done = document.createElement("button");
            var edit = document.createElement("button");
            var del = document.createElement("button");
            var doneImg = document.createElement("img");
            var editImg = document.createElement("img");
            var delImg = document.createElement("img");
            var br = document.createElement("br");
            var progress = document.createElement("progress");

            list.setAttribute("id", "habit-" + i);
            nameLi.setAttribute("id", "nameLi-" + i);
            nameDiv.setAttribute("id", "nameDiv-" + i);
            totalSpan.setAttribute("id", "totalSpan-" + i);
            messSvg.setAttribute("id", "messSvg-" + i);
            messLine1.setAttribute("id", "messLine1-" + i);
            messLine2.setAttribute("id", "messLine2-" + i);
            today.setAttribute("id", "today-" + i);
            habitOp.setAttribute("id", "habitOp-" + i);
            done.setAttribute("id", "done-" + i);
            edit.setAttribute("id", "edit-" + i);
            del.setAttribute("id", "del-" + i);
            doneImg.setAttribute("id", "doneImg-" + i);
            editImg.setAttribute("id", "editImg-" + i);
            delImg.setAttribute("id", "delImg-" + i);
            iconLi.setAttribute("id", "iconLi-" + i);
            iconImg.setAttribute("id", "iconImg-" + i);
            info.setAttribute("id", "info-" + i);
            nameDiv.setAttribute("class", "habit-name");
            info.setAttribute("class", "habit-info");
            iconImg.setAttribute("class", "habit-icon");
            iconImg.setAttribute("src", iconLoc);
            iconImg.setAttribute("alt", "habit icon");
            progress.setAttribute("class", "progressBar");
            nameDiv.innerHTML = title;

            // Habit info
            nameLi.appendChild(nameDiv);
            iconLi.appendChild(iconImg);
            info.appendChild(nameLi);
            info.appendChild(iconLi);
            list.appendChild(info);

            // Habit Stats
            messLine1.setAttribute("x1", "0");
            messLine1.setAttribute("y1", "0");
            messLine1.setAttribute("x2", "60");
            messLine1.setAttribute("y2", "0");
            messLine1.setAttribute("style", "stroke:rgba(65, 131, 215, 0.8);stroke-width:25");
            messLine2.setAttribute("x1", "60");
            messLine2.setAttribute("y1", "0");
            messLine2.setAttribute("x2", "150");
            messLine2.setAttribute("y2", "0");
            messLine2.setAttribute("style", "stroke:rgba(171,171,171,0.6);stroke-width:25");
            messSvg.setAttribute("height", "25");
            messSvg.setAttribute("width", "150");
            totalSpan.setAttribute("class", "message-total");

            messSvg.appendChild(messLine1);
            messSvg.appendChild(messLine2);

            // Progress value & max
            progress.value = progVal;




            // add if/else statement to determine if dailyFreq is from button or OTHER RECORD
            if( dailyFreq === 0 ) {
                progress.max = dailyFreq;
                today.innerHTML = "Completed <strong> " + progVal + "/" + dailyFreq + "</strong> for today!";
            }
            else {
                progress.max = dailyFreq;
                today.innerHTML = "Completed <strong> " + progVal + "/" + dailyFreq + "</strong> for today!";
            }


            // Streak and record number added
            totalSpan.innerHTML = "<strong> " + streak + "</strong> days in a row! Best Record: <strong> " + record +"</strong><br><br>";

            //today.innerHTML = "Completed <strong> " + habit1.progVal + "/" + habit1.dailyFreq + "</strong> for today!";
            today.setAttribute("class", "message-today");
            messDiv.setAttribute("class", "message");
            //totalSpan.appendChild(messSvg);
            //totalSpan.appendChild(br);
            totalSpan.appendChild(progress);

            messDiv.appendChild(totalSpan);
            messDiv.appendChild(br);
            messDiv.appendChild(today);

            doneImg.setAttribute("src", "../img/done.svg");
            doneImg.setAttribute("alt", "done");

            editImg.setAttribute("src", "../img/edit.svg");
            editImg.setAttribute("alt", "Edit");

            delImg.setAttribute("src", "../img/delete.svg");
            delImg.setAttribute("alt", "Del");

            done.setAttribute("class", "op op-done");
            edit.setAttribute("class", "op op-edit");
            del.setAttribute("class", "op op-del");

            done.setAttribute("type", "button");
            edit.setAttribute("type", "button");
            del.setAttribute("type", "button");

            done.setAttribute("onclick", "updateMsgProgBar(this);");
            edit.setAttribute("onclick", "editHabit(this); location.href='edit.html'");
            del.setAttribute("onclick", "confirmDelete(this);");

            del.appendChild(delImg);
            edit.appendChild(editImg);
            done.appendChild(doneImg);

            habitOp.setAttribute("class", "habit-op");
            habitOp.appendChild(done);
            habitOp.appendChild(edit);
            habitOp.appendChild(del);

            list.appendChild(info);
            list.appendChild(messDiv);
            list.appendChild(habitOp);

            output.appendChild(list);


            var arrayDaysChecked = JSON.parse(day);

            for( k = 0; k < arrayDaysChecked.length; k++ ) {
                if( (arrayDaysChecked[k] === false) && (k === 5) ) {
                    progress.style.visibility = "hidden";
                    //today.style.visibility = "hidden";
                    today.innerHTML = "Habit is not available today.";

                    
                }
                
                if( (arrayDaysChecked[k] === true) && (k === 5) ) {

                    
                    if(k != localStorage.getItem("recentCheckedDay")) {
                        if(progVal === 0) {
                            streak = 0;
                        }

                        progress.value = 0;
                        progVal = 0;
                    }

                    localStorage.setItem("recentCheckedDay", k);

                    today.innerHTML = "Completed <strong> " + progVal + "/" + dailyFreq + "</strong> for today!";

                }  

//                habitArray[ind] = JSON.stringify(habit1);
            }            
        }

       // ind++;
    }
     });

    // place here?
//    localStorage.setItem("habitList", JSON.stringify(habitArray));

};

function getParseHabits(userId){
    // Get user account using userId
    var userClass = Parse.object.extend("UserAccount");
    var userQuery = new Parse.query(userClass);
    return new Promise(function(resolve,reject){
        userQuery.equalTo("id",userId).find().then(function(userList){
            if(userList===undefined || userList.size!==1) {
                reject();
            }
            resolve(userList[0].get(habits));
        });
    });
}

function confirmDelete(element) {
    var deleteConfirm = confirm("Are you sure you want to delete this habit?");

    if(deleteConfirm) {
        deleteHabit(element);
    }
}
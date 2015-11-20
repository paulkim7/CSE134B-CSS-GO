//var ind = 0; // remove if it messes things up

window.onload = function () {
    var output = document.getElementById('habit-list');
    var habitArray = JSON.parse(localStorage.getItem("habitList"));
    var habitLength = habitArray.length;
    console.log(habitArray);
    console.log("Habit List Length: " + habitLength);
    var ind = 0;

    while (ind < habitLength)
    {
        var habit1 = JSON.parse(habitArray[ind]);
        var i = habit1.id;
        
        console.log("Habit ID: " + i);
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
            iconImg.setAttribute("src", habit1.icon);
            iconImg.setAttribute("alt", "habit icon");
            progress.setAttribute("class", "progressBar");
            nameDiv.innerHTML = habit1.title;

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
            progress.value = habit1.progVal;


            // add if/else statement to determine if dailyFreq is from button or OTHER RECORD
            progress.max = habit1.dailyFreq;

            // Streak and record number added
            totalSpan.innerHTML = "<strong> " + habit1.streak + "</strong> days in a row! Best Record: <strong> " + habit1.record +"</strong><br><br>";

            today.innerHTML = "Completed <strong> " + habit1.progVal + "/" + habit1.dailyFreq + "</strong> for today!";
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
        }

        ind++;
    }


};

function confirmDelete(element) {
    var deleteConfirm = confirm("Are you sure you want to delete this habit?");

    if(deleteConfirm) {
        deleteHabit(element);
    }
}
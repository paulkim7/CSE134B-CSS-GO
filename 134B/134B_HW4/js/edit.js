function editHabit(element) {
	//var output = document.getElementsByClassName("forms");

	var child = element.parentNode.parentNode;

	console.log("Edit Habit JS " + child.id);

	var habitToEdit = localStorage.getItem("habitList");
	var arrayHabit = JSON.parse(habitToEdit);

	var i = 0;

	while( i < arrayHabit.length ) {
                    
        var individualHabit = JSON.parse(arrayHabit[i]);

        if(child.id == ("habit-" + individualHabit.id) ) {
            console.log("Id matched");
            console.log(JSON.stringify(individualHabit));

            localStorage.setItem("editHabit", JSON.stringify(individualHabit));

            break;
        }

        i++;
    }



}
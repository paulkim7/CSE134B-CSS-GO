function editHabit(element) {
	var output = document.getElementsByClassName("forms");

	var child = element.parentNode.parentNode;

	console.log(child);

	var habitToEdit = localStorage.getItem("habitList");
	var arrayHabit = JSON.parse(habitToEdit);

	var i = 0;

	while( i < arrayHabit.length ) {
                    
        var individualHabit = JSON.parse(arrayHabit[i]);

        if(child.id == ("habit-" + individualHabit.id) ) {
            console.log("Id matched");
            console.log(individualHabit);

            var header = document.createElement("h2");
            
            
            break;
        }

        i++;
    }



}
function updateHabit() {
    var removedHabit = localStorage.getItem("habitList");
    var arrayHabit = JSON.parse(removedHabit);

    var j = 0;

    // If I have the index number in which it's in, it's easier (figure out more efficient way)

    // Inefficient way
    while (j < arrayHabit.length) {

        var individualHabit = JSON.parse(arrayHabit[j]);
        var updatedHabitID = localStorage.getItem("habitEditID");



        if (updatedHabitID === individualHabit.id) {
            console.log("Id matched");
            var titleValue = document.getElementById("title").value;
            var habitValue = document.getElementById("habits").value;

            console.log("update.js Icon Name: " + habitValue);

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
            individualHabit.title = titleValue;
            individualHabit.icon = habitValue;
            individualHabit.day = dayString;
            individualHabit.freqOther = otherValue;
            individualHabit.freq = freqString;


            arrayHabit[j] = JSON.stringify(individualHabit);

            break;
        }




        j++;

    }

    localStorage.setItem("habitList", JSON.stringify(arrayHabit));

}

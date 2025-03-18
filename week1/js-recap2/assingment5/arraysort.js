array = [1,5,6,3,2,4,7,8,9,10];

function sortArray(name, type) {
    ascending = [...name].sort((a, b) => a - b);
    decending = [...name].sort((a, b) => b - a);
    if (type == "asc") {
        return ascending;
    } else if (type == "desc") {
        return decending;
    } else {
        return "Please enter 'asc' for ascending or 'desc' for decending";
    }
}

console.log(sortArray(array, "desc  "));

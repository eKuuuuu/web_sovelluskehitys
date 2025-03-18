const numbers = [];
for (let i = 1; i < 6; i++) {
    input = prompt("Enter a number: ");
    console.log("Enter number: ", i, input);
    numbers.push(input);
}

console.log("Numbers: ", numbers);
search = prompt("Enter a number to search: ");
if (numbers.includes(search)) {
    console.log("Numbers "+ search + " is found in the array");
}   else {
    console.log("Numbers "+ search + " is not found in the array");
}

numbers.pop(numbers.length - 1);
console.log("Numbers after removing the last element: ", numbers);
numbers.sort((a, b) => a - b);
console.log("Numbers after sorting: ", numbers);
array = [];
let input = "";
while (input !== "done") {
  input = prompt("Enter a number");
  console.log("Enter a number (or \"done\" to exit): ", input);
  if (input % 2 === 0) {
    array.push(input);
  }
}

if (array.length === 0) {
  console.log("Even numbers: none");
} else {
    console.log("Even numbers: "+ array.join(", "));
}
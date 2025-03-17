let input = prompt("Enter the coordinates of point A and B in the format x1 y1 x2 y2: ");
let array = input.split(" ");
let x1 = parseFloat(array[0]);
let y1 = parseFloat(array[1]);
let x2 = parseFloat(array[2]);
let y2 = parseFloat(array[3]);

let distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

document.getElementById("output").innerHTML = `The distance between A and B is: ${distance}`;
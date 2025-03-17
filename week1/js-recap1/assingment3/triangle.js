let input = prompt("Enter the sides of the triangle in the format a b c: ");
let array = input.split(",");
let a = parseFloat(array[0]);
let b = parseFloat(array[1]);
let c = parseFloat(array[2]);

let isosceles = a === b || b === c || a === c;

let equilateral = a === b && b === c;

let scalene = a !== b && b !== c && a !== c;

if (isosceles === true) {
    document.getElementById("output").innerHTML = "The triangle is isosceles.";
}

if (equilateral === true) {
    document.getElementById("output").innerHTML = "The triangle is equilateral.";
}

if (scalene === true) {
    document.getElementById("output").innerHTML  = "The triangle is scalene.";
}
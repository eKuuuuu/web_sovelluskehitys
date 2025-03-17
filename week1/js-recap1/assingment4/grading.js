let grade = prompt("Enter your grade.");

if (grade >= 88) {
    document.getElementById("output").innerHTML = "You got an 5!";
}

if (grade >= 76 && grade < 88) {
    document.getElementById("output").innerHTML = "You got an 4!";
}

if (grade >= 64 && grade < 76) {
    document.getElementById("output").innerHTML = "You got an 3!";
}

if (grade >= 52 && grade < 64) {
    document.getElementById("output").innerHTML = "You got an 2!";
}

if (grade <= 40 && grade < 52) {
    document.getElementById("output").innerHTML = "You got an 1!";
}

if (grade < 39) {
    document.getElementById("output").innerHTML = "You got an 0!";
}
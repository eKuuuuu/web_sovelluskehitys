let endingNum = prompt("Enter a number");
let sum = 0;
for (let i = 1; i <= endingNum; i++) {
  sum += i;
}

document.getElementById("output").innerHTML = `The sum is: ${sum}`;
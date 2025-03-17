let celsius = parseFloat(prompt("Enter the temperature in Celsius: "));

let fahrenheit = (celsius * 9/5) + 32;

document.getElementById("output").innerHTML = `The temperature in Fahrenheit is: ${fahrenheit}`;
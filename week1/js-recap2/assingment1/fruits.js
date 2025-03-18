const array = ["apple", "banana", "orange", "grape", "kiwi"];
const vegetables = [];


console.log("Fruits: ", array);
console.log("Fruit length: ", array.length);
console.log("Element at index 2: ", array[2]);
console.log("Last element: ", array[array.length - 1]);

for (let i = 0; i < 3; i++) {
    input = prompt("Enter a vegetable: ");
    vegetables.push(input);
}
console.log("Vegetables: ", vegetables);
console.log("Length of vegetables: " + vegetables.length);
array = [1,5,6,3,2,4,7,8,9,10];

function sortArray(name) {
  return [...name].sort((a, b) => a - b);
}

console.log(sortArray(array));

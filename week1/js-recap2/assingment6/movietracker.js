let mAmount = prompt("How many movies do you want to add?");
const movieList = [];
let ul = document.createElement("ul");
document.body.appendChild(ul);

for (let i = 0; i < mAmount; i++) {
    let mTitle = prompt("Enter movie title:");
    let mRating = parseFloat(prompt("Enter movie rating (1-5):"));

    let movie = {
        title: mTitle,
        rating: mRating,
    };

    movieList.push(movie);
}

movieList.sort((a, b) => b.rating - a.rating);

movieList.forEach(movie => {
    let li = document.createElement("li");
    li.innerText = `${movie.title}: ${movie.rating}`;
    ul.appendChild(li);
});

console.log(movieList);

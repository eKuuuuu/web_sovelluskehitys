import { fetchData } from './lib/fetchData.js';

// your code here
const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];

const signupModal = document.getElementById('signupModal');
const signupLink = document.querySelector('.signup-text a');
const closeSignupModal = document.querySelector('.close-signup');
const loginModal = document.getElementById('loginModal');
const signinLink = document.querySelector('.signin-text a');

// html funktiot
function createRestaurantCells(restaurant, tr) {
    // Name cell
    const nameTd = document.createElement('td');
    nameTd.innerText = restaurant.name;

    // Address cell
    const addressTd = document.createElement('td');
    addressTd.innerText = restaurant.address;
    addressTd.classList.add('address-column'); // Add class

    // City cell
    const cityTd = document.createElement('td');
    cityTd.innerText = restaurant.city;
    cityTd.classList.add('city-column'); // Add class

    tr.append(nameTd, addressTd, cityTd);
}

function createModalHtml(restaurant, modal) {
    const nameH3 = document.createElement('h3');
    nameH3.innerText = restaurant.name;
    const addressP = document.createElement('p');
    addressP.innerText = `${restaurant.address}, puhelin: ${restaurant.phone}`;
    modal.append(nameH3, addressP);
}

function createMenuHtml(courses) {
    console.log(courses);
    let html = '';
    for (const course of courses) {
        html += `
    <article class="course">
        <p><strong>${course.name}</strong>,
        Hinta: ${course.price},
        Allergeenit: ${course.diets}</p>
    </article>
  `;
    }
    return html;
}

// hae kaikki ravintolat
async function getRestaurants() {
    try {
        restaurants = await fetchData(apiUrl + '/restaurants');
    } catch (error) {
        console.error(error);
    }
}

// hae tietyn ravintolan päivän menu
async function getDailyMenu(id, lang) {
    try {
        return await fetchData(`${apiUrl}/restaurants/daily/${id}/${lang}`);
    } catch (error) {
        console.error(error);
    }
}

async function getWeeklyMenu(id, lang) {
    try {
        return await fetchData(`${apiUrl}/restaurants/weekly/${id}/${lang}`);
    } catch (error) {
        console.error(error);
    }
}

// restaurants aakkosjärjestykseen
function sortRestaurants() {
    restaurants.sort(function (a, b) {
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
    });
}


function createTable() {
    for (const restaurant of restaurants) {
        // rivi
        const tr = document.createElement('tr');
        tr.addEventListener('click', function () {
            for (const elem of document.querySelectorAll('.highlight')) {
                elem.classList.remove('highlight');
            }

            tr.classList.add('highlight');

            // tyhjennä modal
            modal.innerHTML = '';
            // tee modalin sisältö
            createModalHtml(restaurant, modal);

            // luo painikkeet
            const dailyButton = document.createElement('button');
            dailyButton.innerText = 'Daily Menu';
            dailyButton.addEventListener('click', async function () {
                try {
                    const coursesResponse = await getDailyMenu(restaurant._id, 'fi');
                    const menuHtml = createMenuHtml(coursesResponse.courses);
                    modal.innerHTML = '';
                    createModalHtml(restaurant, modal);
                    modal.insertAdjacentHTML('beforeend', menuHtml);
                } catch (error) {
                    console.error(error);
                }
            });

            const weeklyButton = document.createElement('button');
            weeklyButton.innerText = 'Weekly Menu';
            weeklyButton.addEventListener('click', async function () {
                try {
                    const coursesResponse = await getWeeklyMenu(restaurant._id, 'fi');
                    console.log('Weekly Menu:', coursesResponse); // Log the weekly menu data
                    modal.innerHTML = '';
                    createModalHtml(restaurant, modal);

                    // Create dropdown for each day
                    const daySelect = document.createElement('select');
                    daySelect.innerHTML = coursesResponse.days.map((day, index) =>
                        `<option value="${index}">${day.date}</option>`
                    ).join('');

                    const menuContainer = document.createElement('div');
                    modal.appendChild(menuContainer);

                    daySelect.addEventListener('change', function () {
                        const selectedDay = coursesResponse.days[daySelect.value];
                        const menuHtml = createMenuHtml(selectedDay.courses);
                        menuContainer.innerHTML = menuHtml; // Clear previous menu and add new menu
                    });

                    modal.appendChild(daySelect);
                    modal.showModal();
                } catch (error) {
                    console.error(error);
                }
            });

            modal.append(dailyButton, weeklyButton);
            modal.showModal();
        });

        // lisätään solut riviin
        createRestaurantCells(restaurant, tr);
        taulukko.append(tr);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Add search functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#target tr:not(:first-child)'); // Exclude the header row

        rows.forEach(row => {
            const nameCell = row.querySelector('td:first-child'); // Get the name column
            if (nameCell) {
                const nameText = nameCell.textContent.toLowerCase();
                if (nameText.includes(searchValue)) {
                    row.style.display = ''; // Show the row
                } else {
                    row.style.display = 'none'; // Hide the row
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mapButton = document.getElementById('mapButton');
    const mapModal = document.getElementById('mapModal');
    const closeMapButton = document.querySelector('.close-map');

    // Open the map modal when the "Map" button is clicked
    mapButton.addEventListener('click', (event) => {
        event.preventDefault();
        mapModal.style.display = 'block';
    });

    // Close the map modal when the close button is clicked
    closeMapButton.addEventListener('click', () => {
        mapModal.style.display = 'none';
    });

    // Close the map modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === mapModal) {
            mapModal.style.display = 'none';
        }
    });
});

// Show the signup modal and close the login modal when "Sign up!" is clicked
signupLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginModal.style.display = 'none'; // Close the login modal
    signupModal.style.display = 'block'; // Show the signup modal
});

// Show the login modal and close the signup modal when "Sign in" is clicked
signinLink.addEventListener('click', (event) => {
    event.preventDefault();
    signupModal.style.display = 'none'; // Close the signup modal
    loginModal.style.display = 'block'; // Show the login modal
});

// Close the signup modal when the close button is clicked
closeSignupModal.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

// Close the signup modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

async function main() {
    try {
        await getRestaurants();
        sortRestaurants();
        createTable();
    } catch (error) {
        console.error(error);
    }
}

main();
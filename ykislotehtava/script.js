import { fetchData } from './lib/fetchData.js';

// your code here
const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];

// html funktiot
function createRestaurantCells(restaurant, tr) {
    // nimisolu
    const nameTd = document.createElement('td');
    nameTd.innerText = restaurant.name;
    // osoitesolu
    const addressTd = document.createElement('td');
    addressTd.innerText = restaurant.address;
    // kaupunkisolu
    const cityTd = document.createElement('td');
    cityTd.innerText = restaurant.city;
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
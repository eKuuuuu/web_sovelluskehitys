import { fetchData } from '../lib/fetchData.js';
import { apiUrl } from "./variables.js";

const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];

export const getRestaurantsByProvider = async (provider) => {
    try {
        const allRestaurants = await fetchData(apiUrl + '/restaurants');
        console.log('Fetched Restaurants:', allRestaurants); // Log the fetched data
        const normalizedProvider = provider.trim().toLowerCase();
        if (normalizedProvider === 'all') {
            console.log("all runs");
            return allRestaurants;
        } else if (normalizedProvider === 'sodexo') {
            return allRestaurants.filter(restaurant => restaurant.company.toLowerCase() === 'sodexo');
        } else if (normalizedProvider === 'compass group') {
            return allRestaurants.filter(restaurant => restaurant.company.toLowerCase() === 'compass group');
        }
    } catch (error) {
        console.error(error);
    }
};


// Function to create a restaurant row
export const restaurantRow = ({ name, address, city }) => {
    const tr = document.createElement('tr');

    // Create and append table cells
    const nameTd = document.createElement('td');
    nameTd.innerText = name ? name : 'Ei nimeä';

    const addressTd = document.createElement('td');
    addressTd.innerText = address ? address : 'Ei osoitetta';

    const cityTd = document.createElement('td');
    cityTd.innerText = city ? city : 'Ei kaupunkia';

    tr.append(nameTd, addressTd, cityTd);
    return tr;
};

// Function to create the restaurant modal content
export const restaurantModal = (restaurant, menu) => {
    if (!restaurant) {
        console.error('Restaurant object is undefined');
        return '';
    }

    const { name, address, phone } = restaurant;
    let menuHtml = '';

    if (menu?.courses?.length) {
        menuHtml = menu.courses.map(course => `
            <article class="course">
                <p><strong>${course.name}</strong>,
                Hinta: ${course.price ? course.price : 'Ei hintatietoa'},
                Allergeenit: ${course.diets ? course.diets : 'Ei tietoja'}</p>
            </article>
        `).join('');
    } else {
        menuHtml = '<p>Menu ei saatavilla</p>';
    }

    return `
        <h3>${name ? name : 'Not found'}</h3>
        <p>${address}, puhelin: ${phone ? phone : 'Ei puhelinnumeroa'}</p>
        ${menuHtml}
    `;
};

// Fetch all restaurants
export const getRestaurants = async () => {
    try {
        restaurants = await fetchData(apiUrl + '/restaurants');
    } catch (error) {
        console.error(error);
    }
};

// Fetch a specific restaurant's daily menu
const getDailyMenu = async (id, lang) => {
    try {
        return await fetchData(`${apiUrl}/restaurants/daily/${id}/${lang}`);
    } catch (error) {
        console.error(error);
    }
};

// Sort restaurants alphabetically
export const sortRestaurants = () => {
    restaurants.sort(sortByName);
};

export const sortByName = (a, b) =>
    a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;

// Function to create and append table rows
// Function to create and append table rows
export const createTable = (restaurantsToDisplay) => {
    taulukko.innerHTML = '';
    restaurantsToDisplay.forEach(restaurant => {
        const tr = restaurantRow(restaurant);
        tr.addEventListener('click', async function () {
            try {
                document.querySelectorAll('.highlight').forEach(elem => elem.classList.remove('highlight'));
                tr.classList.add('highlight');

                const coursesResponse = await getDailyMenu(restaurant._id, 'fi');
                modal.innerHTML = restaurantModal(restaurant, coursesResponse);
                modal.showModal();
            } catch (error) {
                console.error(error);
            }
        });
        taulukko.append(tr);
    });
};

// Event listener for provider filter
const providerFilter = document.querySelector('#providerFilter');
if (!providerFilter) {
    console.error('providerFilter element not found');
} else {
    providerFilter.addEventListener('change', async () => {
        console.log('Provider filter changed'); // Log to confirm event listener is triggered
        try {
            const provider = providerFilter.value;
            const filteredRestaurants = await getRestaurantsByProvider(provider);
            createTable(filteredRestaurants); // Pass filtered restaurants to createTable
        } catch (error) {
            console.error(error);
        }
    });
}
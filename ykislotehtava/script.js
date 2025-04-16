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

// map stuff
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


function success(pos) {
    const crd = pos.coords;
    console.log(crd);

    const alkupiste = [crd.latitude, crd.longitude];

    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Map element not found!");
        return;
    }

    const map = L.map("map").setView(alkupiste, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.circleMarker(alkupiste, {
        color: 'red',
        radius: 10,
        fillColor: 'red',
        fillOpacity: 0.7,
        weight: 2
    }).addTo(map)
        .bindPopup("You are here!")
        .openPopup();


    restaurants.forEach(restaurant => {
        const restaurantLocation = restaurant.location.coordinates;
        const name = restaurant.name;
        const address = restaurant.address;

        const lat = restaurantLocation[1];
        const lon = restaurantLocation[0];

        const marker = L.marker([lat, lon]).addTo(map);

        marker.bindPopup(`
      <h3>${name}</h3>
      <p>${address}</p>
    `);
    });

    console.log("Map successfully loaded at", alkupiste);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

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

async function fetchUserData() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No token found');
        return null;
    }

    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users/token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            return await response.json(); // Return user data
        } else {
            console.error('Failed to fetch user data');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function uploadAvatar() {
    const token = localStorage.getItem('authToken');
    const avatarInput = document.getElementById('avatarInput');
    const file = avatarInput.files[0];

    if (!file) {
        alert('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            alert('Avatar uploaded successfully!');
            console.log('Avatar URL:', data.fileName);
            // Update the avatar dynamically
            const profileAvatar = document.getElementById('profileAvatar');
            profileAvatar.src = `https://media2.edu.metropolia.fi/restaurant/uploads/${data.fileName}`; // Fetch directly from /uploads
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to upload avatar'}`);
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('An error occurred while uploading the avatar.');
    }
}

async function updateUser() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must be logged in to update your information.');
        return;
    }

    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    const updatedData = {};
    if (newUsername) updatedData.username = newUsername;
    if (newEmail) updatedData.email = newEmail;
    if (newPassword) updatedData.password = newPassword;

    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert('User information updated successfully!');
            // Optionally, refresh the profile modal with updated data
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to update user information'}`);
        }
    } catch (error) {
        console.error('Error updating user information:', error);
        alert('An error occurred while updating your information.');
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

document.querySelector('#mapModal .close').addEventListener('click', () => {
    document.getElementById('mapModal').style.display = 'none';
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Prepare the request payload
    const loginData = {
        username: username,
        password: password,
    };

    try {
        // Send the POST request
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const responseData = await response.json();
            alert('Login successful!');
            console.log('Token:', responseData.token); // Log the token for further use
            loginModal.style.display = 'none'; // Close the login modal
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to log in'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const profileModal = document.createElement('div');

    // Check if the user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        loginButton.textContent = 'Profile';
        loginButton.href = '#profile';
    }

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token); // Save token to localStorage
                alert('Login successful!');
                loginModal.style.display = 'none';
                loginButton.textContent = 'Profile';
                loginButton.href = '#profile';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to log in'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in.');
        }
    });

    // Create profile modal
    profileModal.id = 'profileModal';
    profileModal.className = 'loginModal';
    profileModal.innerHTML = `
        <div class="modal-content">
            <span class="close-profile">&times;</span>
            <h2>Profile</h2>
            <p id="profileUsername">Username: </p>
            <p id="profileEmail">E-mail: </p>
            <img id="profileAvatar" src="" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%;">
            <input type="file" id="avatarInput" accept="image/*" style="margin-top: 10px;">
            <button id="uploadAvatarButton">Upload Image</button>
            
            <h3>Update Information</h3>
            <label for="newUsername">New Username:</label>
            <input type="text" id="newUsername" placeholder="Enter new username">
            
            <label for="newEmail">New Email:</label>
            <input type="email" id="newEmail" placeholder="Enter new email">
            
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" placeholder="Enter new password">
            
            <button id="updateUserButton">Update Information</button>
            <button id="logoutButton">Logout</button>
        </div>
    `;
    document.body.appendChild(profileModal);

    document.getElementById('updateUserButton').addEventListener('click', updateUser);

    // Open profile modal and populate it with user data
    loginButton.addEventListener('click', async (event) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            event.preventDefault();
            loginModal.style.display = 'none'; // Ensure the login modal is hidden

            try {
                // Fetch user data
                const userData = await fetchUserData();
                if (userData) {
                    // Populate profile modal with user data
                    profileModal.querySelector('h2').innerText = `Welcome, ${userData.username || 'User'}!`;
                    profileModal.querySelector('#profileUsername').innerText = `Username: ${userData.username || 'N/A'}`;
                    profileModal.querySelector('#profileEmail').innerText = `E-mail: ${userData.email || 'N/A'}`;

                    // Fetch avatar directly from /uploads
                    profileModal.querySelector('#profileAvatar').src = userData.avatar
                        ? `https://media2.edu.metropolia.fi/restaurant/uploads/${userData.avatar}`
                        : 'default-avatar.png'; // Fallback to default avatar
                } else {
                    console.error('Failed to retrieve user data.');
                    alert('Could not load profile data. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                alert('An error occurred while loading the profile.');
            }

            profileModal.style.display = 'block'; // Show the profile modal
        }
    });

    document.body.appendChild(profileModal);

    // Add event listener for the upload button
    document.getElementById('uploadAvatarButton').addEventListener('click', uploadAvatar);

    // Close profile modal
    profileModal.querySelector('.close-profile').addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    // Handle logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('authToken'); // Clear token from localStorage
        alert('Logged out successfully!');
        profileModal.style.display = 'none';
        loginButton.textContent = 'Login';
        loginButton.href = '#login';
    });
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const userData = {
        username: username,
        password: password,
        email: email,
    };

    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('User created successfully!');
            document.getElementById('signupForm').reset(); // Reset the form
            signupModal.style.display = 'none'; // Close the signup modal
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to create user'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the user.');
    }
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
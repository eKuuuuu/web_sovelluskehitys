document.addEventListener("DOMContentLoaded", function () {
    fetchRestaurants();
});

function fetchRestaurants() {
    const restaurants = [
        { id: 1, name: "Ravintola A" },
        { id: 2, name: "Ravintola B" },
        { id: 3, name: "Ravintola C" }
    ];

    const restaurantList = document.getElementById("restaurants");
    restaurantList.innerHTML = "";

    restaurants.forEach(ravintola => {
        const li = document.createElement("li");
        li.textContent = ravintola.name;
        li.onclick = () => selectRestaurant(ravintola.id);
        restaurantList.appendChild(li);
    });
}

function selectRestaurant(id) {
    console.log("Valittu ravintola:", id);
    fetchMenu("day");
}

function fetchMenu(type) {
    const menuContent = document.getElementById("menu-content");

    const menuData = {
        day: ["Keitto", "Salaatti", "Jälkiruoka"],
        week: ["Maanantai: Pasta", "Tiistai: Keitto", "Keskiviikko: Salaatti"]
    };

    menuContent.innerHTML = `<ul>${menuData[type].map(item => `<li>${item}</li>`).join("")}</ul>`;
}

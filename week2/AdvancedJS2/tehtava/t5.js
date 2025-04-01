import {getRestaurants, sortRestaurants, createTable, getRestaurantsByProvider} from './components.js';

export const main = async () => {
    try {
        await getRestaurants();
        sortRestaurants();
        createTable();
        getRestaurantsByProvider()
    } catch (error) {
        console.error(error);
    }
}

main();
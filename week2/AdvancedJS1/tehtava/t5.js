import { getRestaurants, sortRestaurants, createTable } from './components.js';

export const main = async () => {
    try {
        await getRestaurants();
        sortRestaurants();
        createTable();
    } catch (error) {
        console.error(error);
    }
}

main();
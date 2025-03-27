import {fetchData} from "../lib/fetchData.js";

const apiurl = "https://reqres.in/api/users/2"

async function getUser() {
    try {
        const user = await fetchData(apiurl);
        console.log(user);
    } catch (error) {
        console.error(error);
    }
}

getUser()
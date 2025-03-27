import {fetchData} from "../lib/fetchData.js";

const apiurl = "https://reqres.in/api/unknown/23";

async function getUser() {
    try {
        const user = await fetchData(apiurl);
        console.log(user);
    } catch (error) {
        console.error("GET request failed:", error);
    }
}

async function postUser() {
    try {
        const response = await fetchData(apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: "John Doe" })
        });
        console.log(response);
    } catch (error) {
        console.error("POST request failed:", error);
    }
}

async function putUser() {
    try {
        const response = await fetchData(apiurl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: "John Doe" })
        });
        console.log(response);
    } catch (error) {
        console.error("PUT request failed:", error);
    }
}

async function deleteUser() {
    try {
        const response = await fetchData(apiurl, {
            method: 'DELETE'
        });
        console.log(response);
    } catch (error) {
        console.error("DELETE request failed:", error);
    }
}

getUser();
postUser();
putUser();
deleteUser();
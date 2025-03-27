const requestData = {
    body: JSON.stringify({
        name: "John",
        job: "Software Engineer"
    }),
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
}

async function postData(url = '', requestData = {}) {
    try {
        const response = await fetch(url, requestData);
        console.log(response.json());
    } catch (error) {
        console.error(error);
    }
}

postData("https://reqres.in/api/users", requestData);
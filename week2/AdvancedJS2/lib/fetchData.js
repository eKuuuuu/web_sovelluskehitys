export async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText} (Status: ${response.status})`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Network error or invalid response: ${error.message}`);
    }
}

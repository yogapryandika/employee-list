
async function checkHeaders() {
    try {
        const response = await fetch('http://localhost:4001/basicInfo?_page=1&_limit=6');
        console.log('Status:', response.status);
        // Convert headers to object for logging
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        console.log('Headers:', headers);
        console.log('X-Total-Count:', response.headers.get('X-Total-Count'));

        const data = await response.json();
        console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
        if (!Array.isArray(data)) {
            console.log('Data keys:', Object.keys(data));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkHeaders();
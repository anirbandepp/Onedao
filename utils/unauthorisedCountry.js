const axios = require("axios");

const restrictedCountries = ["Afghanistan", "Syria", "Iran"];

async function checkUserLocation() {
    const locationInfo = await axios.get(`https://geolocation-db.com/json/`);
    const country_name = locationInfo.data.country_name
    return restrictedCountries.includes(country_name);
}

module.exports = checkUserLocation;
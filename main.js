const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const locationElem = document.getElementById('location');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const lastUpdated = document.getElementById('last-updated');
const body = document.body;

const API_KEY = 'a3e97b05b4b44eac95d65717250204';

searchBtn.addEventListener('click', getWeatherData);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData();
    }
});

function getWeatherData() {
    const location = locationInput.value.trim();
    
    if (!location) return;
    
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    weatherInfo.style.display = 'none';
    
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(() => {
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

function displayWeatherData(data) {
    const current = data.current;
    const loc = data.location;
    
    const weatherEmoji = getWeatherEmoji(current.condition.code);
    updateTheme(current.is_day, current.condition.code);
    
    weatherIcon.textContent = weatherEmoji;
    temperature.textContent = `${Math.round(current.temp_c)}°C`;
    locationElem.textContent = `${loc.name}, ${loc.country}`;
    condition.textContent = current.condition.text;
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    wind.textContent = `${current.wind_kph} km/h`;
    
    const updatedDate = new Date(current.last_updated);
    lastUpdated.textContent = `Last updated: ${updatedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
    
    weatherInfo.style.display = 'block';
}

function getWeatherEmoji(code) {
    if (code === 1000) return '☀️';
    if (code === 1003) return '⛅';
    if ([1006, 1009].includes(code)) return '☁️';
    if ([1030, 1135, 1147].includes(code)) return '🌫️';
    if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return '🌧️';
    if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return '❄️';
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️';
    return '🌤️';
}

function updateTheme(isDay, conditionCode) {
    if (!isDay) {
        body.style.background = 'var(--night-gradient)';
        return;
    }
    
    if ([1000, 1003].includes(conditionCode)) {
        body.style.background = 'linear-gradient(135deg, #4DA0B0, #D39D38)';
    } else if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
        body.style.background = 'linear-gradient(135deg, #616161, #9bc5c3)';
    } else if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) {
        body.style.background = 'linear-gradient(135deg, #83a4d4, #b6fbff)';
    } else {
        body.style.background = 'var(--primary-gradient)';
    }
}

window.addEventListener('load', () => {
    locationInput.focus();
});
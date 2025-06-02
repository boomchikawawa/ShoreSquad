// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    loadEvents();
    setupWeatherForecast();
});

function initializeMap() {
    map = L.map('cleanup-map').setView([1.3521, 103.8198], 11); // Singapore coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    // Sample events - Replace with actual database/API calls
    const sampleEvents = [
        {
            title: 'East Coast Beach Cleanup',
            date: '2025-06-15',
            location: 'East Coast Park',
            participants: 25
        },
        {
            title: 'Sentosa Coastal Warriors',
            date: '2025-06-22',
            location: 'Siloso Beach',
            participants: 15
        }
    ];    const eventHTML = sampleEvents.map(event => `
        <div class="event-card">
            <h3><i class="fas fa-trash-alt"></i> ${event.title}</h3>
            <p><i class="far fa-calendar-alt"></i> ${new Date(event.date).toLocaleDateString('en-SG', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-users"></i> ${event.participants} Squad Members</p>
            <button onclick="joinEvent('${event.title}')" class="join-button">
                <i class="fas fa-plus-circle"></i> Join Squad
            </button>
        </div>
    `).join('');

    eventsContainer.innerHTML = eventHTML;
}

function joinEvent(eventTitle) {
    // Implement join event functionality
    alert(`Thanks for joining ${eventTitle}! We'll send you the details soon.`);
}

// Progressive enhancement - Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.error('ServiceWorker registration failed:', err);
        });
    });
}

async function setupWeatherForecast() {
    const weatherContainer = document.getElementById('weather-info');
    try {
        const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        const data = await response.json();
        
        if (data.items && data.items[0].forecasts) {
            const forecasts = data.items[0].forecasts;
            const forecastHTML = forecasts.map(forecast => {
                const date = new Date(forecast.date);
                const formattedDate = date.toLocaleDateString('en-SG', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                });
                  const weatherIcon = getWeatherIcon(forecast.forecast);
                return `
                    <div class="weather-card">
                        <div class="date">${formattedDate}</div>
                        <div class="weather-icon">
                            <i class="${weatherIcon}"></i>
                        </div>
                        <div class="forecast">${forecast.forecast}</div>
                        <div class="temperature">
                            <i class="fas fa-temperature-high"></i>
                            ${forecast.temperature.low}°C - ${forecast.temperature.high}°C
                        </div>
                        <div class="humidity">
                            <i class="fas fa-tint"></i>
                            ${forecast.relative_humidity.low}% - ${forecast.relative_humidity.high}%
                        </div>
                    </div>
                `;
            }).join('');
            
            weatherContainer.innerHTML = forecastHTML;
        } else {
            throw new Error('Invalid forecast data');
        }
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <p>Weather forecast temporarily unavailable</p>
                <p>Please check back later</p>
            </div>
        `;
    }
}

function getWeatherIcon(forecast) {
    const lowerForecast = forecast.toLowerCase();
    if (lowerForecast.includes('thundery')) {
        return 'fas fa-bolt';
    } else if (lowerForecast.includes('rain')) {
        return 'fas fa-cloud-rain';
    } else if (lowerForecast.includes('cloudy') || lowerForecast.includes('overcast')) {
        return 'fas fa-cloud';
    } else if (lowerForecast.includes('sunny') || lowerForecast.includes('fair')) {
        return 'fas fa-sun';
    } else if (lowerForecast.includes('partly cloudy')) {
        return 'fas fa-cloud-sun';
    } else {
        return 'fas fa-cloud-sun'; // default icon
    }
}

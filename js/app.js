// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupWeatherWidget();
    loadEvents();
});

function initializeMap() {
    map = L.map('cleanup-map').setView([1.3521, 103.8198], 11); // Singapore coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

async function setupWeatherWidget() {
    const weatherContainer = document.getElementById('weather-info');
    try {
        // Note: Replace with actual weather API implementation
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <h3>Current Beach Weather</h3>
                <div class="weather-details">
                    <p>Loading weather data...</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherContainer.innerHTML = '<p>Weather data temporarily unavailable</p>';
    }
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
    ];

    const eventHTML = sampleEvents.map(event => `
        <div class="event-card">
            <h3>${event.title}</h3>
            <p>Date: ${event.date}</p>
            <p>Location: ${event.location}</p>
            <p>Squad Members: ${event.participants}</p>
            <button onclick="joinEvent('${event.title}')" class="join-button">
                Join Squad
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

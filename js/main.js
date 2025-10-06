/* ========================================
   MAIN.JS - Global Utilities & Shared Functions
   Intergalactic Space Travel Agency
   ======================================== */

// ========== DESTINATION DATA ==========
const destinationData = {
    solar: [
        'Mars - The Red Planet',
        'Venus - Morning Star',
        'Mercury - Swift Messenger',
        'Jupiter - Gas Giant',
        'Saturn - Ringed Wonder',
        'Uranus - Ice Giant',
        'Neptune - Deep Blue',
        'Pluto - Distant Dwarf'
    ],
    exoplanet: [
        'Proxima Centauri b - Nearest Neighbor',
        'TRAPPIST-1e - Habitable Zone',
        'Kepler-452b - Earth\'s Cousin',
        'HD 189733 b - Blue Marvel',
        'Gliese 667 Cc - Super Earth',
        '55 Cancri e - Diamond World',
        'Kepler-16b - Tatooine-like',
        'WASP-12b - Hottest Planet'
    ],
    galaxy: [
        'Andromeda Galaxy - M31',
        'Triangulum Galaxy - M33',
        'Whirlpool Galaxy - M51',
        'Sombrero Galaxy - M104',
        'Pinwheel Galaxy - M101',
        'Centaurus A - NGC 5128',
        'Black Eye Galaxy - M64',
        'Sculptor Galaxy - NGC 253'
    ],
    fictional: [
        'Arrakis - Desert Planet of Dune',
        'Pandora - Forest Moon',
        'Tatooine - Twin Suns',
        'Coruscant - City Planet',
        'Dagobah - Swamp World',
        'Hoth - Ice Planet',
        'Bespin - Cloud City',
        'Naboo - Pastoral Paradise',
        'Krypton - Ancient Homeworld',
        'Gallifrey - Time Lord Home',
        'LV-426 - Acheron',
        'Solaris - Living Ocean'
    ]
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Generate a unique ID for travel cards
 * @returns {string} Unique card ID
 */
function generateCardID() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CARD-${timestamp}-${random}`;
}

/**
 * Format date and time for display
 * @param {string} date - Date string
 * @param {string} time - Time string
 * @returns {string} Formatted datetime
 */
function formatDateTime(date, time) {
    if (!date || !time) return '-';
    
    const dateObj = new Date(`${date}T${time}`);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Calculate distance based on destination
 * @param {string} destination - Destination name
 * @returns {string} Distance in appropriate units
 */
function calculateDistance(destination) {
    const distances = {
        'Mars': '225 million km',
        'Venus': '261 million km',
        'Mercury': '77 million km',
        'Jupiter': '778 million km',
        'Saturn': '1.4 billion km',
        'Uranus': '2.9 billion km',
        'Neptune': '4.5 billion km',
        'Pluto': '5.9 billion km',
        'Proxima': '4.24 light years',
        'TRAPPIST': '39 light years',
        'Kepler': '1,400 light years',
        'Andromeda': '2.537 million light years',
        'Triangulum': '2.73 million light years',
        'Whirlpool': '23 million light years'
    };
    
    for (const [key, value] of Object.entries(distances)) {
        if (destination.includes(key)) {
            return value;
        }
    }
    
    return 'Unknown Distance';
}

/**
 * Get random speed value for display
 * @returns {string} Speed in percentage of light speed
 */
function getRandomSpeed() {
    const speed = (Math.random() * 0.9 + 0.1).toFixed(1);
    return `${speed}c`;
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: '600',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 10px 40px rgba(0, 212, 255, 0.4)'
    });
    
    // Set background based on type
    const backgrounds = {
        success: 'linear-gradient(135deg, #00ff88, #00d4ff)',
        error: 'linear-gradient(135deg, #ff006e, #ff4d00)',
        info: 'linear-gradient(135deg, #00d4ff, #9d4edd)'
    };
    notification.style.background = backgrounds[type] || backgrounds.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== DESTINATION SELECTOR HANDLER ==========
function setupDestinationSelector() {
    const destinationType = document.getElementById('destinationType');
    const destination = document.getElementById('destination');
    
    if (destinationType && destination) {
        destinationType.addEventListener('change', function() {
            const type = this.value;
            destination.innerHTML = '<option value="">Select destination...</option>';
            
            if (type && destinationData[type]) {
                destination.disabled = false;
                destinationData[type].forEach(dest => {
                    const option = document.createElement('option');
                    option.value = dest;
                    option.textContent = dest;
                    destination.appendChild(option);
                });
            } else {
                destination.disabled = true;
            }
        });
    }
}

// ========== FORM VALIDATION ==========
function validateForm(formData) {
    const required = ['travelerName', 'spacecraft', 'destination', 'departureDate', 'departureTime', 'seatClass', 'mealPreference'];
    
    for (const field of required) {
        if (!formData[field] || formData[field].trim() === '') {
            return { valid: false, message: `Please fill in: ${field.replace(/([A-Z])/g, ' $1').trim()}` };
        }
    }
    
    return { valid: true };
}

// ========== INITIALIZE ON DOM LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Setup destination selector if on travel card page
    setupDestinationSelector();
    
    // Add CSS animations dynamically if not already present
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// ========== EXPORT FOR MODULE USE ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        destinationData,
        generateCardID,
        formatDateTime,
        calculateDistance,
        getRandomSpeed,
        smoothScrollTo,
        showNotification,
        validateForm
    };
}
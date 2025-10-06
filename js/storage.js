/* ========================================
   STORAGE.JS - localStorage Management
   Handle saving, loading, and deleting travel cards
   ======================================== */

// ========== STORAGE KEY ==========
const STORAGE_KEY = 'intergalactic_travel_cards';

// ========== STORAGE FUNCTIONS ==========

/**
 * Get all saved travel cards from localStorage
 * @returns {Array} Array of travel card objects
 */
function getAllCards() {
    try {
        const cards = localStorage.getItem(STORAGE_KEY);
        return cards ? JSON.parse(cards) : [];
    } catch (error) {
        console.error('Error loading cards:', error);
        return [];
    }
}

/**
 * Save a new travel card to localStorage
 * @param {Object} cardData - Travel card data object
 * @returns {boolean} Success status
 */
function saveCard(cardData) {
    try {
        const cards = getAllCards();
        
        // Add timestamp if not present
        if (!cardData.timestamp) {
            cardData.timestamp = Date.now();
        }
        
        // Add card ID if not present
        if (!cardData.cardID) {
            cardData.cardID = generateCardID();
        }
        
        cards.push(cardData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        return true;
    } catch (error) {
        console.error('Error saving card:', error);
        return false;
    }
}

/**
 * Get a specific card by ID
 * @param {string} cardID - Card ID to retrieve
 * @returns {Object|null} Card object or null if not found
 */
function getCardByID(cardID) {
    try {
        const cards = getAllCards();
        return cards.find(card => card.cardID === cardID) || null;
    } catch (error) {
        console.error('Error getting card:', error);
        return null;
    }
}

/**
 * Delete a card by ID
 * @param {string} cardID - Card ID to delete
 * @returns {boolean} Success status
 */
function deleteCard(cardID) {
    try {
        const cards = getAllCards();
        const filteredCards = cards.filter(card => card.cardID !== cardID);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
        return true;
    } catch (error) {
        console.error('Error deleting card:', error);
        return false;
    }
}

/**
 * Delete all travel cards
 * @returns {boolean} Success status
 */
function deleteAllCards() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error deleting all cards:', error);
        return false;
    }
}

/**
 * Update an existing card
 * @param {string} cardID - Card ID to update
 * @param {Object} updatedData - Updated card data
 * @returns {boolean} Success status
 */
function updateCard(cardID, updatedData) {
    try {
        const cards = getAllCards();
        const cardIndex = cards.findIndex(card => card.cardID === cardID);
        
        if (cardIndex !== -1) {
            cards[cardIndex] = { ...cards[cardIndex], ...updatedData };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating card:', error);
        return false;
    }
}

/**
 * Get total number of saved cards
 * @returns {number} Number of cards
 */
function getCardCount() {
    return getAllCards().length;
}

/**
 * Check if localStorage is available
 * @returns {boolean} Storage availability
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get current card data from sessionStorage (for card in progress)
 * @returns {Object|null} Current card data or null
 */
function getCurrentCard() {
    try {
        const currentCard = sessionStorage.getItem('current_travel_card');
        return currentCard ? JSON.parse(currentCard) : null;
    } catch (error) {
        console.error('Error getting current card:', error);
        return null;
    }
}

/**
 * Save current card to sessionStorage (for card in progress)
 * @param {Object} cardData - Current card data
 * @returns {boolean} Success status
 */
function setCurrentCard(cardData) {
    try {
        sessionStorage.setItem('current_travel_card', JSON.stringify(cardData));
        return true;
    } catch (error) {
        console.error('Error setting current card:', error);
        return false;
    }
}

/**
 * Clear current card from sessionStorage
 * @returns {boolean} Success status
 */
function clearCurrentCard() {
    try {
        sessionStorage.removeItem('current_travel_card');
        return true;
    } catch (error) {
        console.error('Error clearing current card:', error);
        return false;
    }
}

/**
 * Export all cards as JSON for backup
 * @returns {string} JSON string of all cards
 */
function exportCards() {
    try {
        const cards = getAllCards();
        return JSON.stringify(cards, null, 2);
    } catch (error) {
        console.error('Error exporting cards:', error);
        return '[]';
    }
}

/**
 * Import cards from JSON backup
 * @param {string} jsonData - JSON string of cards
 * @returns {boolean} Success status
 */
function importCards(jsonData) {
    try {
        const cards = JSON.parse(jsonData);
        if (Array.isArray(cards)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error importing cards:', error);
        return false;
    }
}

// ========== HELPER FUNCTION (if not in main.js scope) ==========
function generateCardID() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CARD-${timestamp}-${random}`;
}

// ========== STORAGE STATISTICS ==========
/**
 * Get storage usage statistics
 * @returns {Object} Storage stats
 */
function getStorageStats() {
    try {
        const cards = getAllCards();
        const storageSize = new Blob([JSON.stringify(cards)]).size;
        
        return {
            totalCards: cards.length,
            storageUsed: storageSize,
            storageUsedKB: (storageSize / 1024).toFixed(2),
            isAvailable: isStorageAvailable()
        };
    } catch (error) {
        console.error('Error getting storage stats:', error);
        return {
            totalCards: 0,
            storageUsed: 0,
            storageUsedKB: '0',
            isAvailable: false
        };
    }
}

// ========== EXPORT FOR MODULE USE ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllCards,
        saveCard,
        getCardByID,
        deleteCard,
        deleteAllCards,
        updateCard,
        getCardCount,
        isStorageAvailable,
        getCurrentCard,
        setCurrentCard,
        clearCurrentCard,
        exportCards,
        importCards,
        getStorageStats
    };
}
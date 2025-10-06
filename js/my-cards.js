/* ========================================
   MY-CARDS.JS - Saved Travel Cards Management
   Display, delete, and manage saved travel cards
   ======================================== */

// ========== DOM ELEMENTS ==========
const cardsDisplay = document.getElementById('cardsDisplay');
const emptyState = document.getElementById('emptyState');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const deleteModal = document.getElementById('deleteModal');
const deleteAllModal = document.getElementById('deleteAllModal');
const modalClose = document.getElementById('modalClose');
const modalCloseAll = document.getElementById('modalCloseAll');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteAllBtn = document.getElementById('confirmDeleteAllBtn');
const cancelDeleteAllBtn = document.getElementById('cancelDeleteAllBtn');

// ========== GLOBAL VARIABLES ==========
let cardToDelete = null;

// ========== LOAD AND DISPLAY CARDS ==========
window.addEventListener('DOMContentLoaded', function() {
    loadAndDisplayCards();
});

// ========== LOAD CARDS ==========
function loadAndDisplayCards() {
    const cards = getAllCards();
    
    if (cards.length === 0) {
        // Show empty state
        cardsDisplay.style.display = 'none';
        emptyState.style.display = 'block';
        deleteAllBtn.style.display = 'none';
    } else {
        // Show cards
        cardsDisplay.style.display = 'grid';
        emptyState.style.display = 'none';
        deleteAllBtn.style.display = 'inline-block';
        
        // Display all cards
        displayCards(cards);
    }
}

// ========== DISPLAY CARDS ==========
function displayCards(cards) {
    cardsDisplay.innerHTML = '';
    
    // Sort cards by timestamp (newest first)
    cards.sort((a, b) => b.timestamp - a.timestamp);
    
    cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardsDisplay.appendChild(cardElement);
    });
}

// ========== CREATE CARD ELEMENT ==========
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'saved-card';
    cardDiv.style.animationDelay = `${index * 0.1}s`;
    
    const departure = formatDateTime(card.departureDate, card.departureTime);
    
    cardDiv.innerHTML = `
        <div class="card-mini-header">
            <div class="card-icon">🚀</div>
            <div class="card-id">${card.cardID}</div>
        </div>
        
        <div class="card-info">
            <div class="card-traveler-name">${card.travelerName}</div>
            <div class="card-destination">→ ${card.destination}</div>
            <div class="card-spacecraft">via ${card.spacecraft}</div>
            <div class="card-date">Departs: ${departure}</div>
        </div>
        
        <div class="card-actions">
            <button class="card-btn card-btn-view" data-card-id="${card.cardID}">
                View
            </button>
            <button class="card-btn card-btn-flight" data-card-id="${card.cardID}">
                🚀 Fly
            </button>
            <button class="card-btn card-btn-delete" data-card-id="${card.cardID}">
                Delete
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = cardDiv.querySelector('.card-btn-view');
    const flightBtn = cardDiv.querySelector('.card-btn-flight');
    const deleteBtn = cardDiv.querySelector('.card-btn-delete');
    
    viewBtn.addEventListener('click', () => viewCard(card.cardID));
    flightBtn.addEventListener('click', () => beginFlight(card.cardID));
    deleteBtn.addEventListener('click', () => openDeleteModal(card.cardID, card));
    
    return cardDiv;
}

// ========== VIEW CARD ==========
function viewCard(cardID) {
    const card = getCardByID(cardID);
    
    if (card) {
        // Set as current card and go to review
        setCurrentCard(card);
        window.location.href = 'review-card.html';
    } else {
        showNotification('Card not found', 'error');
    }
}

// ========== BEGIN FLIGHT ==========
function beginFlight(cardID) {
    const card = getCardByID(cardID);
    
    if (card) {
        // Set as current card and go to flight
        setCurrentCard(card);
        showNotification('Preparing for departure...', 'info');
        
        setTimeout(() => {
            window.location.href = 'flight.html';
        }, 800);
    } else {
        showNotification('Card not found', 'error');
    }
}

// ========== OPEN DELETE MODAL ==========
function openDeleteModal(cardID, card) {
    cardToDelete = cardID;
    
    const modalCardInfo = document.getElementById('modalCardInfo');
    modalCardInfo.textContent = `${card.travelerName} → ${card.destination}`;
    
    deleteModal.classList.add('active');
}

// ========== CLOSE DELETE MODAL ==========
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    cardToDelete = null;
}

// ========== CONFIRM DELETE ==========
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
        if (cardToDelete) {
            if (deleteCard(cardToDelete)) {
                showNotification('Travel card deleted', 'success');
                closeDeleteModal();
                loadAndDisplayCards();
            } else {
                showNotification('Error deleting card', 'error');
            }
        }
    });
}

// ========== CANCEL DELETE ==========
if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
}

// ========== MODAL CLOSE BUTTON ==========
if (modalClose) {
    modalClose.addEventListener('click', closeDeleteModal);
}

// ========== CLICK OUTSIDE MODAL TO CLOSE ==========
if (deleteModal) {
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// ========== DELETE ALL FUNCTIONALITY ==========
if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', function() {
        deleteAllModal.classList.add('active');
    });
}

// ========== CONFIRM DELETE ALL ==========
if (confirmDeleteAllBtn) {
    confirmDeleteAllBtn.addEventListener('click', function() {
        if (deleteAllCards()) {
            showNotification('All travel cards deleted', 'success');
            deleteAllModal.classList.remove('active');
            loadAndDisplayCards();
        } else {
            showNotification('Error deleting cards', 'error');
        }
    });
}

// ========== CANCEL DELETE ALL ==========
if (cancelDeleteAllBtn) {
    cancelDeleteAllBtn.addEventListener('click', function() {
        deleteAllModal.classList.remove('active');
    });
}

// ========== CLOSE DELETE ALL MODAL ==========
if (modalCloseAll) {
    modalCloseAll.addEventListener('click', function() {
        deleteAllModal.classList.remove('active');
    });
}

// ========== CLICK OUTSIDE DELETE ALL MODAL ==========
if (deleteAllModal) {
    deleteAllModal.addEventListener('click', function(e) {
        if (e.target === deleteAllModal) {
            deleteAllModal.classList.remove('active');
        }
    });
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeDeleteModal();
        deleteAllModal.classList.remove('active');
    }
});

// ========== SEARCH/FILTER FUNCTIONALITY (BONUS) ==========
function filterCards(searchTerm) {
    const cards = getAllCards();
    const filtered = cards.filter(card => {
        const searchLower = searchTerm.toLowerCase();
        return (
            card.travelerName.toLowerCase().includes(searchLower) ||
            card.destination.toLowerCase().includes(searchLower) ||
            card.spacecraft.toLowerCase().includes(searchLower) ||
            card.cardID.toLowerCase().includes(searchLower)
        );
    });
    
    if (filtered.length === 0) {
        cardsDisplay.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No cards match your search</p>';
    } else {
        displayCards(filtered);
    }
}

// ========== EXPORT CARDS FUNCTIONALITY (BONUS) ==========
function downloadCardsAsJSON() {
    const cardsJSON = exportCards();
    const blob = new Blob([cardsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-cards-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Cards exported successfully', 'success');
}

// ========== CARD STATISTICS ==========
function displayCardStats() {
    const stats = getStorageStats();
    console.log('Card Statistics:', stats);
}

// Display stats on load (optional)
displayCardStats();
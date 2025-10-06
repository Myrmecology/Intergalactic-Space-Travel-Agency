/* ========================================
   REVIEW-CARD.JS - Travel Card Review Page
   Display and manage travel card before flight
   ======================================== */

// ========== DOM ELEMENTS ==========
const travelCardDisplay = document.getElementById('travelCardDisplay');
const saveCardBtn = document.getElementById('saveCardBtn');
const beginFlightBtn = document.getElementById('beginFlightBtn');
const editCardBtn = document.getElementById('editCardBtn');

// ========== LOAD AND DISPLAY CARD DATA ==========
window.addEventListener('DOMContentLoaded', function() {
    const cardData = getCurrentCard();
    
    if (!cardData) {
        // No card data found, redirect to create page
        showNotification('No travel card found. Please create one first.', 'error');
        setTimeout(() => {
            window.location.href = 'travel-card.html';
        }, 1500);
        return;
    }
    
    console.log('===== CARD DATA LOADED =====');
    console.log('Full Card Data:', cardData);
    console.log('===========================');
    
    displayCardData(cardData);
});

// ========== DISPLAY CARD DATA ==========
function displayCardData(cardData) {
    // Card Number
    safeSetText('cardNumber', cardData.cardID || 'CARD-XXXX-XXXX');
    
    // Traveler Information
    safeSetText('displayName', cardData.travelerName || '-');
    safeSetText('displayTravelerID', cardData.travelerID || 'N/A');
    
    // Flight Details
    safeSetText('displaySpacecraft', cardData.spacecraft || '-');
    safeSetText('displayDestination', cardData.destination || '-');
    
    // Format and display departure
    const departure = formatDateTime(cardData.departureDate, cardData.departureTime);
    safeSetText('displayDeparture', departure);
    
    // Seating
    safeSetText('displaySeatClass', cardData.seatClass || '-');
    safeSetText('displaySeatPreference', cardData.seatPreference || 'Window - View of Space');
    safeSetText('displayLegroom', cardData.extraLegroom ? 'Yes (+$299)' : 'No');
    
    // Dining
    safeSetText('displayMeal', cardData.mealPreference || '-');
    safeSetText('displayBeverage', cardData.beveragePreference || 'Space Water - Purified H2O');
    
    // Baggage
    safeSetText('displayCarryOn', `${cardData.carryOn !== undefined ? cardData.carryOn : 1} bag(s)`);
    safeSetText('displayChecked', `${cardData.checkedBags !== undefined ? cardData.checkedBags : 0} bag(s)`);
    
    // Special Accommodations
    displayAccommodations(cardData);
    
    // Entertainment
    safeSetText('displayEntertainment', cardData.entertainment || 'Ultimate Cosmic - VR, Movies, Games, Music');
    
    // Notes
    displayNotes(cardData.notes);
    
    console.log('All data displayed successfully');
}

// ========== SAFE SET TEXT HELPER ==========
function safeSetText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        console.log(`Set ${elementId}:`, text);
    } else {
        console.warn(`Element not found: ${elementId}`);
    }
}

// ========== DISPLAY SPECIAL ACCOMMODATIONS ==========
function displayAccommodations(cardData) {
    const accommodationsDiv = document.getElementById('displayAccommodations');
    if (!accommodationsDiv) {
        console.warn('Accommodations div not found');
        return;
    }
    
    const accommodations = [];
    
    if (cardData.wheelchair) accommodations.push('Wheelchair Assistance');
    if (cardData.oxygenSupport) accommodations.push('Oxygen Support');
    if (cardData.gravityAssist) accommodations.push('Gravity Adjustment Support');
    
    if (accommodations.length > 0) {
        accommodationsDiv.innerHTML = accommodations
            .map(acc => `<span class="badge">${acc}</span>`)
            .join('');
    } else {
        accommodationsDiv.innerHTML = '<p class="no-data">None requested</p>';
    }
}

// ========== DISPLAY NOTES ==========
function displayNotes(notes) {
    const notesDiv = document.getElementById('displayNotes');
    if (!notesDiv) {
        console.warn('Notes div not found');
        return;
    }
    
    if (notes && notes !== 'None' && notes.trim() !== '') {
        notesDiv.innerHTML = `<p>${notes}</p>`;
    } else {
        notesDiv.innerHTML = '<p class="no-data">No special requests</p>';
    }
}

// ========== SAVE CARD BUTTON ==========
if (saveCardBtn) {
    saveCardBtn.addEventListener('click', function() {
        const cardData = getCurrentCard();
        
        if (!cardData) {
            showNotification('No card data to save', 'error');
            return;
        }
        
        // Check if already saved
        const existingCard = getCardByID(cardData.cardID);
        
        if (existingCard) {
            showNotification('This card is already saved!', 'info');
            saveCardBtn.innerHTML = '<span>✓ Already Saved</span>';
            return;
        }
        
        // Save to localStorage
        if (saveCard(cardData)) {
            showNotification('Travel card saved successfully!', 'success');
            
            // Add visual feedback
            saveCardBtn.innerHTML = '<span>✓ Saved!</span>';
            saveCardBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
            
            setTimeout(() => {
                saveCardBtn.innerHTML = '<span>Save Travel Card</span><div class="btn-shine"></div>';
                saveCardBtn.style.background = '';
            }, 2000);
        } else {
            showNotification('Error saving travel card', 'error');
        }
    });
}

// ========== BEGIN FLIGHT BUTTON ==========
if (beginFlightBtn) {
    beginFlightBtn.addEventListener('click', function() {
        const cardData = getCurrentCard();
        
        if (!cardData) {
            showNotification('No card data found', 'error');
            return;
        }
        
        // Optional: Save card before flight if not already saved
        const existingCard = getCardByID(cardData.cardID);
        
        if (!existingCard) {
            const confirmSave = confirm('Would you like to save this travel card before your flight?');
            if (confirmSave) {
                saveCard(cardData);
                showNotification('Card saved!', 'success');
            }
        }
        
        // Add loading animation
        beginFlightBtn.innerHTML = '<span>🚀 Preparing Launch...</span>';
        beginFlightBtn.style.pointerEvents = 'none';
        
        // Redirect to flight page
        setTimeout(() => {
            window.location.href = 'flight.html';
        }, 1000);
    });
}

// ========== EDIT CARD BUTTON ==========
if (editCardBtn) {
    editCardBtn.addEventListener('click', function() {
        // Redirect back to form
        window.location.href = 'travel-card.html';
    });
}

// ========== BARCODE ANIMATION ==========
function animateBarcode() {
    const barcode = document.querySelector('.barcode');
    if (barcode) {
        setInterval(() => {
            barcode.style.opacity = '0.7';
            setTimeout(() => {
                barcode.style.opacity = '1';
            }, 200);
        }, 3000);
    }
}

// Initialize barcode animation
animateBarcode();

// ========== CARD GLOW EFFECT ==========
const travelCard = document.querySelector('.travel-card');
if (travelCard) {
    travelCard.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.5)';
    });
    
    travelCard.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
}

// ========== PREVENT BACK NAVIGATION LOSS ==========
window.addEventListener('beforeunload', function(e) {
    const cardData = getCurrentCard();
    if (!cardData) return;
    
    const isSaved = getCardByID(cardData.cardID);
    
    if (cardData && !isSaved) {
        // Warn user they haven't saved
        e.preventDefault();
        e.returnValue = 'You have an unsaved travel card. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // S key to save
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (saveCardBtn) saveCardBtn.click();
    }
    
    // Enter key to begin flight
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (beginFlightBtn) beginFlightBtn.click();
    }
    
    // Escape key to edit
    if (e.key === 'Escape') {
        if (editCardBtn) editCardBtn.click();
    }
});

// ========== PRINT CARD FUNCTIONALITY (BONUS) ==========
function printCard() {
    window.print();
}

// Add print styles if needed
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .action-buttons,
        .back-btn,
        .page-header .subtitle {
            display: none !important;
        }
        .travel-card {
            box-shadow: none !important;
            border: 2px solid #000 !important;
        }
    }
`;
document.head.appendChild(printStyles);
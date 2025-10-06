/* ========================================
   TRAVEL-CARD.JS - Travel Card Form Handler
   Form validation, data collection, and submission
   ======================================== */

// ========== DOM ELEMENTS ==========
const travelCardForm = document.getElementById('travelCardForm');
const destinationType = document.getElementById('destinationType');
const destination = document.getElementById('destination');

// ========== FORM SUBMISSION HANDLER ==========
if (travelCardForm) {
    travelCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = collectFormData();
        
        // Validate form
        const validation = validateTravelCardForm(formData);
        if (!validation.valid) {
            showNotification(validation.message, 'error');
            return;
        }
        
        // Save to sessionStorage for review
        if (setCurrentCard(formData)) {
            showNotification('Travel card created successfully!', 'success');
            // Redirect to review page
            setTimeout(() => {
                window.location.href = 'review-card.html';
            }, 500);
        } else {
            showNotification('Error creating travel card. Please try again.', 'error');
        }
    });
}

// ========== COLLECT FORM DATA ==========
function collectFormData() {
    // Get all form values
    const formData = {
        // Personal Information
        travelerName: document.getElementById('travelerName').value.trim(),
        travelerID: document.getElementById('travelerID').value.trim() || 'N/A',
        
        // Spacecraft
        spacecraft: document.getElementById('spacecraft').value,
        
        // Destination
        destinationType: document.getElementById('destinationType').value,
        destination: document.getElementById('destination').value,
        
        // Flight Preferences
        departureDate: document.getElementById('departureDate').value,
        departureTime: document.getElementById('departureTime').value,
        
        // Seating
        seatClass: document.getElementById('seatClass').value,
        seatPreference: document.getElementById('seatPreference').value,
        extraLegroom: document.getElementById('extraLegroom').checked,
        
        // Meals
        mealPreference: document.getElementById('mealPreference').value,
        beveragePreference: document.getElementById('beveragePreference').value,
        
        // Baggage
        carryOn: parseInt(document.getElementById('carryOn').value) || 0,
        checkedBags: parseInt(document.getElementById('checkedBags').value) || 0,
        
        // Special Accommodations
        wheelchair: document.getElementById('wheelchair').checked,
        oxygenSupport: document.getElementById('oxygenSupport').checked,
        gravityAssist: document.getElementById('gravityAssist').checked,
        
        // Entertainment
        entertainment: document.getElementById('entertainment').value,
        
        // Notes
        notes: document.getElementById('notes').value.trim() || 'None',
        
        // Metadata
        cardID: generateCardID(),
        timestamp: Date.now()
    };
    
    return formData;
}

// ========== FORM VALIDATION ==========
function validateTravelCardForm(formData) {
    // Required fields
    const requiredFields = [
        { field: 'travelerName', label: 'Traveler Name' },
        { field: 'spacecraft', label: 'Spacecraft' },
        { field: 'destinationType', label: 'Destination Type' },
        { field: 'destination', label: 'Destination' },
        { field: 'departureDate', label: 'Departure Date' },
        { field: 'departureTime', label: 'Departure Time' },
        { field: 'seatClass', label: 'Seat Class' },
        { field: 'mealPreference', label: 'Meal Preference' }
    ];
    
    // Check required fields
    for (const { field, label } of requiredFields) {
        if (!formData[field] || formData[field] === '') {
            return { 
                valid: false, 
                message: `Please fill in: ${label}` 
            };
        }
    }
    
    // Validate departure date is not in the past
    const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
    const now = new Date();
    
    if (departureDateTime < now) {
        return { 
            valid: false, 
            message: 'Departure date and time must be in the future' 
        };
    }
    
    // Validate traveler name (at least 2 characters)
    if (formData.travelerName.length < 2) {
        return { 
            valid: false, 
            message: 'Traveler name must be at least 2 characters' 
        };
    }
    
    return { valid: true };
}

// ========== DESTINATION TYPE HANDLER ==========
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

// ========== AUTO-SAVE FUNCTIONALITY (OPTIONAL) ==========
let autoSaveTimeout;

function autoSaveForm() {
    clearTimeout(autoSaveTimeout);
    
    autoSaveTimeout = setTimeout(() => {
        const formData = collectFormData();
        
        // Only auto-save if at least name is filled
        if (formData.travelerName) {
            sessionStorage.setItem('autosave_travel_card', JSON.stringify(formData));
            console.log('Form auto-saved');
        }
    }, 2000); // Auto-save after 2 seconds of inactivity
}

// Add auto-save listeners to all form inputs
if (travelCardForm) {
    const formInputs = travelCardForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
        input.addEventListener('change', autoSaveForm);
    });
}

// ========== RESTORE AUTO-SAVED DATA ==========
window.addEventListener('DOMContentLoaded', function() {
    const autoSavedData = sessionStorage.getItem('autosave_travel_card');
    
    if (autoSavedData && travelCardForm) {
        try {
            const data = JSON.parse(autoSavedData);
            
            // Ask user if they want to restore
            const restore = confirm('You have unsaved form data. Would you like to restore it?');
            
            if (restore) {
                restoreFormData(data);
                showNotification('Form data restored!', 'info');
            } else {
                sessionStorage.removeItem('autosave_travel_card');
            }
        } catch (error) {
            console.error('Error restoring form data:', error);
        }
    }
    
    // Set minimum date to today
    const departureDateInput = document.getElementById('departureDate');
    if (departureDateInput) {
        const today = new Date().toISOString().split('T')[0];
        departureDateInput.setAttribute('min', today);
    }
});

// ========== RESTORE FORM DATA ==========
function restoreFormData(data) {
    // Personal Information
    if (data.travelerName) document.getElementById('travelerName').value = data.travelerName;
    if (data.travelerID && data.travelerID !== 'N/A') document.getElementById('travelerID').value = data.travelerID;
    
    // Spacecraft
    if (data.spacecraft) document.getElementById('spacecraft').value = data.spacecraft;
    
    // Destination
    if (data.destinationType) {
        document.getElementById('destinationType').value = data.destinationType;
        // Trigger change event to populate destinations
        destinationType.dispatchEvent(new Event('change'));
        setTimeout(() => {
            if (data.destination) document.getElementById('destination').value = data.destination;
        }, 100);
    }
    
    // Flight Preferences
    if (data.departureDate) document.getElementById('departureDate').value = data.departureDate;
    if (data.departureTime) document.getElementById('departureTime').value = data.departureTime;
    
    // Seating
    if (data.seatClass) document.getElementById('seatClass').value = data.seatClass;
    if (data.seatPreference) document.getElementById('seatPreference').value = data.seatPreference;
    if (data.extraLegroom) document.getElementById('extraLegroom').checked = data.extraLegroom;
    
    // Meals
    if (data.mealPreference) document.getElementById('mealPreference').value = data.mealPreference;
    if (data.beveragePreference) document.getElementById('beveragePreference').value = data.beveragePreference;
    
    // Baggage
    if (data.carryOn !== undefined) document.getElementById('carryOn').value = data.carryOn;
    if (data.checkedBags !== undefined) document.getElementById('checkedBags').value = data.checkedBags;
    
    // Special Accommodations
    if (data.wheelchair) document.getElementById('wheelchair').checked = data.wheelchair;
    if (data.oxygenSupport) document.getElementById('oxygenSupport').checked = data.oxygenSupport;
    if (data.gravityAssist) document.getElementById('gravityAssist').checked = data.gravityAssist;
    
    // Entertainment
    if (data.entertainment) document.getElementById('entertainment').value = data.entertainment;
    
    // Notes
    if (data.notes && data.notes !== 'None') document.getElementById('notes').value = data.notes;
}

// ========== FORM RESET HANDLER ==========
if (travelCardForm) {
    travelCardForm.addEventListener('reset', function() {
        sessionStorage.removeItem('autosave_travel_card');
        destination.disabled = true;
        destination.innerHTML = '<option value="">First select a destination type...</option>';
        showNotification('Form reset successfully', 'info');
    });
}
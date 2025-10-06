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
        
        console.log('===== FORM SUBMITTED =====');
        
        // Collect form data
        const formData = collectFormData();
        
        // Log form data for debugging
        console.log('Collected Form Data:', JSON.stringify(formData, null, 2));
        
        // Validate form
        const validation = validateTravelCardForm(formData);
        if (!validation.valid) {
            console.log('Validation failed:', validation.message);
            showNotification(validation.message, 'error');
            return;
        }
        
        console.log('Validation passed!');
        
        // Save to sessionStorage for review
        try {
            sessionStorage.setItem('current_travel_card', JSON.stringify(formData));
            console.log('Data saved to sessionStorage');
            
            // Verify it was saved
            const saved = sessionStorage.getItem('current_travel_card');
            console.log('Verified saved data:', saved);
            
            showNotification('Travel card created successfully!', 'success');
            
            // Redirect to review page
            setTimeout(() => {
                window.location.href = 'review-card.html';
            }, 500);
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            showNotification('Error creating travel card. Please try again.', 'error');
        }
    });
}

// ========== COLLECT FORM DATA ==========
function collectFormData() {
    console.log('Collecting form data...');
    
    const formData = {};
    
    // Personal Information
    const travelerName = document.getElementById('travelerName');
    formData.travelerName = travelerName ? travelerName.value.trim() : '';
    console.log('Traveler Name:', formData.travelerName);
    
    const travelerID = document.getElementById('travelerID');
    formData.travelerID = travelerID ? (travelerID.value.trim() || 'N/A') : 'N/A';
    console.log('Traveler ID:', formData.travelerID);
    
    // Spacecraft
    const spacecraft = document.getElementById('spacecraft');
    formData.spacecraft = spacecraft ? spacecraft.value : '';
    console.log('Spacecraft:', formData.spacecraft);
    
    // Destination
    const destinationType = document.getElementById('destinationType');
    formData.destinationType = destinationType ? destinationType.value : '';
    console.log('Destination Type:', formData.destinationType);
    
    const destination = document.getElementById('destination');
    formData.destination = destination ? destination.value : '';
    console.log('Destination:', formData.destination);
    
    // Flight Preferences
    const departureDate = document.getElementById('departureDate');
    formData.departureDate = departureDate ? departureDate.value : '';
    console.log('Departure Date:', formData.departureDate);
    
    const departureTime = document.getElementById('departureTime');
    formData.departureTime = departureTime ? departureTime.value : '';
    console.log('Departure Time:', formData.departureTime);
    
    // Seating
    const seatClass = document.getElementById('seatClass');
    formData.seatClass = seatClass ? seatClass.value : '';
    console.log('Seat Class:', formData.seatClass);
    
    const seatPreference = document.getElementById('seatPreference');
    formData.seatPreference = seatPreference ? seatPreference.value : 'Window - View of Space';
    console.log('Seat Preference:', formData.seatPreference);
    
    const extraLegroom = document.getElementById('extraLegroom');
    formData.extraLegroom = extraLegroom ? extraLegroom.checked : false;
    console.log('Extra Legroom:', formData.extraLegroom);
    
    // Meals
    const mealPreference = document.getElementById('mealPreference');
    formData.mealPreference = mealPreference ? mealPreference.value : '';
    console.log('Meal Preference:', formData.mealPreference);
    
    const beveragePreference = document.getElementById('beveragePreference');
    formData.beveragePreference = beveragePreference ? beveragePreference.value : 'Space Water - Purified H2O';
    console.log('Beverage Preference:', formData.beveragePreference);
    
    // Baggage
    const carryOn = document.getElementById('carryOn');
    formData.carryOn = carryOn ? parseInt(carryOn.value) || 1 : 1;
    console.log('Carry On:', formData.carryOn);
    
    const checkedBags = document.getElementById('checkedBags');
    formData.checkedBags = checkedBags ? parseInt(checkedBags.value) || 0 : 0;
    console.log('Checked Bags:', formData.checkedBags);
    
    // Special Accommodations
    const wheelchair = document.getElementById('wheelchair');
    formData.wheelchair = wheelchair ? wheelchair.checked : false;
    console.log('Wheelchair:', formData.wheelchair);
    
    const oxygenSupport = document.getElementById('oxygenSupport');
    formData.oxygenSupport = oxygenSupport ? oxygenSupport.checked : false;
    console.log('Oxygen Support:', formData.oxygenSupport);
    
    const gravityAssist = document.getElementById('gravityAssist');
    formData.gravityAssist = gravityAssist ? gravityAssist.checked : false;
    console.log('Gravity Assist:', formData.gravityAssist);
    
    // Entertainment
    const entertainment = document.getElementById('entertainment');
    formData.entertainment = entertainment ? entertainment.value : 'Ultimate Cosmic - VR, Movies, Games, Music';
    console.log('Entertainment:', formData.entertainment);
    
    // Notes
    const notes = document.getElementById('notes');
    formData.notes = notes ? (notes.value.trim() || 'None') : 'None';
    console.log('Notes:', formData.notes);
    
    // Metadata
    formData.cardID = generateCardID();
    formData.timestamp = Date.now();
    
    console.log('Final form data object:', formData);
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

// ========== AUTO-SAVE FUNCTIONALITY ==========
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
    }, 2000);
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
    if (data.travelerName) {
        const el = document.getElementById('travelerName');
        if (el) el.value = data.travelerName;
    }
    if (data.travelerID && data.travelerID !== 'N/A') {
        const el = document.getElementById('travelerID');
        if (el) el.value = data.travelerID;
    }
    if (data.spacecraft) {
        const el = document.getElementById('spacecraft');
        if (el) el.value = data.spacecraft;
    }
    if (data.destinationType) {
        const el = document.getElementById('destinationType');
        if (el) {
            el.value = data.destinationType;
            el.dispatchEvent(new Event('change'));
            setTimeout(() => {
                if (data.destination) {
                    const destEl = document.getElementById('destination');
                    if (destEl) destEl.value = data.destination;
                }
            }, 100);
        }
    }
    if (data.departureDate) {
        const el = document.getElementById('departureDate');
        if (el) el.value = data.departureDate;
    }
    if (data.departureTime) {
        const el = document.getElementById('departureTime');
        if (el) el.value = data.departureTime;
    }
    if (data.seatClass) {
        const el = document.getElementById('seatClass');
        if (el) el.value = data.seatClass;
    }
    if (data.seatPreference) {
        const el = document.getElementById('seatPreference');
        if (el) el.value = data.seatPreference;
    }
    if (data.extraLegroom) {
        const el = document.getElementById('extraLegroom');
        if (el) el.checked = data.extraLegroom;
    }
    if (data.mealPreference) {
        const el = document.getElementById('mealPreference');
        if (el) el.value = data.mealPreference;
    }
    if (data.beveragePreference) {
        const el = document.getElementById('beveragePreference');
        if (el) el.value = data.beveragePreference;
    }
    if (data.carryOn !== undefined) {
        const el = document.getElementById('carryOn');
        if (el) el.value = data.carryOn;
    }
    if (data.checkedBags !== undefined) {
        const el = document.getElementById('checkedBags');
        if (el) el.value = data.checkedBags;
    }
    if (data.wheelchair) {
        const el = document.getElementById('wheelchair');
        if (el) el.checked = data.wheelchair;
    }
    if (data.oxygenSupport) {
        const el = document.getElementById('oxygenSupport');
        if (el) el.checked = data.oxygenSupport;
    }
    if (data.gravityAssist) {
        const el = document.getElementById('gravityAssist');
        if (el) el.checked = data.gravityAssist;
    }
    if (data.entertainment) {
        const el = document.getElementById('entertainment');
        if (el) el.value = data.entertainment;
    }
    if (data.notes && data.notes !== 'None') {
        const el = document.getElementById('notes');
        if (el) el.value = data.notes;
    }
}

// ========== FORM RESET HANDLER ==========
if (travelCardForm) {
    travelCardForm.addEventListener('reset', function() {
        sessionStorage.removeItem('autosave_travel_card');
        const destEl = document.getElementById('destination');
        if (destEl) {
            destEl.disabled = true;
            destEl.innerHTML = '<option value="">First select a destination type...</option>';
        }
        showNotification('Form reset successfully', 'info');
    });
}
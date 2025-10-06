/* ========================================
   FLIGHT.JS - Immersive Flight Sequence
   Three.js 3D visualization with Web Audio API
   ======================================== */

// ========== GLOBAL VARIABLES ==========
let scene, camera, renderer;
let spacecraft, planet, particles, laserLines, strobeLight;
let animationId;
let flightProgress = 0;
let flightDuration = 300; // 5 minutes in seconds
let startTime;
let audioContext, audioEnabled = true;
let oscillators = [];
let cardData;
let currentSpeed = 0;

// ========== INITIALIZE FLIGHT SEQUENCE ==========
window.addEventListener('DOMContentLoaded', function() {
    cardData = getCurrentCard();
    
    if (!cardData) {
        showNotification('No travel card found', 'error');
        setTimeout(() => {
            window.location.href = 'travel-card.html';
        }, 1500);
        return;
    }
    
    // Update HUD with card data
    updateHUD();
    
    // Initialize Three.js scene
    setTimeout(() => {
        initThreeJS();
        initAudio();
        startFlight();
        hideLoadingScreen();
    }, 1000);
});

// ========== UPDATE HUD ==========
function updateHUD() {
    document.getElementById('hudDestination').textContent = cardData.destination || '-';
    document.getElementById('hudSpacecraft').textContent = cardData.spacecraft || '-';
}

// ========== INITIALIZE THREE.JS ==========
function initThreeJS() {
    const container = document.getElementById('canvasContainer');
    
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    camera.position.z = 50;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00d4ff, 3, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create starfield
    createStarfield();
    
    // Create spacecraft
    createSpacecraft();
    
    // Create destination planet
    createDestinationPlanet();
    
    // Create particle system
    createParticles();
    
    // Create laser effects
    createLasers();
    
    // Create strobe light
    createStrobeLight();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// ========== CREATE STARFIELD ==========
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// ========== CREATE SPACECRAFT ==========
function createSpacecraft() {
    const group = new THREE.Group();
    
    // Main body (cone)
    const bodyGeometry = new THREE.ConeGeometry(3, 10, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x003344,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI;
    group.add(body);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(12, 0.5, 4);
    const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0x9d4edd,
        emissive: 0x220044
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.y = -2;
    group.add(wings);
    
    // Engine glow
    const engineGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const engineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.8
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.y = 5;
    group.add(engine);
    
    group.position.set(0, -10, 20);
    spacecraft = group;
    scene.add(spacecraft);
}

// ========== CREATE DESTINATION PLANET ==========
function createDestinationPlanet() {
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff6b35,
        emissive: 0x331100,
        shininess: 50
    });
    
    planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, -500);
    scene.add(planet);
}

// ========== CREATE PARTICLES ==========
function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = Math.random() * -200;
        particlesVertices.push(x, y, z);
    }
    
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

// ========== CREATE LASER EFFECTS ==========
function createLasers() {
    laserLines = [];
    
    for (let i = 0; i < 20; i++) {
        const points = [];
        points.push(new THREE.Vector3(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            Math.random() * -100
        ));
        points.push(new THREE.Vector3(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            Math.random() * -100 - 50
        ));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: Math.random() > 0.5 ? 0x00d4ff : 0xff006e,
            transparent: true,
            opacity: 0.6
        });
        
        const line = new THREE.Line(geometry, material);
        laserLines.push(line);
        scene.add(line);
    }
}

// ========== CREATE STROBE LIGHT ==========
function createStrobeLight() {
    strobeLight = new THREE.PointLight(0xffffff, 0, 100);
    strobeLight.position.set(0, 0, 30);
    scene.add(strobeLight);
}

// ========== INITIALIZE AUDIO ==========
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createEngineSound();
        createAmbientDrone();
    } catch (error) {
        console.error('Audio initialization failed:', error);
        audioEnabled = false;
    }
}

// ========== CREATE ENGINE SOUND ==========
function createEngineSound() {
    if (!audioContext || !audioEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillators.push({ osc: oscillator, gain: gainNode });
}

// ========== CREATE AMBIENT DRONE ==========
function createAmbientDrone() {
    if (!audioContext || !audioEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillators.push({ osc: oscillator, gain: gainNode });
}

// ========== START FLIGHT ==========
function startFlight() {
    startTime = Date.now();
    updateFlightStatus('INITIATING WARP DRIVE');
    animate();
}

// ========== ANIMATION LOOP ==========
function animate() {
    animationId = requestAnimationFrame(animate);
    
    const elapsed = (Date.now() - startTime) / 1000;
    flightProgress = Math.min(elapsed / flightDuration, 1);
    
    // Update progress bar
    updateProgressBar(flightProgress);
    
    // Update speed
    currentSpeed = (0.1 + flightProgress * 0.8).toFixed(1);
    document.getElementById('hudSpeed').textContent = `${currentSpeed}c`;
    
    // Rotate spacecraft
    if (spacecraft) {
        spacecraft.rotation.y += 0.01;
        spacecraft.rotation.z = Math.sin(elapsed * 0.5) * 0.1;
    }
    
    // Rotate planet
    if (planet) {
        planet.rotation.y += 0.002;
        planet.position.z = -500 + (flightProgress * 520);
        planet.scale.set(1 + flightProgress * 3, 1 + flightProgress * 3, 1 + flightProgress * 3);
    }
    
    // Animate particles (warp effect)
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += 2 + flightProgress * 5; // Speed increases with progress
            if (positions[i + 2] > 50) {
                positions[i + 2] = -200;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate lasers
    laserLines.forEach((line, i) => {
        line.rotation.z += 0.01;
        line.position.z += 1 + Math.sin(elapsed + i) * 0.5;
        if (line.position.z > 50) {
            line.position.z = -100;
        }
    });
    
    // Strobe effect
    if (strobeLight && Math.random() > 0.95) {
        strobeLight.intensity = Math.random() * 5;
        setTimeout(() => { if (strobeLight) strobeLight.intensity = 0; }, 50);
    }
    
    // Camera shake at high speed
    if (flightProgress > 0.7) {
        camera.position.x = (Math.random() - 0.5) * 0.5;
        camera.position.y = (Math.random() - 0.5) * 0.5;
    }
    
    // Update flight status
    updateFlightStatusByProgress(flightProgress);
    
    // Check if flight complete
    if (flightProgress >= 1) {
        completeFlightSequence();
    }
    
    renderer.render(scene, camera);
}

// ========== UPDATE PROGRESS BAR ==========
function updateProgressBar(progress) {
    const percent = Math.floor(progress * 100);
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
    
    const remaining = Math.max(0, flightDuration - ((Date.now() - startTime) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    document.getElementById('timeRemaining').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ========== UPDATE FLIGHT STATUS ==========
function updateFlightStatus(status) {
    document.getElementById('flightStatus').textContent = status;
}

function updateFlightStatusByProgress(progress) {
    if (progress < 0.2) updateFlightStatus('ACCELERATING TO WARP SPEED');
    else if (progress < 0.4) updateFlightStatus('ENTERING HYPERSPACE');
    else if (progress < 0.6) updateFlightStatus('CRUISING AT MAXIMUM VELOCITY');
    else if (progress < 0.8) updateFlightStatus('APPROACHING DESTINATION');
    else if (progress < 1) updateFlightStatus('INITIATING DECELERATION');
}

// ========== SPEED UP BUTTON ==========
document.getElementById('speedUpBtn').addEventListener('click', function() {
    flightProgress = 1;
    updateProgressBar(1);
    completeFlightSequence();
});

// ========== AUDIO TOGGLE ==========
document.getElementById('toggleAudioBtn').addEventListener('click', function() {
    audioEnabled = !audioEnabled;
    const icon = document.getElementById('audioIcon');
    
    if (audioEnabled) {
        icon.textContent = '🔊';
        oscillators.forEach(osc => osc.gain.gain.setValueAtTime(0.1, audioContext.currentTime));
    } else {
        icon.textContent = '🔇';
        oscillators.forEach(osc => osc.gain.gain.setValueAtTime(0, audioContext.currentTime));
    }
});

// ========== COMPLETE FLIGHT ==========
function completeFlightSequence() {
    cancelAnimationFrame(animationId);
    
    // Stop audio
    oscillators.forEach(osc => {
        osc.osc.stop();
    });
    
    // Calculate stats
    const distance = calculateDistance(cardData.destination);
    const flightTime = formatFlightTime((Date.now() - startTime) / 1000);
    const maxSpeed = `${currentSpeed}c`;
    
    // Update arrival screen
    document.getElementById('arrivalDestination').textContent = cardData.destination;
    document.getElementById('distanceTraveled').textContent = distance;
    document.getElementById('flightTime').textContent = flightTime;
    document.getElementById('maxSpeed').textContent = maxSpeed;
    
    // Show arrival screen
    document.getElementById('arrivalScreen').style.display = 'flex';
    
    // Clear current card from session
    clearCurrentCard();
}

// ========== FORMAT FLIGHT TIME ==========
function formatFlightTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
}

// ========== WINDOW RESIZE ==========
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========== HIDE LOADING SCREEN ==========
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ========== CLEANUP ON PAGE UNLOAD ==========
window.addEventListener('beforeunload', function() {
    if (animationId) cancelAnimationFrame(animationId);
    oscillators.forEach(osc => osc.osc.stop());
    if (renderer) renderer.dispose();
});
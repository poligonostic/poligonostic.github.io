// ========================================
// 3D Universe Explorer - Three.js Project
// ========================================

let scene, camera, renderer, controls;
let stars = [];
let planets = [];
let asteroids = [];
let animationEnabled = true;
let starsVisible = true;
let frameCount = 0;
let lastTime = Date.now();

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    scene.fog = new THREE.FogExp2(0x000011, 0.0008);

    // Camera setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(0, 50, 80);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.body.appendChild(renderer.domElement);

    // Lighting
    setupLighting();

    // Controls
    setupControls();

    // Create universe
    createStarfield();
    createPlanets();
    createAsteroids();
    createSpaceStation();

    // Event listeners
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Sun light
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 500);
    sunLight.position.set(0, 50, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Additional distant lights
    const blueLight = new THREE.PointLight(0x4488ff, 0.5, 300);
    blueLight.position.set(-100, 30, -100);
    scene.add(blueLight);

    const redLight = new THREE.PointLight(0xff4488, 0.5, 300);
    redLight.position.set(100, 30, 100);
    scene.add(redLight);
}

function setupControls() {
    // Simple orbit-like controls with mouse
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            const direction = camera.position.clone().normalize();
            const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
            const up = camera.up.clone();

            camera.position.applyAxisAngle(up, deltaX * 0.005);
            camera.position.applyAxisAngle(right, deltaY * 0.005);

            camera.lookAt(scene.position);
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Zoom with scroll
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        const speed = 2;
        const direction = camera.position.clone().normalize();
        if (e.deltaY > 0) {
            camera.position.addScaledVector(direction, speed);
        } else {
            camera.position.addScaledVector(direction, -speed);
        }
    }, { passive: false });
}

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;

        const brightness = Math.random();
        colors[i] = brightness;
        colors[i + 1] = brightness;
        colors[i + 2] = brightness * 0.8 + 0.2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createPlanets() {
    const planetData = [
        { name: 'Mercury', size: 3.8, distance: 30, speed: 0.04, color: 0x8c7853, texture: null },
        { name: 'Venus', size: 9.5, distance: 50, speed: 0.015, color: 0xffc649, texture: null },
        { name: 'Earth', size: 10, distance: 75, speed: 0.01, color: 0x4488ff, texture: null },
        { name: 'Mars', size: 5.3, distance: 95, speed: 0.008, color: 0xff5533, texture: null },
        { name: 'Jupiter', size: 25, distance: 130, speed: 0.002, color: 0xc88b3a, texture: null },
        { name: 'Saturn', size: 21, distance: 160, speed: 0.0009, color: 0xf4d9a6, hasRings: true, texture: null }
    ];

    planetData.forEach((data, index) => {
        const geometry = new THREE.IcosahedronGeometry(data.size, 32);
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.7,
            metalness: 0.3
        });

        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        planet.userData = {
            distance: data.distance,
            speed: data.speed,
            angle: Math.random() * Math.PI * 2,
            name: data.name,
            rotationSpeed: Math.random() * 0.01 + 0.001
        };

        if (data.hasRings) {
            const ringGeometry = new THREE.TorusGeometry(data.size * 1.8, data.size * 0.4, 32, 128);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0xb89968,
                side: THREE.DoubleSide,
                roughness: 0.8
            });
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI * 0.4;
            planet.add(rings);
        }

        planets.push(planet);
        scene.add(planet);

        // Add planet label
        addPlanetLabel(planet, data.name);
    });
}

function createAsteroids() {
    const asteroidBelt = [];
    const asteroidCount = 200;
    const beltDistance = 120;
    const beltThickness = 15;

    for (let i = 0; i < asteroidCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
            roughness: 0.8,
            metalness: 0.2
        });

        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.castShadow = true;
        asteroid.receiveShadow = true;

        const angle = Math.random() * Math.PI * 2;
        const distance = beltDistance + (Math.random() - 0.5) * beltThickness;
        const height = (Math.random() - 0.5) * beltThickness;

        asteroid.position.set(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
        );

        asteroid.userData = {
            angle: angle,
            distance: distance,
            height: height,
            rotationAxis: new THREE.Vector3(
                Math.random(),
                Math.random(),
                Math.random()
            ).normalize(),
            rotationSpeed: Math.random() * 0.1
        };

        asteroids.push(asteroid);
        scene.add(asteroid);
    }
}

function createSpaceStation() {
    const stationGroup = new THREE.Group();

    // Main structure
    const mainGeometry = new THREE.BoxGeometry(20, 10, 5);
    const mainMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.8,
        roughness: 0.2
    });
    const main = new THREE.Mesh(mainGeometry, mainMaterial);
    main.castShadow = true;
    main.receiveShadow = true;
    stationGroup.add(main);

    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(15, 0.5, 3);
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x2288ff,
        metalness: 0.9,
        roughness: 0.1
    });

    for (let i = 0; i < 2; i++) {
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.y = 6 + i * 3;
        panel.castShadow = true;
        panel.receiveShadow = true;
        stationGroup.add(panel);
    }

    // Antenna
    const antennaGeometry = new THREE.ConeGeometry(0.5, 8, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 12, 0);
    antenna.castShadow = true;
    stationGroup.add(antenna);

    stationGroup.position.set(40, 30, 50);
    stationGroup.userData = {
        rotationSpeed: 0.001,
        orbitAngle: 0,
        orbitRadius: 100
    };

    scene.add(stationGroup);
}

function addPlanetLabel(planet, name) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.font = 'Bold 40px Arial';
    context.textAlign = 'center';
    context.fillText(name, 128, 45);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(20, 5, 1);
    sprite.position.y = planet.geometry.parameters.radius + 10;
    planet.add(sprite);
}

function animate() {
    requestAnimationFrame(animate);

    if (animationEnabled) {
        // Update planets
        planets.forEach(planet => {
            planet.userData.angle += planet.userData.speed;
            planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
            planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
            planet.rotation.y += planet.userData.rotationSpeed;
        });

        // Update asteroids
        asteroids.forEach(asteroid => {
            asteroid.rotation.multiplyQuaternions(
                asteroid.quaternion,
                new THREE.Quaternion().setFromAxisAngle(
                    asteroid.userData.rotationAxis,
                    asteroid.userData.rotationSpeed
                )
            );
        });

        // Update space station
        scene.children.forEach(child => {
            if (child.userData.orbitRadius) {
                child.userData.orbitAngle += 0.0002;
                child.position.x = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.position.z = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.rotation.y += child.userData.rotationSpeed;
            }
        });

        // Subtle star field rotation
        stars.rotation.y += 0.00001;
    }

    // Update stats
    frameCount++;
    const now = Date.now();
    if (now - lastTime >= 1000) {
        document.getElementById('fps').textContent = frameCount;
        document.getElementById('objectCount').textContent = scene.children.length + planets.length + asteroids.length;
        frameCount = 0;
        lastTime = now;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Control functions
function toggleAnimation() {
    animationEnabled = !animationEnabled;
    console.log('Animation:', animationEnabled ? 'ON' : 'OFF');
}

function resetView() {
    camera.position.set(0, 50, 80);
    camera.lookAt(scene.position);
}

function toggleStars() {
    starsVisible = !starsVisible;
    stars.visible = starsVisible;
    console.log('Stars:', starsVisible ? 'ON' : 'OFF');
}

// Initialize on page load
window.addEventListener('load', init);
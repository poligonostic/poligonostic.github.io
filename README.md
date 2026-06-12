# 🌌 3D Universe Explorer - Three.js Project

A stunning interactive 3D universe visualization built with **Three.js**. Explore planets, asteroids, a space station, and thousands of stars in a fully interactive 3D environment.

## Features

✨ **Interactive Visualization**
- 🪐 **Solar System** with 6 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn)
- 🌍 Realistic orbital mechanics and rotations
- 💫 5,000 procedurally generated stars
- 🛸 Dynamic space station with solar panels
- ☄️ 200 asteroids in an asteroid belt
- 🔦 Advanced lighting with multiple light sources

🎮 **User Controls**
- **Mouse Drag**: Rotate view around the scene
- **Mouse Scroll**: Zoom in/out
- **Toggle Animation**: Pause/resume universe movement
- **Reset View**: Return to default camera position
- **Toggle Stars**: Show/hide starfield

📊 **Real-time Statistics**
- FPS counter
- Object count display
- Performance monitoring

## Technical Highlights

- **Three.js Library**: 3D graphics rendering
- **WebGL**: Hardware-accelerated rendering
- **Responsive Design**: Works on all screen sizes
- **Shadow Mapping**: Realistic lighting with shadows
- **Procedural Generation**: Random star placement and asteroid variations
- **Physics-based Rendering**: PBR materials with metalness and roughness

## Getting Started

### Option 1: Direct Web Access
1. Open `html2.html` in your web browser
2. Interact with the 3D scene immediately

### Option 2: Local Development
```bash
# Clone or download the repository
git clone https://github.com/poligonostic/poligonostic.github.io.git
cd poligonostic.github.io

# Serve locally (Python 3)
python -m http.server 8000

# Or using Node.js (with http-server)
npx http-server
```

Visit `http://localhost:8000/html2.html` in your browser.

## File Structure

```
poligonostic.github.io/
├── html2.html      # Main HTML file with UI and styling
├── script.js       # Three.js scene logic and interactions
└── README.md       # This file
```

## Technical Details

### Scene Components

**Planets**
- Icosahedron geometry for smooth sphere rendering
- Dynamic orbital positioning
- Individual rotation and orbital speeds
- Saturn includes a torus ring system
- Canvas-based labels for each planet

**Asteroids**
- Dodecahedron geometry for varied appearance
- Random colors using HSL color space
- Independent rotations with procedural axes
- Distributed asteroid belt between Mars and Jupiter

**Space Station**
- Modular design with main structure and solar panels
- Blue reflective solar panel material
- Orange antenna piece
- Orbiting around the universe at 100 unit radius

**Lighting**
- Ambient light: Base illumination
- Point light (Sun): Main light source with shadows
- Blue and Red accent lights: Scene ambiance

### Performance Optimizations

- Shadow map resolution: 2048x2048 for quality
- Fog effect to cull distant objects
- Efficient geometry reuse
- Adaptive FPS counter

## Customization

### Add More Planets
Edit the `planetData` array in `script.js`:
```javascript
{ name: 'YourPlanet', size: 15, distance: 200, speed: 0.005, color: 0xff0000 }
```

### Change Star Count
Modify `starCount` in `createStarfield()`:
```javascript
const starCount = 10000; // More stars for better visuals
```

### Adjust Asteroid Belt
Change asteroid parameters in `createAsteroids()`:
```javascript
const asteroidCount = 500; // More asteroids
const beltDistance = 150; // Different distance
```

## Browser Compatibility

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Requires WebGL support

## Performance Notes

- Target: 60 FPS on modern hardware
- 5,000 stars + 6 planets + 200 asteroids + space station
- GPU-accelerated rendering recommended
- Works on laptops and desktops

## Credits

Built with:
- [Three.js](https://threejs.org/) - 3D JavaScript library
- WebGL - Graphics rendering
- Canvas API - Label rendering

## License

Open source - Feel free to modify and use!

---

**🚀 Enjoy exploring the universe!**
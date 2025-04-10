const fs = require('fs');
const { createCanvas, createRadialGradient } = require('canvas');

// Create icons in different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  // Create canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Transparent background (nothing to draw for transparency)
  
  // Set font properties based on size
  const fontSize = Math.floor(size * 0.7); // 70% of the icon size
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Position for the letter
  const x = size / 2;
  const y = size / 2 + size * 0.05; // Slight vertical adjustment
  
  // Create a gradient that will be visible on both light and dark backgrounds
  const gradient = ctx.createLinearGradient(x - fontSize/2, y - fontSize/2, x + fontSize/2, y + fontSize/2);
  gradient.addColorStop(0, '#4A90E2');   // Blue
  gradient.addColorStop(0.5, '#8E44AD'); // Purple
  gradient.addColorStop(1, '#E74C3C');   // Red-orange
  
  // Draw the letter with a gradient fill
  ctx.fillStyle = gradient;
  ctx.fillText('U', x, y);
  
  // Add a subtle white outline to make it visible on dark backgrounds
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeText('U', x, y);
  
  // Convert canvas to PNG buffer
  const buffer = canvas.toBuffer('image/png');
  
  // Save the buffer to a file
  fs.writeFileSync(`icons/icon${size}.png`, buffer);
  
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!');

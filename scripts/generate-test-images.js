const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

const desktopPath = path.join(os.homedir(), 'Desktop');
const testImagesFolder = path.join(desktopPath, 'test-upload-images');

// Create folder if it doesn't exist
if (!fs.existsSync(testImagesFolder)) {
  fs.mkdirSync(testImagesFolder, { recursive: true });
  console.log(`Created folder: ${testImagesFolder}`);
}

// Generate 100 JPG images
async function generateImages() {
  const colors = [
    { r: 255, g: 0, b: 0 },     // Red
    { r: 0, g: 255, b: 0 },     // Green
    { r: 0, g: 0, b: 255 },     // Blue
    { r: 255, g: 255, b: 0 },   // Yellow
    { r: 255, g: 0, b: 255 },   // Magenta
    { r: 0, g: 255, b: 255 },   // Cyan
    { r: 128, g: 128, b: 128 }, // Gray
    { r: 255, g: 128, b: 0 },   // Orange
    { r: 128, g: 0, b: 128 },   // Purple
    { r: 0, g: 128, b: 0 },     // Dark Green
  ];

  const sizes = [
    { width: 800, height: 600 },
    { width: 1024, height: 768 },
    { width: 640, height: 480 },
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
  ];

  console.log('Generating 100 JPG images...');

  for (let i = 1; i <= 100; i++) {
    const colorIndex = (i - 1) % colors.length;
    const sizeIndex = (i - 1) % sizes.length;
    const color = colors[colorIndex];
    const size = sizes[sizeIndex];

    // Create a simple colored image with a number overlay
    const image = sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 3,
        background: { r: color.r, g: color.g, b: color.b },
      },
    });

    // Add some variation - make some images slightly different shades
    const variation = Math.floor((i / 100) * 50);
    const adjustedColor = {
      r: Math.min(255, color.r + variation),
      g: Math.min(255, color.g + variation),
      b: Math.min(255, color.b + variation),
    };

    const filename = `test-image-${i.toString().padStart(3, '0')}.jpg`;
    const filepath = path.join(testImagesFolder, filename);

    // Generate image with adjusted color
    await sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 3,
        background: { r: adjustedColor.r, g: adjustedColor.g, b: adjustedColor.b },
      },
    })
      .jpeg({ quality: 85 })
      .toFile(filepath);

    if (i % 10 === 0) {
      console.log(`Generated ${i}/100 images...`);
    }
  }

  console.log(`\n✅ Successfully generated 100 JPG images in: ${testImagesFolder}`);
  console.log(`Total files: ${fs.readdirSync(testImagesFolder).length}`);
}

generateImages().catch((error) => {
  console.error('Error generating images:', error);
  process.exit(1);
});


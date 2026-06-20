import Jimp from 'jimp';

/**
 * Remove background from image using color-based detection
 * Detects white/light backgrounds and converts to transparent
 */
export const removeBackground = async (imageBuffer: Buffer): Promise<Buffer> => {
  const image = await Jimp.read(imageBuffer);

  // Define background threshold - pixels close to white (light colors) become transparent
  const WHITE_THRESHOLD = 200;
  const SATURATION_THRESHOLD = 30;
  const EDGE_BUFFER = 20;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];

    // Calculate average color and saturation
    const avg = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);

    // Detect white/light background: high average brightness + low saturation
    const isLightBackground = avg > WHITE_THRESHOLD && saturation < SATURATION_THRESHOLD;

    // Detect gray background: all channels similar
    const isGrayBackground = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15 && avg > 180;

    // Make background transparent
    if (isLightBackground || isGrayBackground) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0
    } else {
      // Apply slight transparency to near-white pixels at edges for antialiasing
      if (avg > 220 && saturation < 20) {
        this.bitmap.data[idx + 3] = Math.max(0, a - 50);
      }
    }
  });

  // Return as PNG with transparency
  return image.png().toBuffer();
};

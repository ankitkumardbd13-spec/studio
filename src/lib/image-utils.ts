/**
 * Utility to compress images to a target file size (approx 50KB) 
 * and return as a Base64 string.
 */
export async function compressImage(file: File, targetKB: number = 50): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Initial scale down if very large
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context failed');

        ctx.drawImage(img, 0, 0, width, height);

        // Quality iteration to get close to target size
        let quality = 0.7;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Simple heuristic: if string length / 1.33 > targetKB * 1024, reduce quality
        // Base64 is ~33% larger than binary
        while (dataUrl.length / 1.33 > targetKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

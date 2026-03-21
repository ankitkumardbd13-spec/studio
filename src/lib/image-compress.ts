/**
 * Compresses an image file using HTMLCanvasElement to a target maximum size in KB.
 * Returns the compressed image as a base64 Data URL to be saved in Firestore or Storage.
 *
 * @param file The original image file
 * @param maxSizeKb The target maximum size in KB (default: 30)
 * @returns A compressed Data URL (base64 string)
 */
export async function compressImage(file: File, maxSizeKb: number = 30): Promise<string> {
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
        
        // Initial downscale if very large (e.g. mobile photos)
        const MAX_DIMENSION = 800;
        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }

        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        
        // clear and draw
        ctx.fillStyle = "#FFFFFF"; // ensures transparent PNGs get white bg against JPEG
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Loop to reduce quality until size is below maxSizeKb
        // Size proxy: base64 characters * 0.75 / 1024 roughly equals size in KB
        while (dataUrl.length * 0.75 / 1024 > maxSizeKb && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If compression via quality isn't enough, downscale dimensions
        while (dataUrl.length * 0.75 / 1024 > maxSizeKb && canvas.width > 150) {
          canvas.width = Math.floor(canvas.width * 0.8);
          canvas.height = Math.floor(canvas.height * 0.8);
          
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(dataUrl);
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
}

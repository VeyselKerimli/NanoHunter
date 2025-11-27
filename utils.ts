
/**
 * Compresses and resizes an image file to reduce API payload size and latency.
 * Max dimension set to 1536px (optimal for Gemini vision tasks).
 */
export const compressImage = async (file: File): Promise<string> => {
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
        const maxDimension = 1536;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height *= maxDimension / width));
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width *= maxDimension / height));
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas context could not be created"));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 0.85 quality (good balance)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        // Remove prefix to get raw base64
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Downloads text content as a .txt file
 */
export const downloadTextFile = (filename: string, content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

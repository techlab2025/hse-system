export const convertToBase64 = (
    files: File | File[],
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8,
): Promise<string | string[]> => {
  if (!files) {
    return Promise.reject('No files provided');
  }

  const processFile = (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
      // Image: compress and convert to Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height *= maxWidth / width;
                width = maxWidth;
              } else {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/webp', quality);
              resolve(compressedDataUrl);
            } else {
              reject(new Error('Canvas context is not available'));
            }
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = reader.result as string;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    } else if (
        file.type.startsWith('video/') ||
        file.type.startsWith('application/') ||
        file.type.startsWith('audio/')
    ) {
      // Video, application, or audio: just convert to Base64, no compression
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    } else {
      return Promise.reject('Unsupported file type');
    }
  };

  if (Array.isArray(files)) {
    return Promise.all(files.map((file) => processFile(file)));
  }
  return processFile(files);
};
export interface FileBase64 {
    alt: string;
    file: string;
}

export function filesToBase64(
    files: File | File[]
): Promise<FileBase64 | FileBase64[]> {
    return new Promise((resolve, reject) => {
        const fileArray = Array.isArray(files) ? files : [files]; // Ensure files is an array
        const results: FileBase64[] = [];
        let filesProcessed = 0;

        fileArray.forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                results.push({
                    alt: file.name,
                    file: reader.result as string, // Keep the full Base64 string
                });
                filesProcessed += 1;
                if (filesProcessed === fileArray.length) {
                    // Return single object if only one file was passed
                    resolve(Array.isArray(files) ? results : results[0]);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    });
}

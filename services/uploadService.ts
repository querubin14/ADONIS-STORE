
import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Assumes a bucket named 'products' exists.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file, or null if failed.
 */
/**
 * Compresses an image file using Canvas.
 * Max dimension: 1920px
 * Quality: 0.8 (JPEG)
 */
const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        // If not an image, return original
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(file);
                return;
            }

            // Calculate new dimensions (Max 1920)
            const MAX_DIMENSION = 1920;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                }
            } else {
                if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                } else {
                    resolve(file); // Fallback
                }
            }, 'image/jpeg', 0.85); // 85% Quality
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const uploadProductImage = async (file: File, folder?: string): Promise<string | null> => {
    try {
        if (!file) return null;

        // Compress Image before upload
        console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        const compressedFile = await compressImage(file);
        console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        // Create a unique file name
        // Always use jpg extension for compressed images
        const fileExt = 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        // Clean folder name to be safe
        const cleanFolder = folder ? folder.toLowerCase().replace(/[^a-z0-9-_]/g, '-') : 'general';
        const filePath = `${cleanFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, compressedFile);

        if (uploadError) {
            console.error('Error uploading image to Supabase:', uploadError);
            alert(`Error al subir imagen: ${uploadError.message}`);
            return null;
        }

        // Get Public URL
        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Upload exception:', error);
        return null;
    }
};

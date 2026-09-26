export const uploadImage = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "a5jzwc2x";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "Yog13b2n8";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }

  const data = await res.json();
  return data.secure_url;
};

// Alias export so both function names work
export const uploadToCloudinary = uploadImage;
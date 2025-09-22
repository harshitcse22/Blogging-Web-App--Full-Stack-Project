import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import api from '../utils/api';
import Button from './ui/Button';

const ImageUpload = ({ onImageUpload, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onImageUpload(response.data.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          className="hidden"
          ref={(input) => {
            if (input) {
              input.accept = 'image/*';
            }
          }}
          onChange={handleImageChange}
          id="image-upload"
          disabled={isUploading}
        />
        <Button 
          type="button"
          variant="outline"
          className="relative overflow-hidden"
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <PhotoIcon className="h-5 w-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>

      {preview && (
        <div className="relative mt-4 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => {
              setPreview('');
              onImageUpload('');
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
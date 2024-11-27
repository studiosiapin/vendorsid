import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const useUploadImage = () => {
  const baseStorageUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public' || '';
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || '';

  const uploadImage = async (file: File | null) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setError(null);

    const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '');
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, file);

    setIsUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const formattedUrl = `${baseStorageUrl}/${data.fullPath}`;
    setImageUrl(formattedUrl);
  };

  return { uploadImage, isUploading, error, imageUrl };
};

export default useUploadImage;

'use client';
import useUploadImage from '@/hooks/useUploadImage';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FileUploader } from './file-uploader';

// props
interface SupabaseImageUploaderProps {
  name?: string;
  initialUrl?: string;
  onUpload?: (imageUrl: string) => void;
}

const SupabaseImageUploader = ({
  name,
  initialUrl,
  onUpload
}: SupabaseImageUploaderProps) => {
  const { imageUrl: upImageUrl, isUploading, uploadImage } = useUploadImage();
  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl || null);

  async function uploadFiles(files: File[]): Promise<void> {
    await uploadImage(files[0]);
  }

  useEffect(() => {
    initialUrl && setImageUrl(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  useEffect(() => {
    if (upImageUrl) {
      setImageUrl(upImageUrl);
      if (onUpload) {
        onUpload(upImageUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upImageUrl]);

  return (
    <div>
      {name ? <label className="mb-3 block font-medium">{name}</label> : null}
      {imageUrl && (
        <div className="relative">
          <div
            className="absolute right-1 top-1 cursor-pointer rounded-full bg-white p-1"
            onClick={() => {
              setImageUrl(null);
            }}
          >
            <CircleX size={24} className="text-red-500" />
          </div>
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt=""
            className="w-full"
          />
        </div>
      )}
      <FileUploader
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        onUpload={uploadFiles}
        disabled={isUploading}
        className={imageUrl ? 'hidden' : ''}
      />
    </div>
  );
};

export default SupabaseImageUploader;

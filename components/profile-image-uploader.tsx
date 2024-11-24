'use client';
import useUploadImage from '@/hooks/useUploadImage';
import { CameraIcon, CircleX } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FileUploader } from './file-uploader';

// props
interface ProfileImageUploaderProps {
  name?: string;
  initialUrl?: string;
  onUpload?: (imageUrl: string) => void;
  errMessage?: string;
  imageClass?: string;
  isEditing?: boolean;
}

const ProfileImageUploader = ({
  name,
  initialUrl,
  onUpload,
  errMessage,
  imageClass,
  isEditing
}: ProfileImageUploaderProps) => {
  const { imageUrl: upImageUrl, isUploading, uploadImage } = useUploadImage();
  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl || null);

  async function uploadFiles(files: File[]): Promise<void> {
    await uploadImage(files[0]);
  }

  const handleClick = () => {
    const input = document.getElementById('profile-image-uploader');
    if (input) {
      input.click();
    }
  };

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
          {isEditing && (
            <div
              className="absolute bottom-1 right-1 cursor-pointer rounded-full border-2 bg-white p-1 dark:border-zinc-900"
              onClick={() => {
                handleClick();
              }}
            >
              <CameraIcon size={24} className="p-0.5 text-red-500" />
            </div>
          )}
          <Image
            src={imageUrl}
            width={1000}
            height={1000}
            alt=""
            className={`w-full ${imageClass} aspect-square rounded-full object-cover`}
          />
        </div>
      )}
      <FileUploader
        id="profile-image-uploader"
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        onUpload={uploadFiles}
        disabled={isUploading}
        className={imageUrl ? 'hidden' : ''}
      />
      {errMessage && <p className="mt-2 text-sm text-red-500">{errMessage}</p>}
    </div>
  );
};

export default ProfileImageUploader;

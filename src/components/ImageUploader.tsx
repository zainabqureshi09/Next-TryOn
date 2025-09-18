"use client";

import { useRef, useState } from "react";

type Props = {
  onImageUpload: (dataUrl: string) => void;
};

export default function ImageUploader({ onImageUpload }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setPreview(res);
      onImageUpload(res);
    };
    reader.onerror = () => {
      console.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" id="tryon-uploader" />
      <label htmlFor="tryon-uploader" className="px-4 py-2 bg-gray-200 rounded cursor-pointer">
        Upload Image
      </label>
      {preview && <img src={preview} alt="preview" className="h-10 rounded object-cover" />}
    </div>
  );
}

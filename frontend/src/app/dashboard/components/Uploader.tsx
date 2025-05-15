"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef } from "react";

interface UploaderProps {
  onFileSelected: (file: File | null) => void;
}

export default function Uploader({ onFileSelected }: UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleFileSelection = useCallback(
    (file: File | null) => {
      onFileSelected(file);
      // Clear the input value here
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;

      handleFileSelection(files && files.length > 0 ? files[0] : null);
    },

    [handleFileSelection]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "csv"; // You can set specific accepted file types here
      fileInputRef.current.multiple = false; // Ensure only one file can be selected
    }
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      // Since we're only handling one file, take the first one
      handleFileSelection(files && files.length > 0 ? files[0] : null);
    },
    [handleFileSelection]
  );

  return (
    <div
      ref={dropAreaRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className="flex flex-col w-5/6 h-2/6 justify-center items-center border-[1px] rounded-lg border-dashed border-[#3C2F66] p-4 cursor-pointer gap-2"
    >
      <Upload className="cursor-pointer" />
      <p className="cursor-pointer">Click to Upload or Drag and Drop</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

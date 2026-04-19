import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AssetUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export function AssetUploader({ onUpload, accept = "image/*,video/*", label = "Upload Asset" }: AssetUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');
      const blob = await response.json();
      onUpload(blob.url);
      toast.success('Asset uploaded successfully');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload asset');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept={accept}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full border-dashed border-white/20 h-24 flex flex-col items-center justify-center space-y-2 hover:bg-white/5 rounded-2xl"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-medium">{label}</span>
          </>
        )}
      </Button>
    </div>
  );
}

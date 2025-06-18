import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useUploadStore } from '../../stores/uploadStore';
import { toast } from 'react-hot-toast';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/heic': ['.heic'],
};

const UploadForm: React.FC = () => {
  const { files, addFiles, removeFile, clearFiles, uploading } = useUploadStore();
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Max size is 20MB.`);
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error(`${file.name} has an invalid file type. Only JPEG, PNG, and HEIC are supported.`);
        } else {
          toast.error(`${file.name} could not be uploaded: ${errors[0]?.message}`);
        }
      });
    }
    
    // Add accepted files
    if (acceptedFiles.length > 0) {
      addFiles(acceptedFiles);
      toast.success(`${acceptedFiles.length} files added successfully`);
    }
  }, [addFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading,
  });
  
  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`card border-2 border-dashed ${
          isDragActive ? 'border-primary' : 'border-white/20'
        } p-8 text-center cursor-pointer transition-all hover:border-primary ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-white/70" />
        <h3 className="text-xl font-semibold mb-2">
          {isDragActive ? 'Drop your photos here' : 'Drag & drop your photos here'}
        </h3>
        <p className="text-white/70 mb-4">
          or <span className="text-primary">browse files</span>
        </p>
        <p className="text-white/50 text-sm">
          Maximum file size: 20MB. Supported formats: JPEG, PNG, HEIC
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Selected Photos ({files.length})</h3>
            <button 
              onClick={clearFiles}
              disabled={uploading}
              className="text-white/70 hover:text-white text-sm flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-dark-light">
                  <img 
                    src={file.preview} 
                    alt={file.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload progress overlay */}
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-dark/70 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 relative mb-2">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-dark-light"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-primary"
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - file.progress / 100)}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{file.progress}%</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">Uploading...</p>
                    </div>
                  )}
                  
                  {/* Error overlay */}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/70 flex flex-col items-center justify-center p-2">
                      <AlertCircle className="h-8 w-8 text-white mb-2" />
                      <p className="text-white text-xs text-center">{file.error || 'Upload failed'}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                  className={`absolute top-2 right-2 h-6 w-6 rounded-full bg-dark/80 flex items-center justify-center text-white/70 hover:text-white transition-colors ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-dark/80 text-white/80 text-xs p-2 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
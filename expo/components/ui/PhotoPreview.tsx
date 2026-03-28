import React from 'react';
import { UploadFile } from '../../stores/uploadStore';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PhotoPreviewProps {
  photo: UploadFile;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ photo, onRemove, disabled = false }) => {
  const getStatusIcon = () => {
    switch (photo.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-neon-green" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <Clock className="h-5 w-5 text-secondary animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (photo.status) {
      case 'success':
        return 'Uploaded';
      case 'error':
        return photo.error || 'Failed';
      case 'uploading':
        return `Uploading ${photo.progress}%`;
      default:
        return 'Ready to upload';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="card p-4 flex items-start space-x-4">
      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-dark-light">
        <img 
          src={photo.preview} 
          alt={photo.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium truncate">{photo.name}</h4>
          <button
            onClick={() => onRemove(photo.id)}
            disabled={disabled}
            className={`text-white/50 hover:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &times;
          </button>
        </div>
        
        <div className="text-xs text-white/50 mb-2">
          {formatFileSize(photo.size)}
        </div>
        
        {photo.status === 'uploading' && (
          <div className="w-full h-1.5 bg-dark-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${photo.progress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex items-center mt-1">
          {getStatusIcon()}
          <span className="text-xs ml-1">{getStatusText()}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoPreview;
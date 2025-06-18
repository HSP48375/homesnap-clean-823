import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Download, FileBox } from 'lucide-react';

interface FloorplanOrderStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  orderId: string;
  packageType: string;
  createdAt: string;
  estimatedCompletionTime?: string;
  downloadUrl?: string;
}

const FloorplanOrderStatus: React.FC<FloorplanOrderStatusProps> = ({
  status,
  orderId,
  packageType,
  createdAt,
  estimatedCompletionTime,
  downloadUrl
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Clock className="h-6 w-6 text-secondary" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-neon-green" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-white/70" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'processing':
        return 'bg-secondary/20 text-secondary';
      case 'completed':
        return 'bg-neon-green/20 text-neon-green';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = () => {
    if (!estimatedCompletionTime) return 'Unknown';
    
    const now = new Date();
    const estimated = new Date(estimatedCompletionTime);
    
    if (now > estimated) return 'Overdue';
    
    const diffMs = estimated.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">
            Floorplan Order #{orderId.substring(0, 8)}
          </h3>
          <p className="text-white/70 text-sm">
            Placed on {formatDate(createdAt)}
          </p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <div className={`px-3 py-1 rounded-full flex items-center ${getStatusClass()}`}>
            {getStatusIcon()}
            <span className="ml-2 capitalize">{status}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Package</h4>
            <p>{packageType}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Status</h4>
            <p className="capitalize">{status}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">
              {status === 'completed' ? 'Completed On' : 'Estimated Completion'}
            </h4>
            <p>
              {status === 'completed' 
                ? estimatedCompletionTime ? formatDate(estimatedCompletionTime) : 'Completed'
                : estimatedCompletionTime ? getTimeRemaining() : 'Processing'}
            </p>
          </div>
        </div>
      </div>
      
      {status === 'processing' && (
        <div className="card bg-dark-lighter p-4 mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-secondary mr-3" />
            <div>
              <h3 className="font-medium">Processing Your Floorplan</h3>
              <p className="text-white/70">
                Our team is currently working on your floorplan. You'll receive a notification when it's ready.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'completed' && downloadUrl && (
        <div className="flex justify-center">
          <a 
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Floorplan
          </a>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="card bg-red-500/10 border border-red-500/30 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h3 className="font-medium">Processing Failed</h3>
              <p className="text-white/70">
                We encountered an issue while processing your floorplan. Our team has been notified and will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorplanOrderStatus;
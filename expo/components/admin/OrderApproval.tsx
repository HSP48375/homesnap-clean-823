import React, { useState } from 'react';
import { useAdminStore, AdminOrder } from '../../stores/adminStore';
import { X, CheckCircle, RefreshCw, FileBox } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderApprovalProps {
  order: AdminOrder;
  onClose: () => void;
}

const OrderApproval: React.FC<OrderApprovalProps> = ({ order, onClose }) => {
  const { approveCompletedOrder, requestRevision } = useAdminStore();
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    const success = await approveCompletedOrder(order.id);
    setProcessing(false);

    if (success) {
      toast.success('Order approved and marked as completed');
      onClose();
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) {
      toast.error('Please provide revision notes');
      return;
    }

    setProcessing(true);
    const success = await requestRevision(order.id, revisionNotes);
    setProcessing(false);

    if (success) {
      toast.success('Revision requested');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Review Completed Order</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-light hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/70 mb-2">
            Order: <span className="text-white">{order.tracking_number || `#${order.id.substring(0, 8)}`}</span>
          </p>
          <p className="text-white/70 mb-2">
            Photos: <span className="text-white">{order.photo_count}</span>
          </p>
          <p className="text-white/70 mb-2">
            Editor: <span className="text-white">{order.editor_name || 'Unknown'}</span>
          </p>
          
          {order.drive_folders && (
            <div className="mt-4">
              <a
                href={order.drive_folders.completed_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center justify-center w-full"
              >
                <FileBox className="h-5 w-5 mr-2" />
                View Completed Photos
              </a>
            </div>
          )}
        </div>

        {showRevisionForm ? (
          <div className="mb-6">
            <label htmlFor="revisionNotes" className="block text-sm font-medium text-white mb-2">
              Revision Notes
            </label>
            <textarea
              id="revisionNotes"
              rows={4}
              className="input w-full"
              placeholder="Provide detailed instructions for the editor..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
            ></textarea>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-white/70 mb-4">
              Please review the completed photos and either approve them or request revisions.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-8 w-8 text-neon-green" />
                </div>
                <p className="text-sm text-white/70">Approve</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="h-8 w-8 text-neon-purple" />
                </div>
                <p className="text-sm text-white/70">Request Revision</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {showRevisionForm ? (
            <>
              <button
                onClick={() => setShowRevisionForm(false)}
                className="btn btn-outline"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                className="btn btn-primary"
                disabled={processing || !revisionNotes.trim()}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Submit Revision Request
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRevisionForm(true)}
                className="btn btn-outline"
                disabled={processing}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Request Revision
              </button>
              <button
                onClick={handleApprove}
                className="btn btn-primary"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve & Deliver
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderApproval;
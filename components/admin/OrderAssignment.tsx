import React, { useState, useEffect } from 'react';
import { useAdminStore, AdminOrder, Editor } from '../../stores/adminStore';
import { X, User, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderAssignmentProps {
  order: AdminOrder;
  onClose: () => void;
}

const OrderAssignment: React.FC<OrderAssignmentProps> = ({ order, onClose }) => {
  const { editors, loading, fetchEditors, assignOrderToEditor } = useAdminStore();
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchEditors();
  }, [fetchEditors]);

  const handleAssign = async () => {
    if (!selectedEditorId) {
      toast.error('Please select an editor');
      return;
    }

    setAssigning(true);
    const success = await assignOrderToEditor(order.id, selectedEditorId);
    setAssigning(false);

    if (success) {
      toast.success('Order assigned successfully');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Assign Order to Editor</h2>
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
          <p className="text-white/70 mb-4">
            Services:
          </p>
          <div className="space-y-1 mb-4 pl-4">
            {order.services.standardEditing && <p className="text-white/70">• Standard Editing</p>}
            {order.services.virtualStaging && <p className="text-white/70">• Virtual Staging</p>}
            {order.services.twilightConversion && <p className="text-white/70">• Twilight Conversion</p>}
            {order.services.decluttering && <p className="text-white/70">• Decluttering</p>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Select an Editor</h3>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mb-2"></div>
              <p className="text-white/70">Loading editors...</p>
            </div>
          ) : editors.length === 0 ? (
            <p className="text-white/70 text-center py-4">No active editors available</p>
          ) : (
            <div className="space-y-3">
              {editors.map((editor) => (
                <div
                  key={editor.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedEditorId === editor.id
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-dark-light hover:bg-dark-lighter border border-transparent'
                  }`}
                  onClick={() => setSelectedEditorId(editor.id)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-dark flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{editor.name}</h4>
                      <p className="text-sm text-white/70">{editor.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">Current: {editor.current_assignments}</p>
                      <p className="text-sm text-white/70">Total: {editor.total_completed}</p>
                    </div>
                    {selectedEditorId === editor.id && (
                      <div className="ml-3">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn btn-outline"
            disabled={assigning}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="btn btn-primary"
            disabled={!selectedEditorId || assigning}
          >
            {assigning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assigning...
              </span>
            ) : (
              'Assign Editor'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderAssignment;
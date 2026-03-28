import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings, RefreshCw } from 'lucide-react';

interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  description: string | null;
}

const NotificationPreferencesSchema: React.FC = () => {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the information schema to get column details
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default, description')
        .eq('table_name', 'notification_preferences')
        .order('ordinal_position', { ascending: true });
      
      if (error) throw error;
      
      setColumns(data || []);
    } catch (err: any) {
      console.error('Error fetching schema:', err);
      setError(err.message || 'Failed to fetch schema information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  // Fetch a sample row to see actual data
  const [sampleRow, setSampleRow] = useState<any>(null);
  const [sampleLoading, setSampleLoading] = useState(true);

  const fetchSampleRow = async () => {
    setSampleLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setSampleRow(data);
    } catch (err: any) {
      console.error('Error fetching sample row:', err);
      // Don't set error state here, as we might not have any rows yet
    } finally {
      setSampleLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleRow();
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Notification Preferences Schema</h2>
          <p className="text-white/70 text-sm">Table: notification_preferences</p>
        </div>
        <button 
          onClick={() => {
            fetchSchema();
            fetchSampleRow();
          }}
          className="btn btn-outline btn-sm flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-white/70">Loading schema information...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 text-center">
          <p className="text-white">{error}</p>
          <button 
            onClick={fetchSchema}
            className="btn btn-sm btn-outline mt-4"
          >
            Try Again
          </button>
        </div>
      ) : columns.length === 0 ? (
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No schema information found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 font-medium">Column Name</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Data Type</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Nullable</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Default Value</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => (
                <tr key={column.column_name} className="border-b border-white/5 hover:bg-dark-light">
                  <td className="py-3 px-4 font-mono text-sm">
                    {column.column_name}
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    {column.data_type}
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    {column.is_nullable === 'YES' ? 'Yes' : 'No'}
                  </td>
                  <td className="py-3 px-4 text-white/70 font-mono text-sm">
                    {column.column_default || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Sample Row Data */}
      {!sampleLoading && sampleRow && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Sample Preference Data</h3>
          <div className="bg-dark-lighter p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(sampleRow, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {/* Preference Types Explanation */}
      <div className="mt-8 pt-4 border-t border-white/10">
        <h3 className="font-semibold mb-4">Available Preference Types</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-primary">Notification Channels</h4>
            <ul className="mt-2 space-y-2 pl-5 list-disc text-white/70">
              <li><span className="font-mono text-sm">in_app</span> - Receive notifications in the application UI</li>
              <li><span className="font-mono text-sm">email</span> - Receive notifications via email</li>
              <li><span className="font-mono text-sm">push</span> - Receive push notifications on devices</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-primary">Notification Categories</h4>
            <ul className="mt-2 space-y-2 pl-5 list-disc text-white/70">
              <li><span className="font-mono text-sm">order_updates</span> - Updates about order status changes</li>
              <li><span className="font-mono text-sm">payment_updates</span> - Updates about payment status</li>
              <li><span className="font-mono text-sm">editor_assignments</span> - Notifications when editors are assigned</li>
              <li><span className="font-mono text-sm">marketing</span> - Marketing and promotional notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesSchema;
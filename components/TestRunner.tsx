import React, { useEffect, useState } from 'react';
import { testSupabaseIntegration } from '../lib/testSupabase';

interface TestResults {
  auth: boolean;
  database: boolean;
  storage: boolean;
  notifications: boolean;
  stripe: boolean;
}

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        const testResults = await testSupabaseIntegration();
        setResults(testResults);
      } catch (err: any) {
        setError(err.message || 'Test execution failed');
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-white/70">Running integration tests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-500/20 border border-red-500/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-2">Test Execution Failed</h3>
        <p className="text-white/70">{error}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const allPassed = Object.values(results).every(result => result === true);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Supabase Integration Test Results</h2>
      
      <div className="space-y-4">
        {Object.entries(results).map(([test, passed]) => (
          <div 
            key={test}
            className={`flex items-center justify-between p-4 rounded-lg ${
              passed ? 'bg-neon-green/20' : 'bg-red-500/20'
            }`}
          >
            <div className="flex items-center">
              <span className={`text-lg font-medium ${passed ? 'text-neon-green' : 'text-red-500'}`}>
                {test.charAt(0).toUpperCase() + test.slice(1)}
              </span>
            </div>
            <span className={passed ? 'text-neon-green' : 'text-red-500'}>
              {passed ? '✓ Passed' : '✗ Failed'}
            </span>
          </div>
        ))}
      </div>

      <div className={`mt-6 p-4 rounded-lg ${
        allPassed ? 'bg-neon-green/20' : 'bg-red-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Status</span>
          <span className={allPassed ? 'text-neon-green' : 'text-red-500'}>
            {allPassed ? 'All Tests Passed' : 'Some Tests Failed'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
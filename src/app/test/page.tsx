'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TestBackend() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      setStatus('checking');
      const response = await axiosInstance.get('/clubs?limit=1');
      if (response.data.success) {
        setStatus('online');
        setMessage(`Backend is online! Found ${response.data.count} clubs`);
      }
    } catch (error: any) {
      setStatus('offline');
      if (error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
        setMessage('Cannot connect to backend. Make sure it\'s running on http://localhost:5000');
      } else {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">API URL:</p>
            <p className="text-sm bg-gray-100 p-2 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</p>
          </div>

          <div>
            <p className="font-medium">Status:</p>
            {status === 'checking' && <p className="text-yellow-600">⏳ Checking...</p>}
            {status === 'online' && <p className="text-green-600">✅ {message}</p>}
            {status === 'offline' && <p className="text-red-600">❌ {message}</p>}
          </div>

          <Button onClick={checkBackend} variant="primary">
            Test Connection Again
          </Button>

          <div className="text-sm text-gray-500">
            <p>Troubleshooting steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Make sure backend is running: <code>cd backend & npm run dev</code></li>
              <li>Check if backend is on port 5000</li>
              <li>Verify CORS is enabled on backend</li>
              <li>Check for any firewall blocking port 5000</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
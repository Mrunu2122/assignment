'use client';

import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface AudioFile {
  language: string;
  url: string;
}

const TextToSpeech = () => {
  // State for the text input
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock audio files - these would come from your API
  const audioFiles: AudioFile[] = [
    { language: 'english', url: '/api/audio/english' },
    { language: 'arabic', url: '/api/audio/arabic' }
  ];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    // This would trigger a download of the current audio file
    const link = document.createElement('a');
    link.href = audioFiles.find(file => file.language === selectedLanguage)?.url || '';
    link.download = `audio-${selectedLanguage}.mp3`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo only - login/signup is handled by the main Header component */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">
              ElevenLabs
              <span className="ml-2 text-orange-500">CLONE</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-black py-4 px-1 text-sm font-medium text-black">
              Text to Speech
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Voice Lab
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Voice Library
            </button>
          </nav>
        </div>

        {/* Text input area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-900">Text to Speech</h2>
            <span className="text-sm text-gray-500">{text.length} characters</span>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="english">English</option>
            <option value="arabic">Arabic</option>
          </select>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className={`flex items-center px-6 py-2 rounded-md text-sm font-medium text-white ${text ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
              disabled={!text}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={!text}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioFiles.find(file => file.language === selectedLanguage)?.url}
          onEnded={() => setIsPlaying(false)}
        />
      </main>
    </div>
  );
};

export default TextToSpeech;

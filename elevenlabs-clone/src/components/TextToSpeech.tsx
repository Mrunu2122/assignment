'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, StopIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const TextToSpeech = () => {
  const [activeTab, setActiveTab] = useState('text-to-speech');
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('drew');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tabs = [
    { id: 'text-to-speech', label: 'Text to Speech' },
    { id: 'voice-lab', label: 'Voice Lab' },
    { id: 'dubbing', label: 'Dubbing' },
    { id: 'speech-to-speech', label: 'Speech to Speech' },
  ];

  const voices = [
    { id: 'drew', name: 'Drew', accent: 'American' },
    { id: 'rachel', name: 'Rachel', accent: 'American' },
    { id: 'clyde', name: 'Clyde', accent: 'British' },
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'arabic', label: 'Arabic' },
  ];

  // Update character count when text changes
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchAudioUrl = async (language: string) => {
    try {
      const response = await fetch(`/api/audio?language=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audio URL');
      }
      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error fetching audio URL:', err);
      throw err;
    }
  };

  const handlePlay = async () => {
    if (!text.trim()) return;
    
    // If already playing, stop the audio
    if (isPlaying && audioRef.current) {
      handleStop();
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Fetch the audio URL from our API
      const newAudioUrl = await fetchAudioUrl(selectedLanguage);
      setAudioUrl(newAudioUrl);
      
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(newAudioUrl);
      } else {
        audioRef.current.src = newAudioUrl;
      }
      
      // Set up event listeners
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      audioRef.current.onerror = () => {
        setError('Failed to play audio. Please try again.');
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      // Play the audio
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to generate or play audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    if (!audioUrl) return;
    
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `speech-${selectedLanguage}-${new Date().getTime()}.mp3`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading audio:', error);
      setError('Failed to download audio. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-150`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'text-to-speech' ? (
            <div className="space-y-6">
              {/* Voice Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Voice Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-9"
                    >
                      {voices.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name} ({voice.accent})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-9"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Editor */}
              <div className="rounded-lg border border-gray-300 overflow-hidden">
                <div className="p-4 bg-white">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-64 p-4 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Type or paste your text here..."
                    rows={8}
                  />
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {characterCount} character{characterCount !== 1 ? 's' : ''}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!text.trim()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    {isPlaying ? (
                      <button
                        type="button"
                        onClick={handleStop}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <StopIcon className="h-4 w-4 mr-2" />
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePlay}
                        disabled={!text.trim() || isGenerating}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Play'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>This tab is for demonstration purposes only.</p>
              <p>Focus is on the Text to Speech functionality.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;

'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, StopIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface Voice {
  id: string;
  name: string;
  accent: string;
}

interface Language {
  value: string;
  label: string;
}

const TextToSpeech = () => {
  // State management
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [languages, setLanguages] = useState<{code: string, name: string}[]>([]);
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Extract unique languages
      const uniqueLangs = new Map<string, string>();
      availableVoices.forEach(voice => {
        if (!uniqueLangs.has(voice.lang)) {
          uniqueLangs.set(voice.lang, new Intl.DisplayNames(['en'], { type: 'language' }).of(voice.lang) || voice.lang);
        }
      });
      
      setLanguages(Array.from(uniqueLangs.entries()).map(([code, name]) => ({
        code,
        name: `${name} (${code})`
      })));
      
      // Set default voice if not set
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
        setSelectedLanguage(defaultVoice.lang);
      }
    };
    
    // Load voices when they are loaded
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Update character count when text changes
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (utteranceRef.current) {
        utteranceRef.current = null;
      }
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioBlobUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 5000) {
      setText(e.target.value);
    }
  };

  const handlePlay = () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }
    
    if (isPlaying) {
      handleStop();
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check if browser supports Web Speech API
      if (!('speechSynthesis' in window)) {
        throw new Error('Your browser does not support the Web Speech API');
      }
      
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice and language
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        console.warn('Selected voice not found, using default');
        utterance.lang = selectedLanguage;
      }
      
      // Set up event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsGenerating(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Error generating speech. Please try again.');
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      // Store the utterance for later reference
      utteranceRef.current = utterance;
    } catch (err) {
      console.error('Error in handlePlay:', err);
      setError('Failed to process your request. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    // Note: Direct download isn't possible with Web Speech API
    // This is a fallback that suggests using the browser's built-in functionality
    alert('For best results, use the browser\'s "Save as" option in the right-click menu of the play button.');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Voice Settings */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium mb-3">Voice Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  // Update language to match selected voice
                  const voice = voices.find(v => v.name === e.target.value);
                  if (voice) {
                    setSelectedLanguage(voice.lang);
                  }
                }}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                disabled={voices.length === 0}
              >
                {voices.length > 0 ? (
                  voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))
                ) : (
                  <option>Loading voices...</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  // Update voice to match selected language
                  const voiceForLang = voices.find(v => v.lang === e.target.value);
                  if (voiceForLang) {
                    setSelectedVoice(voiceForLang.name);
                  }
                }}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                disabled={voices.length === 0}
              >
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))
                ) : (
                  <option>Loading voices...</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type or paste your text here..."
            disabled={isGenerating || isPlaying}
          />
          <div className="mt-1 text-sm text-gray-500">
            {characterCount} / 5000 characters
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handlePlay}
              disabled={!text.trim() || isGenerating}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : isPlaying ? (
                <>
                  <StopIcon className="h-4 w-4 mr-2" />
                  Stop
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
              disabled={!audioBlobUrl || isGenerating || isPlaying}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {characterCount === 0 ? 'Enter text to begin' : `${characterCount} characters`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;

interface AudioRequest {
  text: string;
  language: string;
  voice: string;
}

interface AudioResponse {
  url: string;
  language: string;
  voice: string;
  timestamp: string;
}

/**
 * Converts text to speech using the API
 * @param text - The text to convert to speech
 * @param language - The language of the text
 * @param voice - The voice to use for the speech
 * @returns A promise that resolves to the audio response
 */
export const textToSpeech = async ({
  text,
  language,
  voice,
}: AudioRequest): Promise<AudioResponse> => {
  try {
    const response = await fetch('/api/audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language, voice }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 'Failed to generate speech. Please try again.'
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred while generating speech');
  }
};

/**
 * Fetches the audio URL for a previously generated speech
 * @param audioId - The ID of the audio to fetch
 * @returns A promise that resolves to the audio response
 */
export const getAudioUrl = async (audioId: string): Promise<AudioResponse> => {
  try {
    const response = await fetch(`/api/audio/${audioId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio URL');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching audio URL:', error);
    throw error;
  }
};

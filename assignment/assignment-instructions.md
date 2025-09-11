## Instructions

1. Visit [https://elevenlabs.io/](https://elevenlabs.io/). The assignment is based on this website.  
2. I’ve attached two images. You only need to build the part of the page shown in them. Ignore the rest. I’ve already removed the sections you don’t need to build.  
   - Just display the **Login** and **Signup** buttons. There’s no need to implement the login/signup pages or their functionality.  
3. Replicate the design as closely as possible to showcase your **UI/frontend skills**. The UI must be built using **Next.js**.  
4. The page has multiple tabs, but focus only on the **"Text to Speech"** tab. Show all the tabs in the UI, but keep the content for the other tabs empty.  
5. Inside the "Text to Speech" tab:  
   - Include the **download button, play button, dropdown**, and text editor area.  
   - For the text editor, just keep the text plain. There’s no need to replicate ElevenLabs’ colored text formatting.  
   - We’re only testing your frontend skills here, so you don’t need to implement any complex functionality.  
6. For functionality, implement audio playback:  
   - The dropdown should allow selecting a language.  
   - If the user selects English, it should play the English audio.  
   - If the user selects Arabic, it should play the Arabic audio.  
   - (Note: You don’t need to build text-to-speech functionality. The API integration is explained in **point 7**.)  
7. For backend implementation:  
   - Use **MongoDB** as the database.  
   - For the API, you may use any framework you’re comfortable with (Flask, Django, FastAPI, etc.).  
   - Upload the audio files (from step 6) somewhere, get their URLs, and store them in the database.  
   - Create an API endpoint that fetches these audio URLs.  
   - In the UI, when a language is selected from the dropdown, play the audio using the URL returned by the API.  

---

## Submission Details
- **Deadline**: Saturday, end of day.  
- **Hosting**: It will be better if you can host the project using **Vercel**, **Netlify**, or any platform you are comfortable with.  
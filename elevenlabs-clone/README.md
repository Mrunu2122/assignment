# ElevenLabs Clone

A full-stack clone of the ElevenLabs Text-to-Speech interface built with Next.js, TypeScript, and MongoDB.

## Features

- Responsive UI that mimics the ElevenLabs design
- Text-to-speech functionality with multiple voices and languages
- Audio playback controls with play/pause and download options
- Serverless API endpoints for audio generation
- MongoDB integration for storing audio metadata
- Environment-based configuration

## Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB Atlas account or local MongoDB instance
- (Optional) Vercel account for deployment

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/elevenlabs-clone.git
   cd elevenlabs-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the MongoDB connection string and other variables

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/elevenlabs-clone?retryWrites=true&w=majority

# Next.js Environment Variables
NEXT_PUBLIC_API_URL=/api
```

## Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Hero Icons](https://heroicons.com/)

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/) (optional, if using MongoDB)

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   └── api/              # API routes
│       └── audio/        # Audio generation endpoints
├── components/           # Reusable React components
│   └── TextToSpeech.tsx  # Main component
├── services/             # API service clients
│   └── audioService.ts   # Audio service for API calls
└── types/                # TypeScript type definitions
```

## Deployment

### Vercel

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Local MongoDB Setup

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env.local` to `mongodb://localhost:27017/elevenlabs-clone`

## License

This project is open source and available under the [MIT License](LICENSE).

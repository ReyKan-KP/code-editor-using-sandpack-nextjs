"use client"
import React from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  // Function to start a new practice session
  const startNewSession = () => {
    // Generate a new session ID
    const sessionId = uuidv4();
    
    // Clear previous localStorage data related to code submissions
    if (typeof window !== 'undefined') {
      // Get all keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Only remove keys related to questions
        if (key && (key.startsWith('question-') || key === 'question-submissions')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    
    // Store the new session ID
    localStorage.setItem('interview-session-id', sessionId);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6">Interactive Code Editor</h1>
        <p className="text-xl mb-10">Practice coding challenges and build your skills with our interactive editor.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
          {/* <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
            <h2 className="text-2xl font-semibold mb-3">Code Playground</h2>
            <p className="mb-4">Experiment with different languages and frameworks in our interactive sandbox.</p>
            <Link href="/temp" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition">
              Try it out
            </Link>
          </div> */}
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition">
            <h2 className="text-2xl font-semibold mb-3">Coding Interview</h2>
            <p className="mb-4">Practice coding interview questions with multiple template options.</p>
            <Link 
              href="/interview" 
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium transition"
              onClick={startNewSession}
            >
              Start practicing
            </Link>
          </div>
        </div>
        
        {/* <div className="text-gray-400 text-sm">
          <p>Built with Next.js and Sandpack</p>
        </div> */}
      </div>
    </main>
  );
};

export default Page;
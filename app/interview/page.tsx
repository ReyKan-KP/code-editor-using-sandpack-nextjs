'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import ReactCodeEditor from '@/components/code-editors/react-code-editor';
import ReactTsCodeEditor from '@/components/code-editors/react-ts-code-editor';
import VanillaCodeEditor from '@/components/code-editors/vanilla-code-editor';
import VanillaTsCodeEditor from '@/components/code-editors/vanilla-ts-code-editor';
import NodeCodeEditor from '@/components/code-editors/node-code-editor';
import AngularCodeEditor from '@/components/code-editors/angular-code-editor';
import VueCodeEditor from '@/components/code-editors/vue-code-editor';
import VueTsCodeEditor from '@/components/code-editors/vue-ts-code-editor';
import NextjsCodeEditor from '@/components/code-editors/nextjs-code-editor';
import StaticCodeEditor from '@/components/code-editors/static-code-editor';
import { ChevronLeft, Clock, Code, FileCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Simple UI components with TypeScript types
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'primary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, variant, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${
        variant === 'outline' 
          ? 'border border-gray-600 hover:bg-gray-700' 
          : variant === 'primary'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
};

// Types for coding questions
interface StarterCode {
  [key: string]: string;
}

interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  template: string; // Single template instead of array
  starterCode: {
    [file: string]: string;
  };
}

interface SubmissionData {
  questionId: number;
  questionTitle: string;
  template: string;
  submitted: boolean;
  submissionDate?: Date;
  questionDescription?: string;
  files?: {
    [path: string]: string;
  };
  sessionId?: string;
}

// Coding questions with templates
const codingQuestions: CodingQuestion[] = [
  {
    id: 1,
    title: "Create a Counter Component",
    description: "Create a React component that increments a counter when a button is clicked.",
    difficulty: "Easy",
    category: "React",
    template: "react", // Single template
    starterCode: {
      '/App.js': `export default function Counter() {
  // TODO: Implement a counter that increments when the button is clicked
  
  return (
    <div>
      <h1>Counter: 0</h1>
      <button>Increment</button>
    </div>
  );
}`
    }
  },
  {
    id: 2,
    title: "Fetch and Display Data",
    description: "Create a component that fetches data from an API and displays it.",
    difficulty: "Medium",
    category: "API Integration",
    template: "react", // Single template
    starterCode: {
      '/App.js': `export default function DataFetcher() {
  // TODO: Fetch data from https://jsonplaceholder.typicode.com/users
  // and display it in a list
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {/* Display users here */}
      </ul>
    </div>
  );
}`
    }
  },
  {
    id: 3,
    title: "Todo List Application",
    description: "Create a simple Todo List application with add, toggle, and delete functionality.",
    difficulty: "Medium",
    category: "Application Development",
    template: "react-ts", // Single template
    starterCode: {
      '/App.tsx': `export default function TodoApp() {
  // TODO: Implement a todo list with add, toggle, and delete functionality
  // Use proper TypeScript interfaces
  
  return (
    <div>
      <h1>Todo List</h1>
      <form>
        <input type="text" placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {/* Display todos here */}
      </ul>
    </div>
  );
}`
    }
  },
  {
    id: 4,
    title: "Algorithm: Array Manipulation",
    description: "Write a function that finds the two numbers in an array that add up to a target value.",
    difficulty: "Medium",
    category: "Algorithms",
    template: "node", // Single template
    starterCode: {
      '/index.js': `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]} - indices of the two numbers that add up to target
 */
function twoSum(nums, target) {
  // TODO: Implement the twoSum function
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`
    }
  },
  {
    id: 5,
    title: "State Management with Context API",
    description: "Create a theme switcher using React's Context API.",
    difficulty: "Hard",
    category: "React",
    template: "react-ts", // Single template
    starterCode: {
      '/App.tsx': `// TODO: Implement a theme switcher with Context API
// Create a ThemeContext with light/dark mode and a toggle function
// Use proper TypeScript interfaces

export default function App() {
  return (
    <div>
      <h1>Theme Switcher</h1>
      <button>Toggle Theme</button>
      <Content />
    </div>
  );
}

function Content() {
  return (
    <div>
      <p>This content should change based on the current theme.</p>
    </div>
  );
}`
    }
  }
];

// Template display names
const templateOptions: Record<string, string> = {
  'react': 'React',
  'react-ts': 'React TypeScript',
  'vanilla': 'JavaScript',
  'vanilla-ts': 'TypeScript',
  'node': 'Node.js',
  'angular': 'Angular',
  'vue': 'Vue.js',
  'vue-ts': 'Vue TypeScript',
  'nextjs': 'Next.js',
  'static': 'Static HTML/JS/CSS'
};

const InterviewPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'question'>('list');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Load session ID and submissions from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem('interview-session-id');
      setSessionId(savedSessionId);
      
      const savedSubmissions = localStorage.getItem('question-submissions');
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }
    }
  }, []);
  
  // If no session ID is found, redirect to home page
//   useEffect(() => {
//     if (typeof window !== 'undefined' && !sessionId && sessionId !== undefined) {
//       window.location.href = '/';
//     }
//   }, [sessionId]);

  // Current question based on index
  const currentQuestion = currentQuestionIndex !== null ? codingQuestions[currentQuestionIndex] : null;

  // Function to select a question
  const selectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowConfirmation(true);
  };

  // Function to start a question
  const startQuestion = () => {
    setShowConfirmation(false);
    setViewMode('question');
  };

  // Function to cancel question selection
  const cancelSelection = () => {
    setShowConfirmation(false);
    setCurrentQuestionIndex(null);
  };

  // Function to extract and store code from localStorage
  const submitQuestion = async () => {
    if (currentQuestion && sessionId) {
      const template = currentQuestion.template;
      const storageKey = `question-${currentQuestion.id}-${template}`;
      
      // Extract all files from localStorage for this question
      const filesData: { [path: string]: string } = {};
      
      // Try to get all keys that match the pattern
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(storageKey)) {
            try {
              const fileData = JSON.parse(localStorage.getItem(key) || '{}');
              // For regular file storage pattern
              if (key === storageKey) {
                Object.entries(fileData).forEach(([path, content]) => {
                  filesData[path] = content as string;
                });
              } 
              // For individual file storage pattern
              else {
                const filePath = key.replace(`${storageKey}/`, '');
                filesData[filePath] = fileData.code || fileData;
              }
            } catch (error) {
              console.error('Error parsing localStorage data:', error);
            }
          }
        }
      }

      // Create submission data
      const newSubmission: SubmissionData = {
        questionId: currentQuestion.id,
        questionDescription: currentQuestion.description,
        questionTitle: currentQuestion.title,
        template: currentQuestion.template,
        submitted: true,
        submissionDate: new Date(),
        files: filesData,
        sessionId: sessionId
      };

      try {
        // Save submission to server via API
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubmission),
        });

        const result = await response.json();

        if (!result.success) {
          console.error('Error saving submission to server:', result.message);
        }
      } catch (error) {
        console.error('Failed to save submission to server:', error);
      }

      // Update submissions in localStorage
      const updatedSubmissions = [...submissions];
      const existingIndex = updatedSubmissions.findIndex(s => s.questionId === currentQuestion.id);
      
      if (existingIndex >= 0) {
        updatedSubmissions[existingIndex] = newSubmission;
      } else {
        updatedSubmissions.push(newSubmission);
      }

      setSubmissions(updatedSubmissions);
      localStorage.setItem('question-submissions', JSON.stringify(updatedSubmissions));

      // Return to list view
      setViewMode('list');
      setCurrentQuestionIndex(null);
    }
  };

  // Function to go back to the question list from question view
  const backToList = () => {
    if (window.confirm('Are you sure you want to leave? Your progress will be saved but not submitted.')) {
      setViewMode('list');
      setCurrentQuestionIndex(null);
    }
  };

  // Function to render the appropriate code editor based on the question's template
  const renderCodeEditor = () => {
    if (!currentQuestion) return null;
    
    const template = currentQuestion.template;
    const starterCode = currentQuestion.starterCode;
    
    // Create a unique localStorage key for this question
    const storageKey = `question-${currentQuestion.id}-${template}`;
    
    // Handle case where starterCode might be undefined
    const safeStarterCode = starterCode || {};
    
    switch (template) {
      case 'react':
        return <ReactCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'react-ts':
        return <ReactTsCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'vanilla':
        return <VanillaCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'vanilla-ts':
        return <VanillaTsCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'node':
        return <NodeCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'angular':
        return <AngularCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'vue':
        return <VueCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'vue-ts':
        return <VueTsCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'nextjs':
        return <NextjsCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      case 'static':
        return <StaticCodeEditor customFiles={safeStarterCode} storageKey={storageKey} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-900 text-white">
            <p>No template specified for this question</p>
          </div>
        );
    }
  };

  // Check if a question has been submitted
  const isSubmitted = (questionId: number) => {
    return submissions.some(s => s.questionId === questionId && s.submitted);
  };

  // Render the question list view
  const renderQuestionList = () => (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Coding Interview Questions</h1>
      
      <div className="grid gap-6">
        {codingQuestions.map((question, index) => {
          const submitted = isSubmitted(question.id);
          
          return (
            <div 
              key={question.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold">{question.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-800 text-green-200' :
                      question.difficulty === 'Medium' ? 'bg-yellow-800 text-yellow-200' :
                      'bg-red-800 text-red-200'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded bg-blue-800 text-blue-200 text-xs font-medium">
                      {question.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{question.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4" />
                    <span className="text-sm text-gray-400">
                      {templateOptions[question.template]}
                    </span>
                    
                    {submitted && (
                      <span className="ml-4 flex items-center text-green-400 text-sm">
                        <FileCheck className="w-4 h-4 mr-1" />
                        Submitted
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => selectQuestion(index)} 
                    variant={submitted ? "outline" : "default"}
                    disabled={submitted}
                  >
                    {submitted ? "Submitted" : "Start"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render the question attempt view
  const renderQuestionView = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <button 
            onClick={backToList}
            className="text-blue-400 hover:underline flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Questions
          </button>
          <h1 className="text-xl font-bold">Question {currentQuestionIndex !== null ? currentQuestionIndex + 1 : ""}: {currentQuestion.title}</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowSubmitDialog(true)} variant="primary">
              Submit
            </Button>
          </div>
        </header>

        {/* Question details */}
        <div className="bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded text-xs font-medium ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-800 text-green-200' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-800 text-yellow-200' :
                  'bg-red-800 text-red-200'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-3 py-1 rounded bg-blue-800 text-blue-200 text-xs font-medium">
                  {currentQuestion.category}
                </span>
              </div>
              <p className="text-gray-300">{currentQuestion.description}</p>
            </div>
            
            <div className="text-sm text-gray-400">
              <div className="flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Template: <span className="text-white font-medium ml-1">{templateOptions[currentQuestion.template]}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Editor section */}
        <div className="flex-1 overflow-hidden">
          {renderCodeEditor()}
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent className="bg-gray-800 border border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Solution</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to submit? Once submitted, you cannot re-edit or update your solution.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={submitQuestion}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  // Confirmation modal
  const renderConfirmationModal = () => {
    if (!showConfirmation || currentQuestionIndex === null) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Start Question</h2>
          <p className="text-gray-300 mb-6">
            Once you start this question, you must complete and submit it before attempting another question.
            Your code will be saved automatically.
          </p>
          <div className="flex justify-end space-x-4">
            <Button onClick={cancelSelection} variant="outline">
              Cancel
            </Button>
            <Button onClick={startQuestion}>
              Start Question
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header for list view */}
      {viewMode === 'list' && (
        <header className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="container mx-auto max-w-5xl flex justify-between items-center">
            <Link href="/" className="text-blue-400 hover:underline flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold">Coding Interview Practice</h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </header>
      )}
      
      {/* Main content */}
      {viewMode === 'list' && renderQuestionList()}
      {viewMode === 'question' && renderQuestionView()}
      
      {/* Confirmation modal */}
      {renderConfirmationModal()}
    </div>
  );
};

export default InterviewPage;

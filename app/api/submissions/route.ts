import { NextResponse } from 'next/server';
import { writeFile, readFile, access, mkdir } from 'fs/promises';
import path from 'path';
import { constants } from 'fs';

// Define types for the submission data structure
interface SubmissionFile {
  [path: string]: string;
}

interface QuestionSubmission {
  questionId: number;
  questionTitle: string;
  questionDescription: string;
  template: string;
  submitted: boolean;
  submissionDate: Date | string;
  files: SubmissionFile;
}

interface SubmissionData {
  sessionId: string;
  startTime: string;
  lastUpdated?: string;
  submissions: {
    [questionId: string]: QuestionSubmission;
  };
}

export async function POST(request: Request) {
  try {
    const submissionData = await request.json();
    
    // Use the session ID from the request for the filename
    const sessionId = submissionData.sessionId;
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'No session ID provided' },
        { status: 400 }
      );
    }
    
    const filename = `question-submission-${sessionId}.json`;
    
    // Path to save the file
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, filename);
    
    // Ensure the data directory exists
    try {
      await access(dataDir, constants.F_OK);
    } catch (err) {
      // Directory doesn't exist, create it
      await mkdir(dataDir, { recursive: true });
    }
    
    // Check if the file already exists
    let existingData: SubmissionData;
    try {
      await access(filePath, constants.F_OK);
      // File exists, read it
      const fileContent = await readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist or can't be read, create a new one
      existingData = {
        sessionId: sessionId,
        startTime: new Date().toISOString(),
        submissions: {}
      };
    }
    
    // Update the existing data with the new submission
    const questionId = submissionData.questionId.toString();
    
    // Add the submission to the existing data, keyed by question ID
    existingData.submissions[questionId] = {
      questionId: submissionData.questionId,
      questionTitle: submissionData.questionTitle,
      questionDescription: submissionData.questionDescription,
      template: submissionData.template,
      submitted: submissionData.submitted,
      submissionDate: submissionData.submissionDate,
      files: submissionData.files
    };
    
    // Update the last updated timestamp
    existingData.lastUpdated = new Date().toISOString();
    
    // Convert data to JSON string with pretty formatting
    const jsonData = JSON.stringify(existingData, null, 2);
    
    // Write the file
    await writeFile(filePath, jsonData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Submission saved successfully', 
      filename,
      isNewFile: Object.keys(existingData.submissions).length === 1
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save submission' },
      { status: 500 }
    );
  }
} 
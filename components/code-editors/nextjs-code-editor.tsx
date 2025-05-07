'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { sandpackDark } from '@codesandbox/sandpack-themes';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import FileExplorerWithControls from '../file-explorer/FileExplorerWithControls';

const template = {
  template: 'nextjs' as const,
  files: {
    '/pages/index.js': `export default function Home() {
  return (
    <div>
      <h1>Hello Next.js!</h1>
    </div>
  );
}`,
  },
};

interface CustomFiles {
  [filePath: string]: string;
}

interface NextjsCodeEditorProps {
  customFiles?: CustomFiles | null;
  storageKey?: string;
}

// Add this hook to handle auto-saving and loading from localStorage
const usePersistentSandpack = (customFiles: CustomFiles | null = null, storageKey: string = 'nextjs-sandpack-files') => {
  const [files, setFiles] = useState(customFiles || template.files);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state on initial render
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem(storageKey);
      
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles));
      } else if (customFiles) {
        // If customFiles are provided and no saved state, use them
        setFiles(customFiles);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [customFiles, storageKey]);

  return { 
    files, 
    setFiles,
    isLoaded,
    storageKey
  };
};

// Add component to handle auto-saving
const AutoSave = ({ storageKey }: { storageKey: string }) => {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Save files to localStorage every second
      const files = sandpack.files;
      localStorage.setItem(storageKey, JSON.stringify(files));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sandpack, storageKey]);
  
  return null;
};

const NextjsCodeEditor = ({ customFiles = null, storageKey = 'nextjs-sandpack-files' }: NextjsCodeEditorProps) => {
  const { 
    files, 
    setFiles,
    isLoaded 
  } = usePersistentSandpack(customFiles, storageKey);
  const [showConsole, setShowConsole] = useState(false);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset to the original template? All changes will be lost.')) {
      // Reset to the original template files
      setFiles(customFiles || template.files);
      
      // Clear localStorage
      localStorage.removeItem(storageKey);
    }
  }, [setFiles, customFiles, storageKey]);

  if (!isLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <SandpackProvider
        template={template.template}
        theme={sandpackDark}
        files={files}
        options={{
          experimental_enableServiceWorker: true,
          recompileMode: "delayed",
          recompileDelay: 500,
          autorun: true,
          autoReload: true
        }}
      >
        <AutoSave storageKey={storageKey} />
        <SandpackLayout className="flex-1 flex flex-row bg-background h-[100vh]">
          {/* File Explorer */}
          <div className="w-56 border-r bg-card h-[100vh] min-h-0 flex-shrink-0">
            <FileExplorerWithControls />
          </div>
          {/* Code Editor + Console */}
          <div className="flex-1 min-h-[100vh] border- flex flex-col">
            <div className="text-xs font-semibold text-gray-400 px-2 tracking-wide text-center bg-[#18181b] h-19 flex items-center justify-between ">
              <span className="flex-1 text-center">Code Editor</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2 border-1 border-gray-700 bg-[#18181b] hover:bg-[#232326] text-white hover:text-white"
                  title="Reset to original template"
                  aria-label="Reset to original template"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <hr className="w-full border-t border-gray-700" />
            <div className={`flex-1 flex flex-col transition-all duration-200 ${showConsole ? 'h-1/2' : 'h-full'}`}> 
              <div className={`flex-1 ${showConsole ? 'min-h-0' : ''}`}> 
                <SandpackCodeEditor
                  showLineNumbers
                  showInlineErrors
                  closableTabs 
                  showTabs
                  wrapContent
                  extensions={[autocompletion()]}
                  extensionsKeymap={[...completionKeymap]}
                  style={{
                    minHeight: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                  }}
                  key="code-editor"
                />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="w-[40vw] h-[100vh] bg-card">
            <div className="text-xs font-semibold text-gray-400 px-2 tracking-wide text-center bg-[#18181b] h-19 flex items-center justify-between">
              <div className="flex-1 text-center">Preview</div>
            </div>
            <hr className="w-full border-t border-gray-700" />
            <SandpackPreview style={{ height: '100%' }} />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default NextjsCodeEditor; 
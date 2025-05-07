'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { nightOwl, sandpackDark } from '@codesandbox/sandpack-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Code, 
  FileText, 
  Terminal, 
  Eye, 
  Plus,
  FolderPlus,
  FilePlus,
  X,
  Check,
  RotateCcw
} from 'lucide-react';
import { TemplateType, TemplateConfig } from '@/types/sandpack';
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";


// Template configurations
const templates: Record<TemplateType, TemplateConfig> = {
  react: {
    template: 'react',
    files: {
      '/App.js': `export default function App() {
  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  );
}`,
      '/index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`,
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
  },
  'react-ts': {
    template: 'react-ts',
    files: {
      '/App.tsx': `import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello React with TypeScript!</h1>
    </div>
  );
};

export default App;`,
      '/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`,
    },
  },
  vanilla: {
    template: 'vanilla',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
  <head>
    <title>Vanilla JS</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <script src="index.js"></script>
  </body>
</html>`,
      '/index.js': `console.log('Hello from JavaScript!');`,
    },
  },
  'vanilla-ts': {
    template: 'vanilla-ts',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
  <head>
    <title>Vanilla TypeScript</title>
  </head>
  <body>
    <h1>Hello TypeScript!</h1>
    <script src="index.ts"></script>
  </body>
</html>`,
      '/index.ts': `console.log('Hello from TypeScript!');`,
    },
  },
  vue: {
    template: 'vue',
    files: {
      '/src/App.vue': `<template>
  <div>
    <h1>Hello Vue!</h1>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>`,
    },
  },
  'vue-ts': {
    template: 'vue-ts',
    files: {
      '/src/App.vue': `<template>
  <div>
    <h1>Hello Vue with TypeScript!</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>`,
    },
  },


  nextjs: {
    template: 'nextjs',
    files: {
      '/pages/index.js': `export default function Home() {
  return (
    <div>
      <h1>Hello Next.js!</h1>
    </div>
  );
}`,
    },
  },



  node: {
    template: 'node',
    files: {
      '/index.js': `console.log('Hello from Node.js!');`,
    },
  },
  static: {
    template: 'static',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
  <head>
    <title>Static HTML</title>
  </head>
  <body>
    <h1>Hello Static HTML!</h1>
  </body>
</html>`,
    },
  },
 
  angular: {
    template: 'angular',
    files: {
      '/src/app/app.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello Angular!</h1>'
})
export class AppComponent {}`,
    },
  },
};

const FileExplorerWithControls = () => {
  const { sandpack } = useSandpack();
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const handleCreateFile = () => {
    if (newFileName) {
      sandpack.addFile(newFileName, '');
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName) {
      const folderPath = newFolderName.split('/').filter(Boolean);
      let currentPath = '';
      
      folderPath.forEach((folder, index) => {
        currentPath += (index === 0 ? '' : '/') + folder;
        sandpack.addFile(`${currentPath}/.keep`, '');
      });

      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'file' | 'folder') => {
    if (e.key === 'Enter') {
      type === 'file' ? handleCreateFile() : handleCreateFolder();
    } else if (e.key === 'Escape') {
      type === 'file' ? setShowNewFileInput(false) : setShowNewFolderInput(false);
      type === 'file' ? setNewFileName('') : setNewFolderName('');
    }
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="p-2 border-b bg-[#18181b] space-y-2">
        <div className="text-xs font-semibold text-gray-400 px-2 tracking-wide text-center">
          File Explorer
        </div>
        <div className="flex flex-col gap-2 justify-between items-center">
          {!showNewFileInput && !showNewFolderInput ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewFileInput(true)}
                className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-gray-300 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-primary/40"
                title="New File"
                aria-label="New File"
              >
                <FilePlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowNewFolderInput(true)}
                className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-gray-300 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-primary/40"
                title="New Folder"
                aria-label="New Folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {showNewFileInput && (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, 'file')}
                    placeholder="File name (e.g., src/components/Button.js)"
                    className="w-full px-2 py-1.5 bg-[#232326] border border-[#232326] rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateFile}
                    className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-green-400 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-green-700/40"
                    title="Create file"
                    aria-label="Create file"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { setShowNewFileInput(false); setNewFileName(''); }}
                    className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-red-400 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-red-700/40"
                    title="Cancel"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {showNewFolderInput && (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, 'folder')}
                    placeholder="Folder path (e.g., src/components)"
                    className="w-full px-2 py-1.5 bg-[#232326] border border-[#232326] rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateFolder}
                    className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-green-400 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-green-700/40"
                    title="Create folder"
                    aria-label="Create folder"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { setShowNewFolderInput(false); setNewFolderName(''); }}
                    className="rounded bg-[#232326] hover:bg-[#23232b] transition-colors p-2 flex items-center justify-center text-red-400 border border-[#232326] focus:outline-none focus:ring-2 focus:ring-red-700/40"
                    title="Cancel"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <SandpackFileExplorer style={{ height: '100%' }} />
      </div>
    </div>
  );
};

// Add this hook to handle auto-saving and loading from localStorage
const usePersistentSandpack = (initialTemplate: TemplateType) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(initialTemplate);
  const [files, setFiles] = useState(templates[initialTemplate].files);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state on initial render
  useEffect(() => {
    try {
      const savedTemplate = localStorage.getItem('sandpack-template');
      const savedFiles = localStorage.getItem('sandpack-files');
      
      if (savedTemplate && savedFiles) {
        // Validate that the template exists in our templates object
        const validTemplate = Object.keys(templates).includes(savedTemplate) 
          ? savedTemplate as TemplateType 
          : initialTemplate;
        
        setActiveTemplate(validTemplate);
        setFiles(JSON.parse(savedFiles));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [initialTemplate]);

  // Return current state for initial render
  if (!isLoaded) {
    return { 
      activeTemplate, 
      setActiveTemplate, 
      files, 
      setFiles,
      isLoaded 
    };
  }

  return { 
    activeTemplate, 
    setActiveTemplate, 
    files, 
    setFiles,
    isLoaded 
  };
};

// Add component to handle auto-saving
const AutoSave = () => {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Save files to localStorage every second
      const files = sandpack.files;
      localStorage.setItem('sandpack-files', JSON.stringify(files));
      // Get active template from localStorage instead
      const currentTemplate = localStorage.getItem('sandpack-template');
      if (currentTemplate) {
        // Only save if it exists already (it should from the dropdown)
        localStorage.setItem('sandpack-template', currentTemplate);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sandpack]);
  
  return null;
};

const CodeEditor = () => {
  const { 
    activeTemplate, 
    setActiveTemplate, 
    files, 
    setFiles,
    isLoaded 
  } = usePersistentSandpack('react');
  const [showConsole, setShowConsole] = useState(false);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset to the original template? All changes will be lost.')) {
      // Reset to the original template files
      setFiles(templates[activeTemplate].files);
      
      // Clear localStorage
      localStorage.removeItem('sandpack-files');
      
      // Keep the current template but reset its files
      localStorage.setItem('sandpack-template', activeTemplate);
    }
  }, [activeTemplate, setFiles]);

  if (!isLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      
      <SandpackProvider
        template={templates[activeTemplate].template}
        theme={sandpackDark}
        files={files}
        customSetup={{
          dependencies: templates[activeTemplate].dependencies || {},
        }}
        options={{
          experimental_enableServiceWorker: true,
          recompileMode: "delayed",
          recompileDelay: 500,
          autorun: true,
          autoReload: true
        }}
      >
        <AutoSave />
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
                {/* <Button
                  variant={showConsole ? 'secondary' : 'outline'}
                  size="icon"
                  className="border-1 border-gray-700 bg-[#18181b] hover:bg-[#232326] text-white hover:text-white"
                  title={showConsole ? 'Hide Console' : 'Show Console'}
                  aria-label="Toggle Console"
                  onClick={() => setShowConsole(prev => !prev)}
                >
                  <Terminal className="h-4 w-4" />
                </Button> */}
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
              {/* {showConsole && (
                <div className="h-64 border-t border-gray-700 bg-[#18181b]">
                  <div className="text-xs font-semibold text-gray-400 px-2 tracking-wide text-center bg-[#18181b] h-10 flex items-center justify-between">
                    <span className="flex-1 text-center">Console</span>
                  </div>
                  <SandpackConsole 
                    // style={{ height: '100%' }} 
                  />
                </div>
              )} */}
            </div>
          </div>
          {/* Preview */}
          <div className="w-[40vw] h-[100vh] bg-card">
            <div className="text-xs font-semibold text-gray-400 px-2 tracking-wide text-center bg-[#18181b] h-19 flex items-center justify-between">
              <div className="flex-1 text-center">Preview</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 bg-[#18181b] hover:bg-gray-700] hover:text-white"
                    onClick={() => {
                      // Save current template selection to localStorage
                      localStorage.setItem('sandpack-template', activeTemplate);
                      
                    }}
                  >
                    Template: {activeTemplate}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-[#18181b] text-white">
                  {Object.keys(templates).map((template) => (
                    <DropdownMenuItem
                      key={template}
                      onClick={() => {
                        setActiveTemplate(template as TemplateType);
                        localStorage.setItem('sandpack-template', template);
                        handleReset();
                      }}
                      className="hover:bg-gray-700 hover:text-white"
                    >
                      {template}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <hr className="w-full border-t border-gray-700" />
            <SandpackPreview style={{ height: '100%' }} />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default CodeEditor;
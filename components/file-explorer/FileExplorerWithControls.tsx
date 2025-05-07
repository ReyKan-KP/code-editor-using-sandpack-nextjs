'use client';

import React, { useState } from 'react';
import { SandpackFileExplorer, useSandpack } from '@codesandbox/sandpack-react';
import { FilePlus, FolderPlus, Check, X } from 'lucide-react';

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

export default FileExplorerWithControls; 
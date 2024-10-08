import React, { useState } from 'react'
import { FileText, Folder, Plus, Trash2 } from 'lucide-react'

interface File {
  name: string
  content: string
  type: 'file' | 'folder'
  children?: File[]
}

interface FileExplorerProps {
  files: File[]
  onFileSelect: (file: File) => void
  onCreateFile: (parentPath: string[], name: string, type: 'file' | 'folder') => void
  onDeleteFile: (path: string[]) => void
  parentPath?: string[]
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFileSelect, 
  onCreateFile, 
  onDeleteFile, 
  parentPath = [] 
}) => {
  const [newItemName, setNewItemName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateNew = () => {
    if (newItemName) {
      const hasExtension = newItemName.includes('.')
      const type = hasExtension ? 'file' : 'folder'
      onCreateFile(parentPath, newItemName, type)
      setNewItemName('')
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateNew()
    }
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li key={file.name}>
          <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded">
            <div 
              className="flex items-center cursor-pointer truncate flex-grow"
              onClick={() => onFileSelect(file)}
            >
              {file.type === 'file' ? (
                <FileText className="flex-shrink-0 w-5 h-5 mr-2" />
              ) : (
                <Folder className="flex-shrink-0 w-5 h-5 mr-2" />
              )}
              <span className="truncate">{file.name}</span>
            </div>
            <Trash2 
              className="flex-shrink-0 w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500 ml-2"
              onClick={() => onDeleteFile([...parentPath, file.name])}
            />
          </div>
          {file.type === 'folder' && file.children && (
            <div className="ml-4 mt-2">
              <FileExplorer
                files={file.children}
                onFileSelect={onFileSelect}
                onCreateFile={onCreateFile}
                onDeleteFile={onDeleteFile}
                parentPath={[...parentPath, file.name]}
              />
            </div>
          )}
        </li>
      ))}
      {isCreating ? (
        <li className="flex items-center space-x-2 p-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            placeholder="Name (with extension for file)"
            autoFocus
          />
        </li>
      ) : (
        <li 
          className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="flex-shrink-0 w-5 h-5 mr-2" />
          <span className="truncate">New File or Folder</span>
        </li>
      )}
    </ul>
  )
}

export default FileExplorer
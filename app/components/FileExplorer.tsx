import React, { useState } from 'react'
import { FileText, Folder, Plus, Trash2, Edit2 } from 'lucide-react'

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
  onRenameFile: (path: string[], newName: string) => void
  parentPath?: string[]
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFileSelect, 
  onCreateFile, 
  onDeleteFile,
  onRenameFile, 
  parentPath = [] 
}) => {
  const [newItemName, setNewItemName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState('')

  const handleCreateNew = () => {
    if (newItemName) {
      const hasExtension = newItemName.includes('.')
      const type = hasExtension ? 'file' : 'folder'
      onCreateFile(parentPath, newItemName, type)
      setNewItemName('')
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: 'create' | 'rename') => {
    if (e.key === 'Enter') {
      if (action === 'create') {
        handleCreateNew()
      } else if (action === 'rename' && renamingFile) {
        handleRename(renamingFile)
      }
    } else if (e.key === 'Escape') {
      if (action === 'create') {
        setIsCreating(false)
      } else if (action === 'rename') {
        setRenamingFile(null)
      }
    }
  }

  const startRenaming = (fileName: string) => {
    setRenamingFile(fileName)
    setNewFileName(fileName)
  }

  const handleRename = (oldName: string) => {
    if (newFileName && newFileName !== oldName) {
      onRenameFile([...parentPath, oldName], newFileName)
    }
    setRenamingFile(null)
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li key={file.name}>
          <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded">
            {renamingFile === file.name ? (
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'rename')}
                onBlur={() => handleRename(file.name)}
                className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                autoFocus
              />
            ) : (
              <>
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
                <div className="flex items-center">
                  <Edit2 
                    className="flex-shrink-0 w-4 h-4 cursor-pointer text-gray-400 hover:text-blue-500 ml-2"
                    onClick={() => startRenaming(file.name)}
                  />
                  <Trash2 
                    className="flex-shrink-0 w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500 ml-2"
                    onClick={() => onDeleteFile([...parentPath, file.name])}
                  />
                </div>
              </>
            )}
          </div>
          {file.type === 'folder' && file.children && (
            <div className="ml-4 mt-2">
              <FileExplorer
                files={file.children}
                onFileSelect={onFileSelect}
                onCreateFile={onCreateFile}
                onDeleteFile={onDeleteFile}
                onRenameFile={onRenameFile}
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
            onKeyDown={(e) => handleKeyDown(e, 'create')}
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
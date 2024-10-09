"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import FileExplorer from './components/FileExplorer'
import Terminal from './components/Terminal'
import DownloadButton from './components/DownloadButton'
import Tabs from './components/Tabs'

const Editor = dynamic(() => import('./components/Editor'), { ssr: false })

interface File {
  name: string
  content: string
  type: 'file' | 'folder'
  children?: File[]
}

const initialFiles: File[] = [
  { name: 'index.html', content: '<h1>Hello, World!</h1>', type: 'file' },
  { name: 'styles.css', content: 'body { font-family: sans-serif; }', type: 'file' },
]

export default function Home() {
  const [files, setFiles] = useState<File[]>(initialFiles)
  const [openFiles, setOpenFiles] = useState<string[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleFileSelect = (file: File) => {
    if (file.type === 'file') {
      if (!openFiles.includes(file.name)) {
        setOpenFiles([...openFiles, file.name])
      }
      setActiveFile(file.name)
    }
  }

  const handleTabSelect = (fileName: string) => {
    setActiveFile(fileName)
  }

  const handleTabClose = (fileName: string) => {
    const newOpenFiles = openFiles.filter((name) => name !== fileName)
    setOpenFiles(newOpenFiles)
    if (activeFile === fileName) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null)
    }
  }

  const handleCreateFile = (parentPath: string[], name: string, type: 'file' | 'folder') => {
    const newFile: File = {
      name,
      content: type === 'file' ? '' : '',
      type,
      children: type === 'folder' ? [] : undefined
    }

    const updateFiles = (files: File[], path: string[]): File[] => {
      if (path.length === 0) {
        return [...files, newFile]
      }

      return files.map(file => {
        if (file.name === path[0] && file.type === 'folder') {
          return {
            ...file,
            children: updateFiles(file.children || [], path.slice(1))
          }
        }
        return file
      })
    }

    setFiles(updateFiles(files, parentPath))
  }

  const handleDeleteFile = (path: string[]) => {
    const deleteFromFiles = (files: File[], path: string[]): File[] => {
      if (path.length === 1) {
        return files.filter(file => file.name !== path[0])
      }

      return files.map(file => {
        if (file.name === path[0] && file.type === 'folder') {
          return {
            ...file,
            children: deleteFromFiles(file.children || [], path.slice(1))
          }
        }
        return file
      })
    }

    setFiles(deleteFromFiles(files, path))
    const fileName = path[path.length - 1]
    if (openFiles.includes(fileName)) {
      handleTabClose(fileName)
    }
  }

  const handleUpdateFile = (path: string[], content: string) => {
    const updateInFiles = (files: File[], path: string[]): File[] => {
      if (path.length === 1) {
        return files.map(file => 
          file.name === path[0] ? { ...file, content } : file
        )
      }

      return files.map(file => {
        if (file.name === path[0] && file.type === 'folder') {
          return {
            ...file,
            children: updateInFiles(file.children || [], path.slice(1))
          }
        }
        return file
      })
    }

    setFiles(updateInFiles(files, path))
  }

  const handleRenameFile = (path: string[], newName: string) => {
    const renameInFiles = (files: File[], path: string[]): File[] => {
      if (path.length === 1) {
        return files.map(file => 
          file.name === path[0] ? { ...file, name: newName } : file
        )
      }

      return files.map(file => {
        if (file.name === path[0] && file.type === 'folder') {
          return {
            ...file,
            children: renameInFiles(file.children || [], path.slice(1))
          }
        }
        return file
      })
    }

    setFiles(renameInFiles(files, path))

    // Update openFiles and activeFile if the renamed file was open
    const oldFileName = path[path.length - 1]
    if (openFiles.includes(oldFileName)) {
      setOpenFiles(openFiles.map(name => name === oldFileName ? newName : name))
      if (activeFile === oldFileName) {
        setActiveFile(newName)
      }
    }
  }

  const toggleTerminal = () => {
    setIsTerminalCollapsed(!isTerminalCollapsed)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const getFileContent = (fileName: string): string => {
    const file = files.find(f => f.name === fileName)
    return file ? file.content : ''
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center bg-[#181818] text-white p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 lg:hidden">
            ☰
          </button>
          <a href='/' className="text-2xl font-bold">Webflix IDX</a>
        </div>
        <DownloadButton files={files} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`${isSidebarOpen ? 'w-full lg:w-80' : 'w-0'} bg-[#181818] text-white overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? '' : 'hidden lg:block lg:w-0'}`}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">File Explorer</h2>
            <FileExplorer 
            files={files} 
            onFileSelect={handleFileSelect}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
          />
          </div>
        </div>
        <div className="flex-1 flex flex-col text-gray-500 bg-[#1f1f1f] overflow-hidden">
          <Tabs
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectTab={handleTabSelect}
            onCloseTab={handleTabClose}
          />
          <div className={`flex-1 overflow-auto ${isTerminalCollapsed ? 'flex-grow' : ''}`}>
            {activeFile ? (
              <Editor 
                file={{ name: activeFile, content: getFileContent(activeFile), type: 'file' }}
                onUpdateFile={(content) => handleUpdateFile([activeFile], content)} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 bg-[#1f1f1f]">
                Select a file to edit
              </div>
            )}
          </div>
          <Terminal 
            className={isTerminalCollapsed ? 'h-10' : 'h-1/4 min-h-[150px]'}
            isCollapsed={isTerminalCollapsed}
            onToggleCollapse={toggleTerminal}
          />
        </div>
      </div>
    </div>
  )
}
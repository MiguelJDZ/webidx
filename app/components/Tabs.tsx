import React from 'react'
import { X } from 'lucide-react'

interface TabsProps {
  openFiles: string[]
  activeFile: string | null
  onSelectTab: (fileName: string) => void
  onCloseTab: (fileName: string) => void
}

const Tabs: React.FC<TabsProps> = ({ openFiles, activeFile, onSelectTab, onCloseTab }) => {
  return (
    <div className="flex bg-[#252526] text-gray-300 overflow-x-auto">
      {openFiles.map((fileName) => (
        <div
          key={fileName}
          className={`flex items-center px-2 sm:px-4 py-2 cursor-pointer border-r border-gray-700 ${
            activeFile === fileName ? 'bg-[#1e1e1e] text-white' : 'hover:bg-[#2d2d2d]'
          }`}
          onClick={() => onSelectTab(fileName)}
        >
          <span className="mr-2 truncate max-w-[100px] sm:max-w-[150px]">{fileName}</span>
          <button
            className="focus:outline-none hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onCloseTab(fileName)
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Tabs
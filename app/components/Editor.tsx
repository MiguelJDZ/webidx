import React from 'react'
import Editor, { useMonaco } from "@monaco-editor/react";

interface File {
  name: string
  content: string
  type: 'file' | 'folder'
}

interface EditorProps {
  file: File
  onUpdateFile: (content: string) => void
}

const getLanguage = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    default:
      return 'plaintext'
  }
}

const MonacoEditor: React.FC<EditorProps> = ({ file, onUpdateFile }) => {

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onUpdateFile(value);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <div className="bg-[#181818] p-2 font-semibold text-white">{file.name}</div>
      <Editor
        height="100%"
        language={getLanguage(file.name)}
        value={file.content}
        theme='vs-dark'
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          tabCompletion: 'on',
          wordWrap: 'on',
          autoSurround: "languageDefined",
          scrollBeyondLastLine: false,
          acceptSuggestionOnEnter: 'on',
          automaticLayout: true,
          formatOnType: true,
          minimap: { scale: 10 }
        }}
      />
    </div>
  )
}

export default MonacoEditor
import React, { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface TerminalProps {
  className?: string
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const Terminal: React.FC<TerminalProps> = ({ className, isCollapsed, onToggleCollapse }) => {
  const [output, setOutput] = useState<string[]>(['$ C:/Users/John/Doe/Internet/Project1'])
  const [input, setInput] = useState('')
  const outputEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [output])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setOutput([...output, `$ ${input}`, 'Command not implemented'])
      setInput('')
    }
  }

  return (
    <div className={`bg-[#181818] text-green-400 flex flex-col ${className}`}>
      <div className="flex justify-between items-center p-2 bg-[#202020] text-white">
        <span className="truncate">Terminal</span>
        <button onClick={onToggleCollapse} className="focus:outline-none">
          {isCollapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-xs sm:text-sm">
            {output.map((line, index) => (
              <div key={index} className="break-all">{line}</div>
            ))}
            <div ref={outputEndRef} />
          </div>
          <form onSubmit={handleInputSubmit} className="mt-2 flex p-2">
            <span className="mr-2">$</span>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow bg-transparent outline-none text-xs sm:text-sm"
              placeholder="Enter command..."
            />
          </form>
        </>
      )}
    </div>
  )
}

export default Terminal
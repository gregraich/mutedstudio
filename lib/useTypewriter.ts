import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed: number = 100) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete }
} 
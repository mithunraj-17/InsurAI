import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './ModernUI.css'

const VoiceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your InsurAI assistant. How can I help you today?' }
  ])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleUserMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const handleUserMessage = async (text) => {
    setMessages(prev => [...prev, { type: 'user', text }])
    
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.post(`http://localhost:8080/api/chatbot/chat?userId=${userId}`, {
        message: text
      })
      
      const aiResponse = response.data.message
      setMessages(prev => [...prev, { type: 'bot', text: aiResponse }])
      speak(aiResponse)
    } catch (error) {
      const fallbackResponse = 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.'
      setMessages(prev => [...prev, { type: 'bot', text: fallbackResponse }])
      speak(fallbackResponse)
    }
  }



  const sendTextMessage = (e) => {
    e.preventDefault()
    const input = e.target.message
    if (input.value.trim()) {
      handleUserMessage(input.value)
      input.value = ''
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '2rem',
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid var(--gray-200)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🤖</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>InsurAI Assistant</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                {isSpeaking ? 'Speaking...' : 'Online'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : 'var(--gray-100)',
                  color: msg.type === 'user' ? 'white' : 'var(--gray-800)',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--gray-200)',
            background: 'var(--gray-50)'
          }}>
            {/* Voice Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              gap: '0.5rem'
            }}>
              <button
                onClick={isListening ? stopListening : startListening}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: isListening 
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, var(--success), #059669)',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {isListening ? '🛑 Stop' : '🎤 Speak'}
              </button>
            </div>

            {/* Text Input */}
            <form onSubmit={sendTextMessage}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  name="message"
                  type="text"
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  📤
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default VoiceChatbot
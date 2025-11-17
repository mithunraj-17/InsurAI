import { useState, useRef, useEffect } from 'react'

const OTPInput = ({ length = 6, onComplete, value = '' }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputRefs = useRef([])

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length)
      while (otpArray.length < length) otpArray.push('')
      setOtp(otpArray)
    }
  }, [value, length])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus()
    }

    const otpValue = [...otp.map((d, idx) => (idx === index ? element.value : d))].join('')
    if (otpValue.length === length) {
      onComplete(otpValue)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, length)
    const otpArray = pasteData.split('')
    while (otpArray.length < length) otpArray.push('')
    setOtp(otpArray)
    onComplete(pasteData)
  }

  return (
    <div className="otp-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className={`otp-input ${data ? 'filled' : ''}`}
          value={data}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={el => inputRefs.current[index] = el}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}

export default OTPInput
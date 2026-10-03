import { useState } from 'react'
import FrogMascot from '../../components/FrogMascot'

interface Props {
  onAccess: (name: string) => void
}

export default function LearnerAccess({ onAccess }: Props) {
  const [code, setCode] = useState<string>('')

  const isDisabled = code.trim() === ''

  const handleSubmit = () => {
    if (isDisabled) return
    if (code.trim() === 'TALAS2024') {
      onAccess('Amina Santos')
    } else {
      onAccess('Mag-aaral')
    }
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--talas-paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: "'Comfortaa', system-ui, sans-serif",
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--talas-green)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          TALAS
        </div>

        {/* Frog */}
        <FrogMascot size={120} />

        {/* Heading */}
        <h1
          style={{
            margin: 0,
            fontFamily: "'Comfortaa', system-ui, sans-serif",
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--talas-charcoal)',
            textAlign: 'center',
          }}
        >
          Kumusta! Sino ka?
        </h1>

        {/* Subtext */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Quicksand', system-ui, sans-serif",
            fontSize: '14px',
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          I-type ang iyong Student Code
        </p>

        {/* Input */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Student Code..."
          aria-label="Student Code"
          autoComplete="off"
          style={{
            width: '100%',
            minHeight: '56px',
            borderRadius: '16px',
            border: '2px solid #D1FAE5',
            fontSize: '18px',
            fontFamily: "'Quicksand', system-ui, sans-serif",
            padding: '0 16px',
            color: 'var(--talas-charcoal)',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--talas-green)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#D1FAE5' }}
        />

        {/* Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{
            width: '100%',
            minHeight: '56px',
            background: 'var(--talas-green)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 600,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          Pumasok →
        </button>

        {/* Help text */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Quicksand', system-ui, sans-serif",
            fontSize: '12px',
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          Kailangan ng tulong? Makipag-ugnayan sa iyong Guro.
        </p>
      </div>
    </div>
  )
}

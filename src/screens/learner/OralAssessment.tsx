import { useState, useEffect } from 'react'
import FrogMascot from '../../components/FrogMascot'

interface Props {
  onBack: () => void
  onSubmit: () => void
}

const ORAL_PASSAGE =
  "Masaya si Maya sa bukid. Nakakita siya ng mga paru-paro sa paligid ng mga bulaklak. Tumakbo siya patungo sa kanyang nanay at sinabi, 'Nanay, maganda ang mga paru-paro!' Ngumiti ang kanyang nanay at sinabing, 'Oo, mahal. Ingatan natin sila.'"

const words = ORAL_PASSAGE.split(' ')

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function OralAssessment({ onBack, onSubmit }: Props) {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [hasStopped, setHasStopped] = useState<boolean>(false)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0)

  // Timer effect
  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isRecording])

  // Word advance effect
  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => {
      setActiveWordIndex((prev) => {
        if (prev >= words.length - 1) {
          setIsRecording(false)
          setHasStopped(true)
          return words.length - 1
        }
        return prev + 1
      })
    }, 1500)
    return () => clearInterval(id)
  }, [isRecording])

  const handleBack = () => {
    if (window.confirm('Sigurado ka bang gusto mong bumalik?')) {
      onBack()
    }
  }

  const handleUlitin = () => {
    setActiveWordIndex(0)
    setElapsedSeconds(0)
    setIsRecording(false)
    setHasStopped(false)
  }

  const showControls = isRecording || hasStopped

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'var(--talas-paper)',
        minHeight: '100svh',
      }}
    >
      {/* MINIMAL TOP BAR */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #E8F8EC',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            minHeight: '48px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '14px',
            border: 'none',
            background: 'transparent',
            color: 'var(--talas-blue)',
            cursor: 'pointer',
            padding: '0 8px',
          }}
        >
          ← Bumalik
        </button>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--talas-charcoal)',
          }}
        >
          Pasalitang Pagbasa
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          Pahina 1 ng 1
        </div>
      </div>

      {/* CONTENT AREA */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* TOP ROW: Camera + Timer */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
          }}
        >
          {/* Camera panel */}
          <div
            style={{
              width: '140px',
              height: '100px',
              flexShrink: 0,
              background: '#F3F4F6',
              borderRadius: '16px',
              border: '2px dashed #D1D5DB',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '24px' }}>📷</span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              Ikaw
            </span>
          </div>

          {/* Timer */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Comfortaa', system-ui, sans-serif",
                fontSize: '40px',
                fontWeight: 700,
                color: isRecording ? 'var(--talas-coral)' : 'var(--talas-charcoal)',
              }}
            >
              {formatTime(elapsedSeconds)}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
                textAlign: 'right',
              }}
            >
              Oras
            </div>
          </div>
        </div>

        {/* PASSAGE CARD */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #E8F8EC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--talas-green)',
              marginBottom: '12px',
            }}
          >
            BASAHIN NANG MALAKAS
          </div>

          {/* Words */}
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '18px',
              lineHeight: 2.2,
            }}
          >
            {words.map((word, index) => {
              let spanStyle: React.CSSProperties = {}
              if (index < activeWordIndex) {
                spanStyle = { color: 'var(--talas-green)', opacity: 0.6 }
              } else if (index === activeWordIndex) {
                spanStyle = {
                  background: 'var(--talas-yellow)',
                  color: 'var(--talas-charcoal)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: 700,
                }
              } else {
                spanStyle = { color: 'var(--talas-charcoal)' }
              }
              return (
                <span key={index} style={spanStyle}>
                  {word}
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              )
            })}
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              Simula
            </span>
            <div
              style={{
                flex: 1,
                height: '6px',
                background: '#E5E7EB',
                borderRadius: '3px',
              }}
            >
              <div
                style={{
                  width: `${(activeWordIndex / (words.length - 1)) * 100}%`,
                  height: '100%',
                  background: 'var(--talas-green)',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              {activeWordIndex} / {words.length} salita
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              Katapusan
            </span>
          </div>
        </div>

        {/* FROG ENCOURAGEMENT STRIP */}
        <div
          style={{
            background: 'var(--talas-mint)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FrogMascot size={48} />
          <span
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--talas-green)',
            }}
          >
            Kaya mo 'yan! ✨
          </span>
        </div>

        {/* RECORDING CONTROLS */}
        {!showControls ? (
          <button
            type="button"
            onClick={() => setIsRecording(true)}
            style={{
              width: '100%',
              minHeight: '60px',
              background: 'var(--talas-green)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Simulan ang Pagbasa 🎙️
          </button>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}
          >
            {/* Makinig */}
            <button
              type="button"
              onClick={() => {}}
              style={{
                border: '2px solid var(--talas-blue)',
                background: 'transparent',
                color: 'var(--talas-blue)',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Makinig
            </button>

            {/* Ulitin */}
            <button
              type="button"
              onClick={handleUlitin}
              style={{
                border: '2px solid var(--talas-charcoal)',
                background: 'transparent',
                color: 'var(--talas-charcoal)',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ulitin
            </button>

            {/* IHINTO */}
            <button
              type="button"
              disabled={!isRecording}
              onClick={() => { setIsRecording(false); setHasStopped(true) }}
              style={{
                border: '2px solid var(--talas-coral)',
                background: 'transparent',
                color: 'var(--talas-coral)',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: isRecording ? 'pointer' : 'not-allowed',
                opacity: isRecording ? 1 : 0.4,
              }}
            >
              IHINTO
            </button>

            {/* Ipasa */}
            <button
              type="button"
              disabled={!hasStopped}
              onClick={onSubmit}
              style={{
                background: hasStopped ? 'var(--talas-green)' : '#D1FAE5',
                color: hasStopped ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                cursor: hasStopped ? 'pointer' : 'not-allowed',
              }}
            >
              Ipasa →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

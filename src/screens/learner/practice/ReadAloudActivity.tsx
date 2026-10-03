import { useState } from 'react'
import { readAloudPassage } from '../../../data/practiceData'

interface Props {
  onComplete: (scorePercent: number) => void
  onBack: () => void
}

function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        background: 'white',
        borderBottom: '1px solid #E8F8EC',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          minHeight: '48px',
          minWidth: '48px',
          background: 'transparent',
          border: 'none',
          color: 'var(--talas-blue)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '14px',
          cursor: 'pointer',
          padding: '0 8px',
        }}
      >
        ←
      </button>
      <div
        style={{
          flex: 1,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--talas-charcoal)',
        }}
      >
        🗣️ Basahin Natin
      </div>
      <span
        style={{
          background: 'var(--talas-buttercream)',
          color: '#92400E',
          borderRadius: '999px',
          padding: '4px 10px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        Pagsasanay sa Pagbasa
      </span>
    </div>
  )
}

export default function ReadAloudActivity({ onComplete, onBack }: Props) {
  const { title, sentences } = readAloudPassage
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [speaking, setSpeaking] = useState(false)

  const handleSpeak = (index: number, text: string) => {
    // Use Web Speech API if available; fall back silently
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'fil-PH'
      utter.rate = 0.85
      setSpeaking(true)
      setHighlightIndex(index)
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utter)
    } else {
      // Just highlight without audio
      setHighlightIndex(index)
    }
  }

  const handleSpeakAll = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const fullText = sentences.join(' ')
      const utter = new SpeechSynthesisUtterance(fullText)
      utter.lang = 'fil-PH'
      utter.rate = 0.85
      setSpeaking(true)
      setHighlightIndex(0)
      // Approximate word-by-word highlight by timing
      let sentenceIndex = 0
      const avgDuration = (fullText.length / sentences.length) * 60  // rough ms per sentence
      const interval = setInterval(() => {
        sentenceIndex++
        if (sentenceIndex >= sentences.length) {
          clearInterval(interval)
          setHighlightIndex(null)
        } else {
          setHighlightIndex(sentenceIndex)
        }
      }, avgDuration)
      utter.onend = () => {
        clearInterval(interval)
        setSpeaking(false)
        setHighlightIndex(null)
      }
      utter.onerror = () => {
        clearInterval(interval)
        setSpeaking(false)
      }
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <div style={{ width: 'min(640px, 100%)', margin: '0 auto', minHeight: '100svh', background: 'var(--talas-paper)' }}>
      <TopBar onBack={onBack} />
      <div style={{ padding: 'clamp(12px, 4vw, 24px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Instruction card */}
        <div
          style={{
            background: 'var(--talas-buttercream)',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #FFE08A',
            fontFamily: "'Quicksand', system-ui, sans-serif",
            fontSize: '14px',
            color: '#92400E',
          }}
        >
          📣 Basahin nang malakas ang bawat pangungusap. I-tap ang 🔊 para marinig ang tamang pagbigkas.
        </div>

        {/* Story title */}
        <div
          style={{
            fontFamily: "'Comfortaa', system-ui, sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--talas-charcoal)',
          }}
        >
          {title}
        </div>

        {/* Sentence cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sentences.map((sentence, i) => {
            const isHighlighted = highlightIndex === i
            return (
              <div
                key={i}
                style={{
                  background: isHighlighted ? 'var(--talas-mint)' : 'white',
                  border: `2px solid ${isHighlighted ? 'var(--talas-green)' : '#E5E7EB'}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {/* Sentence number */}
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    flexShrink: 0,
                    background: isHighlighted ? 'var(--talas-green)' : '#F3F4F6',
                    color: isHighlighted ? 'white' : '#9CA3AF',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>

                {/* Sentence text */}
                <span
                  style={{
                    flex: 1,
                    fontFamily: "'Quicksand', system-ui, sans-serif",
                    fontSize: '17px',
                    lineHeight: 1.6,
                    color: 'var(--talas-charcoal)',
                    fontWeight: isHighlighted ? 700 : 400,
                  }}
                >
                  {sentence}
                </span>

                {/* Listen button */}
                <button
                  type="button"
                  onClick={() => handleSpeak(i, sentence)}
                  disabled={speaking}
                  style={{
                    minWidth: '48px',
                    minHeight: '48px',
                    background: isHighlighted ? 'var(--talas-green)' : 'var(--talas-sky)',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    cursor: speaking ? 'not-allowed' : 'pointer',
                    opacity: speaking && !isHighlighted ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  🔊
                </button>
              </div>
            )
          })}
        </div>

        {/* Play all button */}
        <button
          type="button"
          onClick={handleSpeakAll}
          disabled={speaking}
          style={{
            width: '100%',
            minHeight: '52px',
            background: 'transparent',
            border: '2px solid var(--talas-blue)',
            color: 'var(--talas-blue)',
            borderRadius: '16px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            cursor: speaking ? 'not-allowed' : 'pointer',
            opacity: speaking ? 0.5 : 1,
          }}
        >
          {speaking ? '▶ Nagpapatugtog...' : '▶ Pakinggan ang Buong Kwento'}
        </button>

        {/* Done button */}
        <button
          type="button"
          onClick={() => onComplete(-1)}
          style={{
            width: '100%',
            minHeight: '56px',
            background: 'var(--talas-green)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Tapos na akong Basahin ✓
        </button>
      </div>
    </div>
  )
}

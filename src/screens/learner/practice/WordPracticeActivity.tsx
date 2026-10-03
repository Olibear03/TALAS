import { useState } from 'react'
import { wordPracticeItems } from '../../../data/practiceData'

interface Props {
  onComplete: (scorePercent: number) => void
  onBack: () => void
}

export default function WordPracticeActivity({ onComplete, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const item = wordPracticeItems[index]
  const isLast = index === wordPracticeItems.length - 1
  const choiceLabels = ['A', 'B', 'C', 'D']

  // Split sentence on ___ for display
  const parts = item.sentence.split('___')

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === item.correctIndex) setCorrectCount((c) => c + 1)
    setShowHint(false)
  }

  const handleNext = () => {
    if (isLast) { onComplete(Math.round((correctCount / wordPracticeItems.length) * 100)); return }
    setIndex((v) => v + 1)
    setSelected(null)
    setAnswered(false)
    setShowHint(false)
  }

  const TopBar = () => (
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
        ✏️ Piliin ang Tamang Salita
      </div>
      <span
        style={{
          background: 'var(--talas-mint)',
          color: 'var(--talas-green)',
          borderRadius: '999px',
          padding: '4px 10px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        Pagsasanay
      </span>
    </div>
  )

  const correctWord = item.choices[item.correctIndex]

  return (
    <div style={{ width: 'min(640px, 100%)', margin: '0 auto', minHeight: '100svh', background: 'var(--talas-paper)' }}>
      <TopBar />
      <div style={{ padding: 'clamp(12px, 4vw, 24px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Progress */}
        <div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12px',
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            Pangungusap {index + 1} ng {wordPracticeItems.length}
          </div>
          <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px' }}>
            <div
              style={{
                width: `${((index + (answered ? 1 : 0)) / wordPracticeItems.length) * 100}%`,
                height: '100%',
                background: 'var(--talas-green)',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Sentence card */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #E8F8EC',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9CA3AF',
              marginBottom: '16px',
            }}
          >
            KUMPLETUHIN ANG PANGUNGUSAP
          </div>
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '20px',
              lineHeight: 1.8,
              color: 'var(--talas-charcoal)',
            }}
          >
            {parts[0]}
            <span
              style={{
                display: 'inline-block',
                minWidth: '100px',
                borderBottom: answered ? 'none' : '3px solid var(--talas-yellow)',
                background: answered ? (selected === item.correctIndex ? '#D1FAE5' : '#FEE2E2') : 'var(--talas-buttercream)',
                borderRadius: answered ? '8px' : '0',
                padding: '2px 10px',
                color: answered
                  ? (selected === item.correctIndex ? 'var(--talas-green)' : 'var(--talas-coral)')
                  : '#92400E',
                fontWeight: 700,
                margin: '0 4px',
                transition: 'background 0.2s',
              }}
            >
              {answered ? correctWord : '___'}
            </span>
            {parts[1]}
          </div>
        </div>

        {/* Hint button */}
        {!answered && (
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--talas-blue)',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              padding: '4px 0',
              textAlign: 'left',
            }}
          >
            💡 {showHint ? 'Itago ang pahiwatig' : 'Ipakita ang pahiwatig'}
          </button>
        )}
        {showHint && !answered && (
          <div
            style={{
              background: 'var(--talas-sky)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: 'var(--talas-blue)',
            }}
          >
            {item.hint}
          </div>
        )}

        {/* Choices */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {item.choices.map((choice, i) => {
            let bg = 'white'
            let borderColor = '#E0E0E0'
            let icon: string | null = null
            if (answered) {
              if (i === item.correctIndex) { bg = '#D1FAE5'; borderColor = 'var(--talas-green)'; icon = '✓' }
              else if (i === selected) { bg = '#FEE2E2'; borderColor = 'var(--talas-coral)'; icon = '✗' }
            } else if (i === selected) {
              bg = 'var(--talas-sky)'; borderColor = 'var(--talas-blue)'
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                style={{
                  minHeight: '56px',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    minWidth: '18px',
                    color: '#9CA3AF',
                  }}
                >
                  {icon ?? choiceLabels[i]}
                </span>
                <span
                  style={{
                    fontFamily: "'Quicksand', system-ui, sans-serif",
                    fontSize: '15px',
                    color: 'var(--talas-charcoal)',
                    fontWeight: 600,
                  }}
                >
                  {choice}
                </span>
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {answered && selected !== null && selected !== item.correctIndex && (
          <div
            style={{
              background: '#FEE2E2',
              borderRadius: '12px',
              padding: '10px 14px',
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: 'var(--talas-coral)',
            }}
          >
            Ang tamang sagot ay: <strong>{correctWord}</strong>
          </div>
        )}

        <button
          type="button"
          disabled={!answered}
          onClick={handleNext}
          style={{
            width: '100%',
            minHeight: '56px',
            background: answered ? 'var(--talas-green)' : '#D1FAE5',
            color: answered ? 'white' : '#9CA3AF',
            border: 'none',
            borderRadius: '16px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            cursor: answered ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? 'Tapusin ✓' : 'Susunod →'}
        </button>
      </div>
    </div>
  )
}

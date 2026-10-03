import { useState } from 'react'
import { vocabularyItems } from '../../../data/practiceData'

interface Props {
  onComplete: () => void
  onBack: () => void
}

export default function VocabularyActivity({ onComplete, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const item = vocabularyItems[index]
  const isLast = index === vocabularyItems.length - 1
  const choiceLabels = ['A', 'B', 'C', 'D']

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === item.correctIndex) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    if (isLast) { setDone(true); return }
    setIndex((v) => v + 1)
    setSelected(null)
    setAnswered(false)
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
        🔤 Hanapin ang Salita
      </div>
      <span
        style={{
          background: 'var(--talas-sky)',
          color: 'var(--talas-blue)',
          borderRadius: '999px',
          padding: '4px 10px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        Bokabularyo
      </span>
    </div>
  )

  if (done) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100svh', background: 'var(--talas-paper)' }}>
        <TopBar />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '72px' }}>⭐</div>
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--talas-green)',
            }}
          >
            Magaling!
          </div>
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '18px',
              color: 'var(--talas-charcoal)',
            }}
          >
            Natapos mo ang <strong>Hanapin ang Salita</strong>.
          </div>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px 32px',
              border: '1px solid #E8F8EC',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
            }}
          >
            <span style={{ color: 'var(--talas-yellow)' }}>{correctCount}</span>
            {' '}sa {vocabularyItems.length} ang tama
          </div>
          <button
            type="button"
            onClick={onComplete}
            style={{
              width: '100%',
              maxWidth: '320px',
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
            Bumalik sa Pagsasanay
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100svh', background: 'var(--talas-paper)' }}>
      <TopBar />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            Salita {index + 1} ng {vocabularyItems.length}
          </div>
          <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px' }}>
            <div
              style={{
                width: `${((index + (answered ? 1 : 0)) / vocabularyItems.length) * 100}%`,
                height: '100%',
                background: 'var(--talas-blue)',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Word card */}
        <div
          style={{
            background: 'var(--talas-sky)',
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            border: '1px solid #BFDBFE',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--talas-blue)',
              marginBottom: '12px',
            }}
          >
            ANO ANG KAHULUGAN NITO?
          </div>
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
            }}
          >
            {item.word}
          </div>
        </div>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  width: '100%',
                  minHeight: '56px',
                  borderRadius: '14px',
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
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
                    fontSize: '13px',
                    fontWeight: 700,
                    minWidth: '20px',
                    color: answered && i === item.correctIndex
                      ? 'var(--talas-green)'
                      : answered && i === selected
                        ? 'var(--talas-coral)'
                        : '#6B7280',
                  }}
                >
                  {icon ?? choiceLabels[i]}
                </span>
                <span
                  style={{
                    fontFamily: "'Quicksand', system-ui, sans-serif",
                    fontSize: '15px',
                    color: 'var(--talas-charcoal)',
                  }}
                >
                  {choice}
                </span>
              </button>
            )
          })}
        </div>

        {/* Correct answer reveal */}
        {answered && (
          <div
            style={{
              background: 'var(--talas-mint)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: 'var(--talas-green)',
            }}
          >
            ✅ <strong>{item.word}</strong> — {item.meaning}
          </div>
        )}

        <button
          type="button"
          disabled={!answered}
          onClick={handleNext}
          style={{
            width: '100%',
            minHeight: '56px',
            background: answered ? 'var(--talas-blue)' : '#BFDBFE',
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

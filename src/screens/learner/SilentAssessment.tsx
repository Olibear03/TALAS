import { useState, useEffect } from 'react'
import { mockQuiz, mockPassage } from '../../data/mockData'
import type { QuizQuestion } from '../../data/mockData'

interface Props {
  onComplete: () => void
}

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function SilentAssessment({ onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState<boolean>(false)
  const [questionSeconds, setQuestionSeconds] = useState<number>(0)

  const questions: QuizQuestion[] = mockQuiz
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Question timer. The per-question reset to 0 is handled in handleNext (and
  // the initial state is 0), so the effect only needs to run the interval —
  // avoiding a synchronous setState in the effect body.
  useEffect(() => {
    const id = setInterval(() => {
      setQuestionSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [currentQuestionIndex])

  const handleSelect = (idx: number) => {
    if (hasAnswered) return
    setSelectedIndex(idx)
    setHasAnswered(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete()
      return
    }
    setCurrentQuestionIndex((prev) => prev + 1)
    setSelectedIndex(null)
    setHasAnswered(false)
    setQuestionSeconds(0)
  }

  const wordCount =
    mockPassage[0].split(' ').length + (mockPassage[1] ? mockPassage[1].split(' ').length : 0)

  const progressFill =
    ((currentQuestionIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100

  if (!currentQuestion) return null

  const choiceLabels = ['A', 'B', 'C', 'D']

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        minHeight: '100svh',
        background: 'var(--talas-paper)',
      }}
    >
      {/* TOP BAR */}
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
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--talas-green)',
            whiteSpace: 'nowrap',
          }}
        >
          PAGSUSURI
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
              width: `${progressFill}%`,
              height: '100%',
              background: 'var(--talas-green)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '20px' }}>🐸</span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12px',
              color: '#9CA3AF',
            }}
          >
            Tanong {currentQuestionIndex + 1} ng {questions.length}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT — two-column with flex wrap */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          padding: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT PANEL — passage */}
        <div style={{ flex: '1 1 340px', minWidth: '280px' }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--talas-green)',
              marginBottom: '8px',
            }}
          >
            TALAS – Tahimik na Pagbasa
          </div>

          {/* Illustration placeholder */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              background: 'var(--talas-mint)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '48px' }}>📖</span>
          </div>

          {/* Story title */}
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
              marginTop: '12px',
            }}
          >
            Ang Batang Magsasaka
          </div>

          {/* Passage paragraphs */}
          <p
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--talas-charcoal)',
              marginTop: '8px',
            }}
          >
            {mockPassage[0]}
          </p>
          {mockPassage[1] && (
            <p
              style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '16px',
                lineHeight: 1.8,
                color: 'var(--talas-charcoal)',
                marginTop: '8px',
              }}
            >
              {mockPassage[1]}
            </p>
          )}

          {/* Listen button */}
          <button
            type="button"
            onClick={() => {}}
            style={{
              border: '2px solid var(--talas-blue)',
              background: 'transparent',
              color: 'var(--talas-blue)',
              borderRadius: '12px',
              minHeight: '48px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '14px',
              padding: '0 16px',
              cursor: 'pointer',
              marginTop: '12px',
            }}
          >
            Pakinggan ang Kuwento
          </button>

          {/* Word count badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'var(--talas-sky)',
              color: 'var(--talas-blue)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              marginTop: '8px',
            }}
          >
            {wordCount} salita
          </div>
        </div>

        {/* RIGHT PANEL — question */}
        <div style={{ flex: '1 1 320px', minWidth: '280px' }}>
          {/* Question type badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'var(--talas-buttercream)',
              color: '#92400E',
              borderRadius: '20px',
              padding: '4px 12px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            LITERAL NA TANONG
          </div>

          {/* Question text */}
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
              marginBottom: '20px',
            }}
          >
            {currentQuestion.question}
          </div>

          {/* Choices */}
          {currentQuestion.choices.map((choice, i) => {
            let bg = 'white'
            let borderColor = '#E0E0E0'
            let labelColor = 'var(--talas-charcoal)'
            let icon: string | null = null

            if (hasAnswered) {
              if (i === currentQuestion.correctIndex) {
                bg = '#D1FAE5'
                borderColor = 'var(--talas-green)'
                labelColor = 'var(--talas-green)'
                icon = '✓'
              } else if (i === selectedIndex) {
                bg = '#FEE2E2'
                borderColor = 'var(--talas-coral)'
                labelColor = 'var(--talas-coral)'
                icon = '✗'
              }
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
                  fontFamily: "'Quicksand', system-ui, sans-serif",
                  fontSize: '15px',
                  cursor: hasAnswered ? 'default' : 'pointer',
                  textAlign: 'left',
                  marginBottom: '8px',
                  transition: 'background 0.2s, border-color 0.2s',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    color: labelColor,
                    minWidth: '20px',
                  }}
                >
                  {icon ?? choiceLabels[i]}
                </span>
                <span style={{ color: 'var(--talas-charcoal)' }}>{choice}</span>
              </button>
            )
          })}

          {/* Explanation */}
          {hasAnswered && (
            <div
              style={{
                marginTop: '12px',
                background: 'var(--talas-sky)',
                borderRadius: '12px',
                padding: '12px',
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '14px',
                color: '#1E40AF',
              }}
            >
              💡 {currentQuestion.explanation}
            </div>
          )}

          {/* Progress text */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12px',
              color: '#9CA3AF',
              marginTop: '16px',
            }}
          >
            Tanong {currentQuestionIndex + 1} ng {questions.length}
          </div>

          {/* Timer */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12px',
              color: '#9CA3AF',
              textAlign: 'right',
            }}
          >
            Oras sa Pahina: {formatTime(questionSeconds)}
          </div>

          {/* Next / Submit button */}
          <button
            type="button"
            disabled={!hasAnswered}
            onClick={handleNext}
            style={{
              marginTop: '16px',
              width: '100%',
              minHeight: '56px',
              background: hasAnswered ? 'var(--talas-green)' : '#D1FAE5',
              color: hasAnswered ? 'white' : '#9CA3AF',
              border: 'none',
              borderRadius: '16px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              cursor: hasAnswered ? 'pointer' : 'not-allowed',
            }}
          >
            {isLastQuestion ? 'Isumite ang Pagsusuri →' : 'Susunod →'}
          </button>
        </div>
      </div>
    </div>
  )
}

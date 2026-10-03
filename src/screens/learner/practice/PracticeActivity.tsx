import ComprehensionActivity from './ComprehensionActivity'
import VocabularyActivity from './VocabularyActivity'
import ReadAloudActivity from './ReadAloudActivity'
import WordPracticeActivity from './WordPracticeActivity'

interface Props {
  activityId: string
  onComplete: (scorePercent: number) => void
  onBack: () => void
}

/**
 * Routes to the correct activity component based on activityId.
 * Adding a new activity = add an entry to practiceData.ts + a case here.
 */
export default function PracticeActivity({ activityId, onComplete, onBack }: Props) {
  switch (activityId) {
    case 'practice-001':
      return <ComprehensionActivity onComplete={onComplete} onBack={onBack} />
    case 'practice-002':
      return <VocabularyActivity onComplete={onComplete} onBack={onBack} />
    case 'practice-003':
      return <ReadAloudActivity onComplete={onComplete} onBack={onBack} />
    case 'practice-004':
      return <WordPracticeActivity onComplete={onComplete} onBack={onBack} />
    // Level 2–3 activities share MVP content with level 1 counterparts
    case 'practice-005':
      return <ComprehensionActivity onComplete={onComplete} onBack={onBack} />
    case 'practice-006':
      return <VocabularyActivity onComplete={onComplete} onBack={onBack} />
    case 'practice-007':
      return <ComprehensionActivity onComplete={onComplete} onBack={onBack} />
    default:
      // Unknown activity — show a friendly fallback
      return (
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            minHeight: '100svh',
            background: 'var(--talas-paper)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px' }}>🤔</div>
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
            }}
          >
            Hindi mahanap ang aktibidad.
          </div>
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            ID: {activityId}
          </div>
          <button
            type="button"
            onClick={() => onComplete(0)}
            style={{
              minHeight: '56px',
              padding: '0 32px',
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
            Bumalik
          </button>
        </div>
      )
  }
}

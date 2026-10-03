import FrogMascot from '../../components/FrogMascot'
import { mockAssignment } from '../../data/mockData'

interface Props {
  learnerName: string
  onStartAssessment: () => void
  onGoToProfile: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function LearnerDashboard({ learnerName, onStartAssessment, onGoToProfile }: Props) {
  const displayName = learnerName.split(' ')[0] || learnerName
  const initials = getInitials(learnerName || 'M')

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '16px',
        minHeight: '100svh',
        background: 'var(--talas-paper)',
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* TALAS wordmark */}
        <span
          style={{
            fontFamily: "'Comfortaa', system-ui, sans-serif",
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--talas-green)',
          }}
        >
          TALAS
        </span>

        {/* Grade/section badge */}
        <span
          style={{
            background: 'var(--talas-mint)',
            color: 'var(--talas-green)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Baitang 2 · Sampaguita
        </span>

        {/* Learner name + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '13px',
              color: 'var(--talas-charcoal)',
            }}
          >
            {displayName}
          </span>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--talas-green)',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* GREETING CARD */}
      <div
        style={{
          marginTop: '16px',
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #E8F8EC',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <FrogMascot size={80} />
        <div>
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
            }}
          >
            Magandang araw, {learnerName}! 🌿
          </div>
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: '#6B7280',
              marginTop: '4px',
            }}
          >
            Handa ka na bang maglakbay sa mundo ng mga kuwento?
          </div>
        </div>
      </div>

      {/* ASSIGNED WORK SECTION */}
      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#6B7280',
          }}
        >
          Nakatalagang Gawain
        </div>

        {/* Assessment card */}
        <div
          style={{
            marginTop: '8px',
            background: 'var(--talas-buttercream)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #FFE08A',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Row 1: title + status badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Comfortaa', system-ui, sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--talas-charcoal)',
              }}
            >
              Pasalitang Pagbasa
            </span>
            <span
              style={{
                background: 'var(--talas-mint)',
                color: 'var(--talas-green)',
                borderRadius: '999px',
                padding: '4px 10px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Handa Na
            </span>
          </div>

          {/* Row 2: assignment title */}
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            {mockAssignment.title}
          </div>

          {/* Row 3: Start button */}
          <button
            type="button"
            onClick={onStartAssessment}
            style={{
              width: '100%',
              minHeight: '56px',
              background: 'var(--talas-green)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Simulan Na! 🚀
          </button>

          {/* Row 4: note */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: '4px',
            }}
          >
            Pindutin para buksan ang mikropono
          </div>
        </div>
      </div>

      {/* KEEP PRACTICING SECTION */}
      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#6B7280',
          }}
        >
          Patuloy na Magsanay
        </div>

        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          {/* Card 1: Short Story */}
          <div
            style={{
              background: 'var(--talas-mint)',
              borderRadius: '16px',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '28px' }}>📖</div>
            <div
              style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--talas-charcoal)',
                marginTop: '8px',
              }}
            >
              Maikling Kuwento
            </div>
            <div
              style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
              }}
            >
              Basahin ang isang maikling kuwento
            </div>
            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: 600,
                }}
              >
                Malapit na!
              </span>
            </div>
          </div>

          {/* Card 2: Vocabulary */}
          <div
            style={{
              background: 'var(--talas-mint)',
              borderRadius: '16px',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '28px' }}>🔤</div>
            <div
              style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--talas-charcoal)',
                marginTop: '8px',
              }}
            >
              Bokabularyo
            </div>
            <div
              style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
              }}
            >
              Palawakin ang iyong talasalitaan
            </div>
            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: 600,
                }}
              >
                Malapit na!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MY READING PROFILE CARD */}
      <div
        onClick={onGoToProfile}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onGoToProfile()}
        style={{
          marginTop: '24px',
          marginBottom: '32px',
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid #E8F8EC',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <FrogMascot size={48} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Comfortaa', system-ui, sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--talas-charcoal)',
            }}
          >
            Aking Profile sa Pagbabasa
          </div>
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '12px',
              color: '#6B7280',
              marginTop: '2px',
            }}
          >
            Tingnan ang iyong mga nagawa
          </div>
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '20px',
            color: 'var(--talas-green)',
          }}
        >
          →
        </span>
      </div>
    </div>
  )
}

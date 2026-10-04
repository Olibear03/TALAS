import FrogMascot from '../../components/FrogMascot'
import { mockAssignment } from '../../data/mockData'

interface Props {
  learnerName: string
  onStartAssessment: () => void
  onStartPractice: () => void
  onGoToProfile: () => void
  /** Automatically selected reading title after the baseline assessment. */
  readingTitle?: string
  /** Automatically selected Content Bank level (1–5). */
  automaticLevel?: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const FONT_DISPLAY = "'Comfortaa', system-ui, sans-serif"
const FONT_UI = "'Plus Jakarta Sans', system-ui, sans-serif"
const FONT_READ = "'Quicksand', system-ui, sans-serif"

/** Small stat chip for the hero row. */
function StatCard({
  icon,
  value,
  label,
  bg,
  color,
}: {
  icon: string
  value: string
  label: string
  bg: string
  color: string
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: bg,
        borderRadius: '18px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '26px', lineHeight: 1 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: '20px',
            fontWeight: 700,
            color,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: '12px',
            color: '#6B7280',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

export default function LearnerDashboard({
  learnerName,
  onStartAssessment,
  onStartPractice,
  onGoToProfile,
  readingTitle,
  automaticLevel,
}: Props) {
  const displayName = learnerName.split(' ')[0] || learnerName || 'Mag-aaral'
  const initials = getInitials(learnerName || 'M')

  return (
    <div
      style={{
        minHeight: '100svh',
        background:
          'radial-gradient(1100px 500px at 85% -5%, var(--talas-mint) 0%, transparent 55%), radial-gradient(800px 400px at 0% 0%, var(--talas-buttercream) 0%, transparent 50%), var(--talas-paper)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          margin: '0 auto',
          padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px) 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 2.5vw, 28px)',
        }}
      >
        {/* ───────── TOP BAR ───────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--talas-green)',
              letterSpacing: '0.5px',
            }}
          >
            TALAS
          </span>
          <span
            style={{
              background: 'white',
              color: 'var(--talas-green)',
              border: '1px solid #D5F0DB',
              borderRadius: '999px',
              padding: '6px 14px',
              fontFamily: FONT_UI,
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Baitang 2 · Sampaguita
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: FONT_UI, fontSize: '13px', color: 'var(--talas-charcoal)' }}>
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
                fontFamily: FONT_UI,
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* ───────── HERO: greeting + stats ───────── */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 3vw, 32px)',
            border: '1px solid #E8F8EC',
            boxShadow: '0 10px 30px -18px rgba(36,41,35,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <FrogMascot size={92} />
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 700,
                  color: 'var(--talas-charcoal)',
                  lineHeight: 1.15,
                }}
              >
                Magandang araw, {displayName}! 🌿
              </div>
              <div
                style={{
                  fontFamily: FONT_READ,
                  fontSize: '15px',
                  color: '#6B7280',
                  marginTop: '6px',
                }}
              >
                Handa ka na bang maglakbay sa mundo ng mga kuwento?
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <StatCard
              icon="📖"
              value="Antas 2"
              label="Antas ng pagbasa"
              bg="var(--talas-mint)"
              color="var(--talas-green)"
            />
            <StatCard
              icon="🔥"
              value="5 araw"
              label="Sunod-sunod na pagbasa"
              bg="var(--talas-buttercream)"
              color="#A9741A"
            />
            <StatCard
              icon="⭐"
              value="3 badge"
              label="Mga nakamit"
              bg="var(--talas-sky)"
              color="var(--talas-blue)"
            />
          </div>
        </div>

        {/* ───────── WORK CARDS (two columns) ───────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {/* Assigned work */}
          <section
            style={{
              background: 'var(--talas-buttercream)',
              borderRadius: '22px',
              border: '1px solid #FFE08A',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: FONT_UI,
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#A9741A',
                }}
              >
                📌 Nakatalagang Gawain
              </span>
              <span
                style={{
                  background: 'var(--talas-mint)',
                  color: 'var(--talas-green)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontFamily: FONT_UI,
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Handa Na
              </span>
            </div>

            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--talas-charcoal)',
                }}
              >
                Pasalitang Pagbasa
              </div>
              <div style={{ fontFamily: FONT_READ, fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                {readingTitle ?? mockAssignment.title}
              </div>
              {readingTitle && automaticLevel && (
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    background: 'var(--talas-sky)',
                    color: 'var(--talas-blue)',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontFamily: FONT_UI,
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  Awtomatikong Antas {automaticLevel}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onStartAssessment}
              style={{
                marginTop: 'auto',
                width: '100%',
                minHeight: '58px',
                background: 'var(--talas-green)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontFamily: FONT_UI,
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 18px -10px rgba(75,174,79,0.8)',
              }}
            >
              Simulan Na! 🚀
            </button>
            <div
              style={{
                fontFamily: FONT_UI,
                fontSize: '11px',
                color: '#9CA3AF',
                textAlign: 'center',
              }}
            >
              Pindutin para buksan ang mikropono
            </div>
          </section>

          {/* Keep practicing */}
          <section
            style={{
              background: 'var(--talas-mint)',
              borderRadius: '22px',
              border: '1px solid #CBEAD2',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <span
              style={{
                fontFamily: FONT_UI,
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--talas-green)',
              }}
            >
              🌱 Patuloy na Magsanay
            </span>

            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--talas-charcoal)',
                }}
              >
                Mga Laro sa Pagbasa
              </div>
              <div style={{ fontFamily: FONT_READ, fontSize: '14px', color: '#4B5563', marginTop: '4px' }}>
                May bagong pagsasanay na akma sa iyong antas!
              </div>
            </div>

            <button
              type="button"
              onClick={onStartPractice}
              style={{
                marginTop: 'auto',
                width: '100%',
                minHeight: '58px',
                background: 'white',
                color: 'var(--talas-green)',
                border: '2px solid var(--talas-green)',
                borderRadius: '16px',
                fontFamily: FONT_UI,
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Magsanay Tayo! 💪
            </button>
            <div style={{ fontFamily: FONT_UI, fontSize: '11px', color: '#6B9E73', textAlign: 'center' }}>
              Awtomatikong nag-aangkop sa iyong galing
            </div>
          </section>
        </div>

        {/* ───────── PROFILE CARD ───────── */}
        <button
          type="button"
          onClick={onGoToProfile}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '18px 22px',
            border: '1px solid #E8F8EC',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <FrogMascot size={52} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--talas-charcoal)',
              }}
            >
              Aking Profile sa Pagbabasa
            </div>
            <div style={{ fontFamily: FONT_READ, fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
              Tingnan ang iyong mga nagawa at progreso
            </div>
          </div>
          <span style={{ fontFamily: FONT_UI, fontSize: '22px', color: 'var(--talas-green)' }}>→</span>
        </button>
      </div>
    </div>
  )
}

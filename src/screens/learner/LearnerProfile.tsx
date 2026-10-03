import FrogMascot from '../../components/FrogMascot'
import type { PracticeProfile } from '../../data/practiceData'
import { activityRegistry } from '../../data/practiceData'

interface Props {
  learnerName: string
  practiceProfile: PracticeProfile
  onBack: () => void
  onExit: () => void
}

const FONT_DISPLAY = "'Comfortaa', system-ui, sans-serif"
const FONT_UI = "'Plus Jakarta Sans', system-ui, sans-serif"
const FONT_READ = "'Quicksand', system-ui, sans-serif"

interface Badge {
  icon: string
  label: string
  earned: boolean
}

export default function LearnerProfile({
  learnerName,
  practiceProfile,
  onBack,
  onExit,
}: Props) {
  const displayName = learnerName.split(' ')[0] || learnerName || 'Mag-aaral'

  const completedCount = practiceProfile.completedActivityIds.length
  const scores = practiceProfile.recentScores
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

  // Child-friendly badges derived from real practice data (no new scoring).
  const badges: Badge[] = [
    { icon: '🌱', label: 'Unang Hakbang', earned: completedCount >= 1 },
    { icon: '📚', label: 'Masipag Magbasa', earned: completedCount >= 3 },
    { icon: '🔥', label: 'Sunod-sunod', earned: practiceProfile.consecutiveHighScores >= 2 },
    { icon: '⭐', label: 'Bituin ng Pagbasa', earned: avgScore >= 80 },
  ]
  const earnedCount = badges.filter((b) => b.earned).length

  // Titles of the activities the learner has finished, from the registry.
  const completedTitles = practiceProfile.completedActivityIds
    .map((id) => activityRegistry.find((a) => a.id === id)?.title)
    .filter((t): t is string => Boolean(t))

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              color: 'var(--talas-charcoal)',
              border: '1px solid #E8F8EC',
              borderRadius: '999px',
              padding: '8px 16px',
              fontFamily: FONT_UI,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Bumalik
          </button>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--talas-green)',
              letterSpacing: '0.5px',
            }}
          >
            TALAS
          </span>
          <button
            type="button"
            onClick={onExit}
            style={{
              background: 'white',
              color: '#9CA3AF',
              border: '1px solid #E8F8EC',
              borderRadius: '999px',
              padding: '8px 16px',
              fontFamily: FONT_UI,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Mag-logout
          </button>
        </div>

        {/* ───────── HERO: who am I ───────── */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 3vw, 32px)',
            border: '1px solid #E8F8EC',
            boxShadow: '0 10px 30px -18px rgba(36,41,35,0.25)',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <FrogMascot size={104} />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontFamily: FONT_UI, fontSize: '13px', color: '#6B7280' }}>
              Aking Profile sa Pagbabasa
            </div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 'clamp(26px, 3.2vw, 34px)',
                fontWeight: 700,
                color: 'var(--talas-charcoal)',
                lineHeight: 1.15,
                marginTop: '2px',
              }}
            >
              {displayName} 🌟
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                background: 'var(--talas-mint)',
                color: 'var(--talas-green)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontFamily: FONT_UI,
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              📖 Antas {practiceProfile.currentLevel} ng pagbasa
            </div>
          </div>
        </div>

        {/* ───────── STAT CARDS ───────── */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <StatBox icon="✅" value={`${completedCount}`} label="Natapos na gawain" bg="var(--talas-mint)" color="var(--talas-green)" />
          <StatBox icon="⭐" value={`${earnedCount} / ${badges.length}`} label="Mga tsapa" bg="var(--talas-sky)" color="var(--talas-blue)" />
          <StatBox icon="🎯" value={scores.length > 0 ? `${avgScore}%` : '—'} label="Karaniwang tama" bg="var(--talas-buttercream)" color="#A9741A" />
        </div>

        {/* ───────── BADGES ───────── */}
        <section
          style={{
            background: 'white',
            borderRadius: '22px',
            border: '1px solid #E8F8EC',
            padding: 'clamp(18px, 2.5vw, 26px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700, color: 'var(--talas-charcoal)' }}>
            🏅 Aking mga Tsapa
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {badges.map((b) => (
              <div
                key={b.label}
                style={{
                  background: b.earned ? 'var(--talas-buttercream)' : '#F3F4F6',
                  border: b.earned ? '1px solid #FFE08A' : '1px solid #E5E7EB',
                  borderRadius: '18px',
                  padding: '18px 14px',
                  textAlign: 'center',
                  opacity: b.earned ? 1 : 0.55,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '34px', lineHeight: 1, filter: b.earned ? 'none' : 'grayscale(1)' }}>
                  {b.icon}
                </span>
                <span style={{ fontFamily: FONT_UI, fontSize: '13px', fontWeight: 700, color: 'var(--talas-charcoal)' }}>
                  {b.label}
                </span>
                <span style={{ fontFamily: FONT_UI, fontSize: '11px', color: b.earned ? 'var(--talas-green)' : '#9CA3AF' }}>
                  {b.earned ? 'Nakamit!' : 'Hindi pa'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── RECENT ACTIVITIES ───────── */}
        <section
          style={{
            background: 'white',
            borderRadius: '22px',
            border: '1px solid #E8F8EC',
            padding: 'clamp(18px, 2.5vw, 26px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700, color: 'var(--talas-charcoal)' }}>
            🌿 Mga Nagawa Ko
          </div>
          {completedTitles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completedTitles.map((title, i) => (
                <div
                  key={`${title}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'var(--talas-mint)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>📘</span>
                  <span style={{ fontFamily: FONT_READ, fontSize: '15px', fontWeight: 600, color: 'var(--talas-charcoal)' }}>
                    {title}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '18px' }}>✅</span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '28px 16px',
                background: 'var(--talas-paper)',
                borderRadius: '16px',
              }}
            >
              <FrogMascot size={64} />
              <div style={{ fontFamily: FONT_READ, fontSize: '15px', color: '#6B7280', marginTop: '10px' }}>
                Wala ka pang natatapos na gawain. Magsimula na tayo! 🌱
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatBox({
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
        minWidth: '150px',
        background: bg,
        borderRadius: '18px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <span style={{ fontSize: '30px', lineHeight: 1 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: '22px', fontWeight: 700, color, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontFamily: FONT_UI, fontSize: '12px', color: '#6B7280' }}>{label}</div>
      </div>
    </div>
  )
}
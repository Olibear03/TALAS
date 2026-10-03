import FrogMascot from '../../components/FrogMascot'
import { mockAssignment } from '../../data/mockData'

interface Props {
  learnerName: string
  onDone: () => void
}

export default function FormalAssessmentCompletion({ learnerName, onDone }: Props) {
  return (
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--talas-paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(12px, 4vw, 32px)',
        width: 'min(520px, 100%)',
        margin: '0 auto',
      }}
    >
      {/* Status badge */}
      <div
        style={{
          background: 'var(--talas-mint)',
          color: 'var(--talas-green)',
          borderRadius: '20px',
          padding: '6px 14px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          alignSelf: 'center',
          marginBottom: '16px',
        }}
      >
        Ligtas Na Naipadala kay Teacher Maria ✉️
      </div>

      <FrogMascot size={180} />

      <h1
        style={{
          margin: '16px 0 0 0',
          fontFamily: "'Comfortaa', system-ui, sans-serif",
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--talas-green)',
          textAlign: 'center',
        }}
      >
        Napakagaling mo, {learnerName}! ✨
      </h1>

      <p
        style={{
          margin: '8px 0 0 0',
          fontFamily: "'Quicksand', system-ui, sans-serif",
          fontSize: '15px',
          color: '#6B7280',
          textAlign: 'center',
          maxWidth: '320px',
        }}
      >
        Naipadala na ang iyong binasa kay Teacher Maria. Hintayin ang kanyang komento at maayang ngiti!
      </p>

      {/* Audio button */}
      <button
        type="button"
        onClick={() => {}}
        style={{
          border: '2px solid var(--talas-blue)',
          background: 'transparent',
          color: 'var(--talas-blue)',
          borderRadius: '14px',
          minHeight: '48px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '14px',
          padding: '0 20px',
          cursor: 'pointer',
          marginTop: '20px',
          width: '100%',
        }}
      >
        Pakinggan ang Bati ni Kokoy 🔊
      </button>

      {/* Recently completed card */}
      <div
        style={{
          marginTop: '20px',
          background: 'var(--talas-buttercream)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #FFE08A',
          alignSelf: 'stretch',
        }}
      >
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#92400E',
            marginBottom: '6px',
          }}
        >
          KAKATAPOS LAMANG
        </div>
        <div
          style={{
            fontFamily: "'Comfortaa', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--talas-charcoal)',
          }}
        >
          {mockAssignment.title}
        </div>
        <div
          style={{
            fontFamily: "'Quicksand', system-ui, sans-serif",
            fontSize: '13px',
            color: '#6B7280',
            marginTop: '4px',
          }}
        >
          {mockAssignment.level} · {mockAssignment.estimatedMinutes} minuto
        </div>
      </div>

      {/* Bottom buttons */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignSelf: 'stretch',
        }}
      >
        <button
          type="button"
          onClick={onDone}
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
          Bumalik sa Bahay 🏠
        </button>

        <button
          type="button"
          onClick={onDone}
          style={{
            width: '100%',
            minHeight: '56px',
            background: 'transparent',
            color: 'var(--talas-green)',
            border: '2px solid var(--talas-green)',
            borderRadius: '16px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Magpatuloy sa Libreng Pagsasanay 📖
        </button>
      </div>

      <p
        style={{
          fontFamily: "'Quicksand', system-ui, sans-serif",
          fontSize: '12px',
          color: '#9CA3AF',
          textAlign: 'center',
          marginTop: '16px',
        }}
      >
        Puwede kang magbasa pa ng mga kuwento sa aklatan o magpahinga muna! 🌸
      </p>
    </div>
  )
}

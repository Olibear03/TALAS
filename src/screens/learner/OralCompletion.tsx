import FrogMascot from '../../components/FrogMascot'

interface Props {
  onContinue: () => void
}

export default function OralCompletion({ onContinue }: Props) {
  return (
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--talas-paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <FrogMascot size={160} />

      <h1
        style={{
          margin: '16px 0 0 0',
          fontFamily: "'Comfortaa', system-ui, sans-serif",
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--talas-green)',
          textAlign: 'center',
        }}
      >
        Mahusay! 🎉
      </h1>

      <p
        style={{
          margin: '8px 0 0 0',
          fontFamily: "'Quicksand', system-ui, sans-serif",
          fontSize: '18px',
          color: 'var(--talas-charcoal)',
          textAlign: 'center',
        }}
      >
        Natapos mo ang unang bahagi.
      </p>

      <p
        style={{
          margin: '4px 0 0 0',
          fontFamily: "'Quicksand', system-ui, sans-serif",
          fontSize: '15px',
          color: '#6B7280',
          textAlign: 'center',
        }}
      >
        Sunod naman ang tahimik na pagbasa.
      </p>

      <button
        type="button"
        onClick={onContinue}
        style={{
          marginTop: '32px',
          width: '100%',
          minHeight: '56px',
          background: 'var(--talas-green)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Magpatuloy →
      </button>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FrogMascot from '../../components/FrogMascot'
import { useSpeechRecognition } from '../../reading/speech'
import {
  readingProgress,
  scoreReading,
  tokenize,
  type ReadingScore,
} from '../../reading/scorer'
import {
  save,
  syncNow,
  uploadRecording,
  isRecordingStorageConfigured,
  type WordResult,
} from '../../data'

/** Result handed to the parent flow when the learner submits the reading. */
export interface OralResult {
  passage: string
  transcript: string
  accuracy: number
  correctWords: number
  totalWords: number
  words: WordResult[]
  audioUrl: string | null
  durationSec: number
  engine: string
}

interface Props {
  onBack: () => void
  onSubmit: (result: OralResult) => void
}

const PASSAGE_ID = 'passage-oral-maya'
const LEARNER_ID = 'learner-maria' // demo learner; a real session supplies this

const ORAL_PASSAGE =
  "Masaya si Maya sa bukid. Nakakita siya ng mga paru-paro sa paligid ng mga bulaklak. Tumakbo siya patungo sa kanyang nanay at sinabi, 'Nanay, maganda ang mga paru-paro!' Ngumiti ang kanyang nanay at sinabing, 'Oo, mahal. Ingatan natin sila.'"

const words = tokenize(ORAL_PASSAGE)

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
    s % 60,
  ).padStart(2, '0')}`
}

/** Even fallback time for skipped words (seconds across the recording). */
function estimateTime(i: number, total: number, dur: number): number | undefined {
  if (dur <= 0) return undefined
  return (i / total) * dur
}

export default function OralAssessment({ onBack, onSubmit }: Props) {
  const speech = useSpeechRecognition('fil-PH')
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const finishingRef = useRef(false)

  const isRecording = speech.isRecording
  const hasStopped = speech.status === 'done'

  // Live reading position from REAL recognized speech (not a timer).
  const progress = useMemo(
    () => readingProgress(ORAL_PASSAGE, speech.transcript),
    [speech.transcript],
  )
  const activeWordIndex = Math.min(progress.cursor, words.length - 1)

  // Real elapsed-time clock while recording.
  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => setElapsedSeconds((p) => p + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  const buildResult = useCallback(
    (transcript: string): OralResult => {
      const score: ReadingScore = scoreReading(ORAL_PASSAGE, transcript)
      const total = score.totalWords || 1
      const dur = speech.durationSec || elapsedSeconds || 0
      const timings = speech.getWordTimings()
      const wordsWithTime: WordResult[] = score.words.map((w) => {
        const si = w.spokenIndex ?? -1
        const exact = si >= 0 ? timings[si]?.start : undefined
        return { ...w, timeSec: exact ?? estimateTime(w.index, total, dur) }
      })
      return {
        passage: ORAL_PASSAGE,
        transcript,
        accuracy: score.accuracy,
        correctWords: score.correctWords,
        totalWords: score.totalWords,
        words: wordsWithTime,
        audioUrl: speech.audioUrl,
        durationSec: dur,
        engine: speech.engine,
      }
    },
    [speech, elapsedSeconds],
  )

  // Persist the attempt to IndexedDB (offline-safe, syncs when online).
  const persist = useCallback(
    async (result: OralResult) => {
      const attemptId = `attempt-${PASSAGE_ID}-${Date.now()}`

      // Upload the voice recording to S3 first (best-effort). If online and
      // storage is configured, we store the returned S3 key on the attempt so
      // the teacher can play it back later. If it fails (offline, no endpoint),
      // we still save everything else.
      let audioKey: string | undefined
      const blob = speech.getAudioBlob()
      if (blob && navigator.onLine && isRecordingStorageConfigured()) {
        try {
          audioKey = await uploadRecording(blob, LEARNER_ID, attemptId)
        } catch {
          /* upload failed; attempt still saves without the recording key */
        }
      }

      try {
        await save('readingAttempts', {
          id: attemptId,
          passageId: PASSAGE_ID,
          learnerId: LEARNER_ID,
          transcript: result.transcript,
          accuracy: result.accuracy,
          correctWords: result.correctWords,
          totalWords: result.totalWords,
          words: result.words,
          method: result.engine === 'none' ? 'manual' : 'speech-api',
          online: navigator.onLine,
          durationSec: result.durationSec || undefined,
          audioKey,
          createdAt: new Date().toISOString(),
        })
        // Push to the cloud database right away. Fire-and-forget: if offline,
        // the record stays dirty in IndexedDB and auto-syncs on reconnect.
        void syncNow()
      } catch {
        /* persistence is best-effort; the result still flows to the UI */
      }
    },
    [speech],
  )

  const finishReading = useCallback(async () => {
    if (finishingRef.current) return
    finishingRef.current = true
    await speech.stop()
  }, [speech])

  // Auto-stop once the reader reaches the end of the passage.
  useEffect(() => {
    if (
      isRecording &&
      progress.cursor >= words.length &&
      !finishingRef.current
    ) {
      const t = setTimeout(() => void finishReading(), 600)
      return () => clearTimeout(t)
    }
  }, [isRecording, progress.cursor, finishReading])

  const handleStart = () => {
    finishingRef.current = false
    setElapsedSeconds(0)
    void speech.start()
  }

  const handleBack = () => {
    if (window.confirm('Sigurado ka bang gusto mong bumalik?')) {
      speech.reset()
      onBack()
    }
  }

  const handleUlitin = () => {
    finishingRef.current = false
    speech.reset()
    setElapsedSeconds(0)
  }

  const handleStop = () => {
    void finishReading()
  }

  const handleSubmit = async () => {
    const transcript = speech.transcript
    const result = buildResult(transcript)
    await persist(result)
    onSubmit(result)
  }

  const showControls = isRecording || hasStopped || speech.status === 'loading'

  return (
    <div
      style={{
        width: '100%',
        background: 'var(--talas-paper)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Keyframes for the listening waveform */}
      <style>{`
        @keyframes oralWave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* MINIMAL TOP BAR */}
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
        <button
          type="button"
          onClick={handleBack}
          style={{
            minHeight: '48px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '14px',
            border: 'none',
            background: 'transparent',
            color: 'var(--talas-blue)',
            cursor: 'pointer',
            padding: '0 8px',
          }}
        >
          ← Bumalik
        </button>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--talas-charcoal)',
          }}
        >
          Pasalitang Pagbasa
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          {speech.engine === 'vosk'
            ? 'Offline'
            : speech.engine === 'speech-api'
              ? 'Online'
              : navigator.onLine
                ? 'Online'
                : 'Offline'}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div
        style={{
          flex: 1,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* TOP ROW: Mic status + Timer */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Mic panel */}
          <div
            style={{
              width: '120px',
              height: '72px',
              flexShrink: 0,
              background: isRecording ? '#FDECE8' : '#F3F4F6',
              borderRadius: '16px',
              border: isRecording
                ? '2px solid var(--talas-coral)'
                : '2px dashed #D1D5DB',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '24px' }}>{isRecording ? '🔴' : '🎙️'}</span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: isRecording ? 'var(--talas-coral)' : '#9CA3AF',
                fontWeight: isRecording ? 700 : 400,
              }}
            >
              {isRecording ? 'Nakikinig…' : 'Mikropono'}
            </span>
          </div>

          {/* CENTER: listening waveform + status (fills the gap) */}
          <div
            style={{
              flex: 1,
              alignSelf: 'stretch',
              minWidth: 0,
              height: '72px',
              background: isRecording ? '#FFF7F5' : '#F9FBF7',
              borderRadius: '16px',
              border: `1px solid ${isRecording ? '#FBD9D0' : '#E8F8EC'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 12px',
            }}
          >
            {/* Animated bars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '26px',
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '4px',
                    borderRadius: '2px',
                    background: isRecording
                      ? 'var(--talas-coral)'
                      : hasStopped
                        ? 'var(--talas-green)'
                        : '#D1D5DB',
                    height: isRecording ? '100%' : '30%',
                    transformOrigin: 'center',
                    animation: isRecording
                      ? `oralWave 0.9s ease-in-out ${i * 0.08}s infinite`
                      : 'none',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: isRecording
                  ? 'var(--talas-coral)'
                  : hasStopped
                    ? 'var(--talas-green)'
                    : '#9CA3AF',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {speech.status === 'loading'
                ? 'Inihahanda ang mikropono…'
                : isRecording
                  ? 'Nakikinig… basahin nang malakas!'
                  : hasStopped
                    ? 'Tapos na! Pindutin ang Ipasa.'
                    : 'Handa ka na? Basahin nang malakas.'}
            </span>
          </div>

          {/* Timer */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Comfortaa', system-ui, sans-serif",
                fontSize: '34px',
                fontWeight: 700,
                color: isRecording
                  ? 'var(--talas-coral)'
                  : 'var(--talas-charcoal)',
              }}
            >
              {formatTime(elapsedSeconds)}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
                textAlign: 'right',
              }}
            >
              Oras
            </div>
          </div>
        </div>

        {/* PASSAGE CARD */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '20px',
            padding: 'clamp(18px, 4vw, 40px)',
            border: '1px solid #E8F8EC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--talas-green)',
              marginBottom: '8px',
            }}
          >
            BASAHIN NANG MALAKAS
          </div>
          {/* Words — highlighted from REAL recognized speech */}
          <div
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: 'clamp(20px, 3vw, 32px)',
              lineHeight: 1.8,
            }}
          >
            {words.map((word, index) => {
              const isRead = progress.read[index] === true
              const isCurrent = isRecording && index === activeWordIndex && !isRead
              let spanStyle: React.CSSProperties
              if (isRead) {
                spanStyle = { color: 'var(--talas-green)', opacity: 0.65 }
              } else if (isCurrent) {
                spanStyle = {
                  background: 'var(--talas-yellow)',
                  color: 'var(--talas-charcoal)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: 700,
                }
              } else {
                spanStyle = { color: 'var(--talas-charcoal)' }
              }
              return (
                <span key={index} style={spanStyle}>
                  {word}
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              )
            })}
          </div>
          {/* Progress bar — driven by recognized words */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              Simula
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
                  width: `${Math.min(
                    100,
                    (progress.cursor / words.length) * 100,
                  )}%`,
                  height: '100%',
                  background: 'var(--talas-green)',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              {Math.min(progress.cursor, words.length)} / {words.length} salita
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '11px',
                color: '#9CA3AF',
              }}
            >
              Katapusan
            </span>
          </div>
        </div>

        {/* FROG ENCOURAGEMENT STRIP */}
        <div
          style={{
            background: 'var(--talas-mint)',
            borderRadius: '14px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FrogMascot size={40} />
          <span
            style={{
              fontFamily: "'Quicksand', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--talas-green)',
            }}
          >
            {hasStopped ? 'Tapos ka na! Pindutin ang Ipasa. ✨' : "Kaya mo 'yan! ✨"}
          </span>
        </div>

        {speech.error && (
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '13px',
              color: 'var(--talas-coral)',
              fontWeight: 600,
            }}
          >
            {speech.error}
          </div>
        )}

        {/* RECORDING CONTROLS */}
        {!showControls ? (
          <button
            type="button"
            onClick={handleStart}
            style={{
              width: '100%',
              minHeight: '60px',
              background: 'var(--talas-green)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Simulan ang Pagbasa 🎙️
          </button>
        ) : speech.status === 'loading' ? (
          <button
            type="button"
            disabled
            style={{
              width: '100%',
              minHeight: '60px',
              background: '#9CA3AF',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'default',
            }}
          >
            Inihahanda…
          </button>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}
          >
            {/* Ulitin */}
            <button
              type="button"
              onClick={handleUlitin}
              style={{
                border: '2px solid var(--talas-charcoal)',
                background: 'transparent',
                color: 'var(--talas-charcoal)',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ulitin
            </button>
            {/* IHINTO */}
            <button
              type="button"
              disabled={!isRecording}
              onClick={handleStop}
              style={{
                border: '2px solid var(--talas-coral)',
                background: 'transparent',
                color: 'var(--talas-coral)',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: isRecording ? 'pointer' : 'not-allowed',
                opacity: isRecording ? 1 : 0.4,
              }}
            >
              IHINTO
            </button>
            {/* Ipasa */}
            <button
              type="button"
              disabled={!hasStopped}
              onClick={() => void handleSubmit()}
              style={{
                background: hasStopped ? 'var(--talas-green)' : '#D1FAE5',
                color: hasStopped ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '14px',
                minHeight: '52px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                cursor: hasStopped ? 'pointer' : 'not-allowed',
              }}
            >
              Ipasa →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

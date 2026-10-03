import { useNavigate } from 'react-router-dom'

/** Teacher-facing learner profile / detail page (ported from the Amina mock). */
function LearnerProfile() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">
      {/* Top app bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[24px]">eco</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                TALAS
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium tracking-wide">
                Basa &amp; Tuklas
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3 py-1.5 pl-3 pr-2 bg-surface-container-lowest rounded-full shadow-[0_2px_8px_-2px_rgba(31,41,34,0.04)]">
            <div className="flex flex-col text-right">
              <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                Teacher Maria
              </span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Grades 1–3
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8">
          {/* Ambient glow */}
          <div className="absolute -top-16 right-1/4 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-96 left-10 w-80 h-80 bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* 1. Breadcrumb + meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Learners List</span>
              </button>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface-variant">Grade 2</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Amina Santos (AS-2041)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface font-label-sm text-label-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                Diagnostic Record Validated
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                BoSY 2026–2027
              </span>
            </div>
          </div>

          {/* 2. Identity header card */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-tertiary-fixed flex items-center justify-center shadow-inner overflow-hidden">
                    <span className="font-headline-lg text-headline-lg text-on-tertiary-container tracking-wider font-bold">
                      AS
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                      Amina Santos
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">eco</span>
                      Active Learner
                    </span>
                  </div>
                  <p className="font-title-md text-title-md text-on-surface-variant">
                    Grade 2 — <span className="text-on-surface font-medium">Sampaguita</span>
                    <span className="mx-2 text-outline-variant">•</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Adviser: Teacher Maria
                    </span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold tracking-wider">
                      PIN: 2041
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                      Class Code: TALAS-G2
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                      Mother Tongue: Tagalog
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  className="flex-1 lg:flex-none h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg inline-flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[19px]">print</span>
                  <span>Print Learner Card</span>
                </button>
                <button
                  type="button"
                  className="flex-1 lg:flex-none h-11 px-5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg inline-flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[19px]">edit_note</span>
                  <span>Record Observation</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <nav
              aria-label="Learner Sections"
              className="flex items-center gap-2 overflow-x-auto pt-2"
            >
              <a
                href="#"
                className="px-4 py-2.5 font-label-lg text-label-lg text-primary font-bold bg-surface-container-low rounded-xl inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">account_box</span>
                <span>Overview</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </a>
              {[
                { icon: 'lock', label: 'Formal Assessments' },
                { icon: 'healing', label: 'Intervention History' },
                { icon: 'trending_up', label: 'Practice Progress' },
              ].map((t) => (
                <a
                  key={t.label}
                  href="#"
                  className="px-4 py-2.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl inline-flex items-center gap-2 whitespace-nowrap transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                  <span>{t.label}</span>
                </a>
              ))}
            </nav>
          </section>

          {/* 3. Locked formal snapshot */}
          <section className="bg-surface-container rounded-2xl shadow-sm overflow-hidden relative">
            <div className="p-6 lg:p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Opisyal na Tala (CRLA Aligned)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
                        Q1 BoSY
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Standardized Early Grade Reading Profile — Official DepEd Baseline
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      verified
                    </span>
                    DepEd Form 137 / CRLA Validated
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Formal Classification
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                      grading
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                        Full Refresher
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">
                        (Letter Sounds)
                      </span>
                    </div>
                    <p className="font-title-md text-title-md text-on-surface font-bold">
                      Emergent Reader
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        psychology
                      </span>
                      CRLA Diagnostic Benchmark
                    </span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Date Finalized
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      calendar_today
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      October 12, 2026
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Validated 10:45 AM • Room 104
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        badge
                      </span>
                      Assessed by: T. Reyes (Certified Evaluator)
                    </span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Verified Miscues
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                      record_voice_over
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      8 Miscues{' '}
                      <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
                        (Oral)
                      </span>
                    </span>
                    <span className="font-label-md text-label-md text-secondary font-semibold">
                      2/5 Literal Comprehension
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Phonemes flagged:
                    </span>
                    {['/m/', '/s/', '/a/'].map((p) => (
                      <span
                        key={p}
                        className="px-1.5 py-0.5 bg-error-container text-on-error-container rounded font-label-sm text-label-sm font-bold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Locked policy banner */}
              <div className="bg-surface-container-lowest/80 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary text-[19px]">
                    verified_user
                  </span>
                  <span>
                    <strong>Locked evidence.</strong> Practice sessions and daily
                    micro-games do not overwrite this baseline snapshot.
                  </span>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md font-bold whitespace-nowrap transition-colors"
                >
                  <span>View Audio Evidence &amp; Signed Sheet</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </section>

          {/* 4. Adaptive practice + assigned intervention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Adaptive practice */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 lg:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Current Practice Difficulty
                      </h2>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Automated Algorithm Level
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    Dynamic
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-secondary" />
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        Target Difficulty Tier
                      </span>
                      <p className="font-title-md text-title-md text-on-surface font-bold">
                        Level 2 — Marungko Set A (/m/, /s/, /a/)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold shadow-sm">
                    Filipino Reading
                  </span>
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Recent Practice Accuracy
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Last 3 Digital Sessions
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { pct: 85, bar: 'bg-primary-container', label: 'Mon, Oct 19', emph: false },
                      { pct: 90, bar: 'bg-primary', label: 'Wed, Oct 21', emph: true },
                      { pct: 80, bar: 'bg-primary-container', label: 'Fri, Oct 23', emph: false },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-col items-center gap-2 p-3 bg-surface-container-low/70 rounded-xl"
                      >
                        <div className="w-full flex items-end justify-center h-24 bg-surface-container-lowest rounded-lg p-1.5">
                          <div
                            className={`w-full ${s.bar} rounded-md transition-all duration-500`}
                            style={{ height: `${s.pct}%` }}
                          />
                        </div>
                        <div className="text-center">
                          <span
                            className={`font-headline-sm text-headline-sm font-bold ${s.emph ? 'text-primary' : 'text-on-surface'}`}
                          >
                            {s.pct}%
                          </span>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[15px]">trending_up</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-label-md text-primary font-bold">
                        Ready to Level Up
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Mastery threshold achieved across 3 consecutive sessions (Avg: 85%).
                        System recommends promoting to Marungko Set B (/i/, /o/, /b/).
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  className="w-full h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold inline-flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Adjust Adaptive Thresholds</span>
                </button>
              </div>
            </section>

            {/* Assigned intervention */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 lg:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">
                        assignment_turned_in
                      </span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Assigned Intervention
                      </h2>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Targeted Remediation Plan
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                    Active Tier 2
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Plan Directive
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold">
                      Week 3 of 4
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Targeted Phonemic Blending
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Multi-sensory tactile sandpaper cards &amp; sound wheel drill for rapid
                    initial phoneme identification.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Weekly Module Completion
                    </span>
                    <span className="font-label-md text-label-md text-primary font-bold">
                      3 of 5 Completed (60%)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[true, true, true, false, false].map((done, i) => (
                      <div
                        key={i}
                        className={`h-2.5 rounded-full ${done ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>Day 1 (M)</span>
                    <span>Day 2 (T)</span>
                    <span>Day 3 (W)</span>
                    <span className="font-bold text-on-surface">Day 4 (Th)</span>
                    <span>Day 5 (F)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Next Guided Pull-Out
                      </span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        Thursday, 10:00 AM (15 mins)
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">
                    One-on-One
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="w-full h-11 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[19px]">checklist</span>
                  <span>Edit Intervention Plan</span>
                </button>
              </div>
            </section>
          </div>

          {/* 5. Pedagogical note */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Pedagogical Recommendation
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Amina exhibits high auditory recall when songs and hand gestures accompany
                  the sound of /m/. Maintain kinesthetic reinforcement before shifting to
                  non-pictorial text flashcards.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">history_edu</span>
              <span>View Full Log</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              menu_book
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface">TALAS</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">
              Early Grade Reading Diagnostic Shell
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 TALAS Literacy Engine. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}

export default LearnerProfile

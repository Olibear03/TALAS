# Implementation Plan — Migrate emoji UI icons to lucide-react

## Context & decisions

- Project: React 19 + TypeScript + Vite 8 (rolldown) + Tailwind CSS v4, package manager npm, Windows. Repo root `d:\TALAS\TALAS`, all source under `src`. No worktree.
- Build/test commands (from `package.json`):
  - Typed build: `npm run build` (`tsc -b && vite build`) — the authoritative gate; a missing/renamed lucide export fails `tsc -b`.
  - Lint: `npm run lint` (`eslint .`).
  - Tests: `npm test` (`vitest run --config vitest.config.ts`). There are currently no icon-related tests; tests must still pass.
- README is the stock Vite starter — no project-specific contribution rules. No AGENTS/CONTRIBUTING/.kiro steering files exist.

### Design decisions (made here, grounded in the code)

1. **Brand mark → `Leaf`.** Both the AppLayout header brand (`🍃`, `src/features/shared/components/AppLayout.tsx:38`) and the RoleSelector brand pill (`🍃`, `src/features/auth/RoleSelector.tsx:55`) use the leaf. `Leaf` is the cleanest 1:1 match and keeps the two brand spots consistent. Rationale: direct semantic match, no layout change needed (icon drops into the existing span position with a size class).
2. **Data-field icons use the `LucideIcon` component-type pattern**, exactly as the task specifies: `import type { LucideIcon } from 'lucide-react'`, field type `icon: LucideIcon`, store the component (`icon: BookOpen`, not `<BookOpen/>`), render via a capitalized alias (`const Icon = item.icon; <Icon className="w-5 h-5" aria-hidden />`). Rationale: tree-shakable, type-safe, matches the task's required pattern.
3. **Icon version / naming risk.** lucide-react renamed several icons across versions (e.g. `AlertTriangle`→`TriangleAlert`, `BarChart3`→`ChartColumn`), usually keeping deprecated aliases. To avoid a guessing game, install a pinned recent version and treat `tsc -b` as the verifier of every export name. If any chosen name fails to resolve at build, the implementer swaps to the alias the installed version exports (both the new and legacy names below are listed as fallbacks). Rationale: the typed build is a hard, reliable check — no name needs to be assumed correct.
4. **Decorative vs meaningful.** Icons that sit next to a text label stay decorative — pass `aria-hidden` (lucide renders `aria-hidden` by default when no `title`; passing it explicitly is harmless and clear). Icons with **no** adjacent text get an accessible name via `aria-label` + `role="img"` or a lucide `title` prop. The only standalone-meaning cases found are the `✓` finalized badge in `LearnerLayout` and `Overview`'s "Finalized official record" (has adjacent text, so decorative). Where an icon is the sole content of a control with no text, add a label.
5. **Sizing parity.** Old emoji used `text-base`/`text-lg`/`text-xl`/`text-2xl`/`text-sm`. Map to Tailwind size classes on the lucide icon so visual weight matches: `text-sm`→`w-4 h-4`, `text-base`→`w-4 h-4`, `text-lg`→`w-5 h-5`, `text-xl`→`w-6 h-6`, `text-2xl`→`w-7 h-7`. Keep the surrounding chip/background wrappers and their color classes untouched; the icon inherits color via `currentColor` from the wrapper's `text-*` class (so do NOT add a conflicting color unless the wrapper has none).
6. **Scope confirmed by exhaustive scan.** A full emoji scan over `git ls-files src` (ran during exploration) found emoji ONLY in the files listed below. `src/features/learner/**`, `src/features/teacher/learners|reports|recommendation|activity|assessment/**` (except the back-arrow `←` text, see note), and `src/layouts/TeacherLayout.tsx` / `src/layouts/MainLayout.tsx` (both empty files) contain **no** emoji icons. The `←`/`→` characters inside back-button label text (e.g. `← Back to Learners`) are prose/button text, not standalone icon spans; the task says to migrate the `→` arrow in dashboard components (which ARE standalone `aria-hidden` spans) but the `← Back to X` arrows are inline in button copy. **Decision: convert the standalone arrow spans to `ArrowRight`; leave the inline `← Back to X` text arrows as-is** (converting them would require restructuring the button label and the task says not to change copy beyond swapping the icon element — these are decorative glyphs embedded in text, lowest risk to leave). Flag: if the reviewer wants those migrated too, that is a small follow-up. The `public/icons.svg` sprite is untouched per instructions.

### Icon choice map (lucide-react name → fallback alias if build fails)

| Meaning | Chosen | Fallback alias |
|---|---|---|
| brand leaf | `Leaf` | — |
| book / reading / Phil-IRI | `BookOpen` | — |
| warning | `TriangleAlert` | `AlertTriangle` |
| review / listening / headphones | `Headphones` | — |
| chart / completion | `BarChart3` | `ChartColumn` |
| progress up / improving | `TrendingUp` | — |
| sparkle / practice | `Sparkles` | — |
| clock / history | `Clock` | — |
| locked / finalized | `Lock` | — |
| shielded / locked evidence | `ShieldCheck` | `Shield` |
| intervention | `Bandage` | `HeartPulse` |
| idea / recommendation | `Lightbulb` | — |
| settings / actions | `Settings` | — |
| checkmark badge | `Check` | `CircleCheck` |
| arrow | `ArrowRight` | — |
| nav Dashboard | `LayoutDashboard` | — |
| nav Learners | `Users` | — |
| nav Assessments | `ClipboardList` | `ClipboardCheck` |
| nav Activities | `BookOpen` | `Puzzle` |
| nav Reports | `FileBarChart` | `BarChart3` |
| trend Steady | `Minus` | — |
| trend Needs attention | `TrendingDown` | `TriangleAlert` |
| formal Oral | `Mic` | `Volume2` |
| formal Silent | `BookOpenCheck` | `Glasses` |
| compass / overview tab | `Compass` | — |
| print | `Printer` | — |
| edit / review assessment | `SquarePen` | `FilePen` |
| letter sounds (alphabet) | `Baseline` | `Type` |
| add / new | `Plus` | — |
| view list | `ClipboardList` | `List` |
| wave greeting (👋 prose) | **leave as-is** | — (see item 0) |

---

## Plan items

- [ ] 0. Install the dependency, pinned.
      Run `npm install lucide-react@latest` in `d:\TALAS\TALAS`, then pin the resolved version in `package.json` (replace any `^`/`~` range with the exact version npm installed). Note the `👋` in `DashboardHeader.tsx:24` is prose/body copy inside the greeting sentence, NOT a UI icon — leave it untouched per the "do not touch emoji inside user-facing prose" constraint.
      Files: `package.json`, `package-lock.json`
      Verify: `npm ls lucide-react` prints a single resolved version with no `UNMET`/`invalid`; `npm run build` still succeeds (no code changes yet).

- [ ] 1. Migrate `src/features/shared/components/AppLayout.tsx` (brand + nav data-field, both nav renders).
      Change `NavItem.icon` type from `string` to `LucideIcon`. Set each nav item's icon: Dashboard→`LayoutDashboard`, Learners→`Users`, Assessments→`ClipboardList`, Activities→`BookOpen`, Reports→`FileBarChart`. Replace the brand `<span className="text-xl" aria-hidden="true">🍃</span>` with `<Leaf className="w-6 h-6 text-sprout-500" aria-hidden />`. In BOTH the desktop (`hidden lg:flex`) and mobile/tablet (`lg:hidden`) nav loops, replace `<span className="text-base" aria-hidden="true">{item.icon}</span>` with `const Icon = item.icon` at the top of the map callback and render `<Icon className="w-4 h-4" aria-hidden />`.
      Imports: `import { Leaf, LayoutDashboard, Users, ClipboardList, BookOpen, FileBarChart } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/shared/components/AppLayout.tsx`
      Verify: `npm run build` passes (type-checks the `LucideIcon` field and all imports).

- [ ] 2. Migrate `src/features/auth/RoleSelector.tsx` (brand pill + role-card data-field).
      Change `RoleCard.icon` type from `string` to `LucideIcon`. Teacher card icon→`GraduationCap`, Learner card icon→`BookOpen` (both are role-identity marks with an adjacent title, so decorative). Replace the brand pill `<span aria-hidden="true">🍃</span>` with `<Leaf className="w-4 h-4" aria-hidden />`. In the card map, add `const Icon = card.icon` and replace the emoji chip body `{card.icon}` with `<Icon className="w-7 h-7" aria-hidden />` (keep the chip wrapper classes and `${accent.chip}` which supply color/size box; drop the now-unneeded `text-2xl` from the chip span). The "Continue →" `&rarr;` is an HTML entity inside a text span — optional: replace with `<ArrowRight className="w-4 h-4" aria-hidden />`; keep the `group-hover:translate-x-0.5` on it.
      Imports: `import { Leaf, GraduationCap, BookOpen, ArrowRight } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/auth/RoleSelector.tsx`
      Verify: `npm run build` passes.

- [ ] 3. Migrate `src/features/teacher/dashboard/TeacherDashboard.tsx` (Phil-IRI note book).
      Replace `<span aria-hidden="true">📖</span>` (line ~47) with `<BookOpen className="w-4 h-4" aria-hidden />`. Keep the surrounding `text-sky-500` flex container so color is inherited.
      Imports: `import { BookOpen } from 'lucide-react'`.
      Files: `src/features/teacher/dashboard/TeacherDashboard.tsx`
      Verify: `npm run build` passes.

- [ ] 4. Migrate `src/features/teacher/dashboard/QuickStats.tsx` (3 inline emoji; leave ProgressRing svg).
      Replace: completion `<span className="text-sprout-500" aria-hidden="true">📊</span>`→`<BarChart3 className="w-4 h-4 text-sprout-500" aria-hidden />`; the Need-Support box `⚠️` (inside the `w-12 h-12 ... bg-coral-50 ... text-xl` wrapper)→`<TriangleAlert className="w-6 h-6 text-coral-500" aria-hidden />` (drop `text-xl`, add explicit `text-coral-500` since the wrapper has none); the intervention `<span className="text-coral-500" aria-hidden="true">🎧</span>`→`<Headphones className="w-4 h-4 text-coral-500" aria-hidden />`; the Needs-Review box `🎧` (inside `w-12 h-12 ... bg-coral-50 ... text-xl`)→`<Headphones className="w-6 h-6 text-coral-500" aria-hidden />` (drop `text-xl`). Do NOT touch the `<svg>` ProgressRing.
      Imports: `import { BarChart3, TriangleAlert, Headphones } from 'lucide-react'`.
      Files: `src/features/teacher/dashboard/QuickStats.tsx`
      Verify: `npm run build` passes.

- [ ] 5. Migrate `src/features/teacher/dashboard/RecentActivity.tsx` (data-field `icon` + arrow).
      Change `ActivityItem.icon` type from `string` to `LucideIcon`. FEED icons: `✅`→`CircleCheck`, `🎙️`→`Mic`, `📖`→`BookOpen`, `🔤`→`Baseline`. In the timeline map, add `const Icon = item.icon` and replace the `{item.icon}` node (inside the `w-8 h-8 rounded-full ... ${tone.node}` span) with `<Icon className="w-4 h-4" aria-hidden />` (keep the tone wrapper for color). Replace the footer `<span ...>→</span>` with `<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />` — keep the `group-hover:translate-x-0.5`.
      Imports: `import { CircleCheck, Mic, BookOpen, Baseline, ArrowRight } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/teacher/dashboard/RecentActivity.tsx`
      Verify: `npm run build` passes.

- [ ] 6. Migrate `src/features/teacher/dashboard/PendingActions.tsx` (data-field `icon` chips + arrow).
      Change `PendingAction.icon` type from `string` to `LucideIcon`. ACTIONS icons: `🎧`→`Headphones`, `💡`→`Lightbulb`, `📊`→`BarChart3`. In the map, add `const Icon = a.icon` and replace `{a.icon}` (inside the `w-11 h-11 rounded-xl text-lg ... ${tone.chip}` span) with `<Icon className="w-5 h-5" aria-hidden />` (drop `text-lg` from the chip span, keep `${tone.chip}` for color). Replace the trailing `<span ...>→</span>` with `<ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform" aria-hidden />` (preserve the `ml-auto`, `text-gray-300`, hover translate).
      Imports: `import { Headphones, Lightbulb, BarChart3, ArrowRight } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/teacher/dashboard/PendingActions.tsx`
      Verify: `npm run build` passes.

- [ ] 7. Migrate `src/features/teacher/profile/Activities.tsx` (TREND_META data-field + 3 inline).
      Change `TREND_META` value type `icon` from `string` to `LucideIcon`. Trend icons: Improving→`TrendingUp`, Steady→`Minus`, 'Needs attention'→`TrendingDown`. Where `trend.icon` is rendered inside the trend chip, use `const TrendIcon = trend.icon; <TrendIcon className="w-4 h-4" aria-hidden />` (keep `${trend.chip}` wrapper). Inline section headers: the empty-state `📈`→`<TrendingUp className="w-5 h-5" aria-hidden />`; `✨`→`<Sparkles className="w-5 h-5" aria-hidden />`; `📊`→`<BarChart3 className="w-5 h-5" aria-hidden />`; `🕑`→`<Clock className="w-5 h-5" aria-hidden />`. These header spans have `text-lg` and no color class — drop `text-lg`, add `text-charcoal` (matches the neutral emoji weight next to the heading).
      Imports: `import { TrendingUp, Minus, TrendingDown, Sparkles, BarChart3, Clock } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/teacher/profile/Activities.tsx`
      Verify: `npm run build` passes.

- [ ] 8. Migrate `src/features/teacher/profile/Overview.tsx` (ACTIVITY_META data-field + inline).
      Change `ACTIVITY_META` value `icon` type `string`→`LucideIcon`. Icons: 'Formal Assessment'→`Lock`, Practice→`Sparkles`, Intervention→`Bandage`. Render the per-activity meta via `const MetaIcon = meta.icon; <MetaIcon className="w-4 h-4" aria-hidden />` inside the `w-8 h-8 rounded-lg bg-white` box. Inline: section-header `🔒`→`<Lock className="w-5 h-5" aria-hidden />`; `✨`→`<Sparkles className="w-5 h-5" aria-hidden />`; `🩹`→`<Bandage className="w-5 h-5" aria-hidden />`; `🕑`→`<Clock className="w-5 h-5" aria-hidden />` (these have `text-lg`, drop it, add `text-charcoal`). The "✓ Finalized official record" badge: replace `✓` with `<Check className="w-3.5 h-3.5" aria-hidden />` (has adjacent text, decorative; keep the `text-sprout-500` pill). The "🛡️ Locked evidence…" line: replace `🛡️` with `<ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden />` (keep the `flex items-center gap-1.5` paragraph; icon inherits `text-gray-400`).
      Imports: `import { Lock, Sparkles, Bandage, Clock, Check, ShieldCheck } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/teacher/profile/Overview.tsx`
      Verify: `npm run build` passes.

- [ ] 9. Migrate `src/features/teacher/profile/FormalAssessment.tsx` (TYPE_META data-field + inline + badges).
      Change `TYPE_META` value `icon` type `string`→`LucideIcon`. Oral→`Mic`, Silent→`BookOpenCheck`. In `TypeBadge` and `TypeSlider`, render via `const TypeIcon = meta.icon; <TypeIcon className="w-4 h-4" aria-hidden />` (keep chip/pill wrappers). `FinalizedBadge` "🔒 Finalized": replace `🔒` with `<Lock className="w-3.5 h-3.5" aria-hidden />` (adjacent text). Inline headers: `🔒`→`<Lock className="w-5 h-5" aria-hidden />`, `🕑`→`<Clock className="w-5 h-5" aria-hidden />`, `⚙️`→`<Settings className="w-5 h-5" aria-hidden />` (drop `text-lg`, add `text-charcoal`). "🛡️ Locked evidence…" line → `<ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden />`. Action buttons: "➕ Start / assign…" → prepend `<Plus className="w-4 h-4" aria-hidden />` (buttons already `inline-flex items-center gap-2`); "📋 View all assessments" → prepend `<ClipboardList className="w-4 h-4" aria-hidden />`. Keep button text and classes.
      Imports: `import { Mic, BookOpenCheck, Lock, Clock, Settings, ShieldCheck, Plus, ClipboardList } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/features/teacher/profile/FormalAssessment.tsx`
      Verify: `npm run build` passes.

- [ ] 10. Migrate `src/features/teacher/profile/Recommendations.tsx` (3 inline headers).
      Replace header `💡`→`<Lightbulb className="w-5 h-5" aria-hidden />`, `🩹`→`<Bandage className="w-5 h-5" aria-hidden />`, `🕑`→`<Clock className="w-5 h-5" aria-hidden />` (drop `text-lg`, add `text-charcoal`; keep the `flex items-center gap-2` header rows).
      Imports: `import { Lightbulb, Bandage, Clock } from 'lucide-react'`.
      Files: `src/features/teacher/profile/Recommendations.tsx`
      Verify: `npm run build` passes.

- [ ] 11. Migrate `src/layouts/LearnerLayout.tsx` (TABS data-field + check badge + 2 buttons).
      Change TABS inline type `icon: string`→`icon: LucideIcon`. Tab icons: Overview→`Compass`, 'Formal Assessments'→`Lock`, 'Intervention History'→`Bandage`, 'Practice Progress'→`TrendingUp`. In the tabs map, add `const Icon = tab.icon` and replace `<span aria-hidden="true">{tab.icon}</span>` with `<Icon className="w-4 h-4" aria-hidden />`. The avatar check badge `✓` (standalone, inside the `w-6 h-6 rounded-full bg-sprout-500 text-white` badge, NO adjacent text → needs a label): replace with `<Check className="w-3.5 h-3.5" aria-label="Verified learner" role="img" />` (keep the badge wrapper; its `text-white` colors the icon). Buttons: "🖨️ Print Learner Card" → prepend `<Printer className="w-4 h-4" aria-hidden />`; "📝 Review Assessment" → prepend `<SquarePen className="w-4 h-4" aria-hidden />` (buttons already `inline-flex items-center ... gap-2`). Leave the `← Back to Learners` text arrows unchanged (prose in button copy).
      Imports: `import { Compass, Lock, Bandage, TrendingUp, Check, Printer, SquarePen } from 'lucide-react'` and `import type { LucideIcon } from 'lucide-react'`.
      Files: `src/layouts/LearnerLayout.tsx`
      Verify: `npm run build` passes.

- [ ] 12. Final full verification.
      Run the whole gate. Confirm no emoji icons remain in migrated files and no leftover emoji-font `text-xl/text-2xl/text-lg` spans that previously wrapped an emoji (ProgressRing svg and the `👋` prose are intentionally kept).
      Files: none (verification only)
      Verify: `npm run build` passes; `npm run lint` passes (no unused-import or no-undef errors); `npm test` passes. Then re-run the emoji scan from exploration (Node snippet over `git ls-files src`) and confirm the only remaining matches are `👋` in `DashboardHeader.tsx` and the `←`/`→` glyphs inside back-button label text.

## Verification commands (summary for the implementer)

```
npm install lucide-react@latest   # then pin the resolved version in package.json
npm ls lucide-react               # confirm single clean resolution
npm run build                     # tsc -b && vite build — PRIMARY gate, catches bad export names
npm run lint                      # eslint . — catches unused imports
npm test                          # vitest run — existing tests still pass
```

If any lucide import fails to type-check, swap to the fallback alias listed in the icon-choice map and re-run `npm run build`.

## Known gaps / assumptions

- The `👋` in `DashboardHeader.tsx` is treated as prose (greeting sentence), not an icon — left untouched.
- The `← Back to X` arrows live inside button label text, not standalone `aria-hidden` icon spans; left as-is to avoid changing copy structure. Only the standalone `→` arrow spans in RecentActivity/PendingActions (and optionally RoleSelector's `&rarr;`) are migrated to `ArrowRight`.
- `src/layouts/TeacherLayout.tsx` and `src/layouts/MainLayout.tsx` are empty files — nothing to migrate.
- `src/features/learner/**` and the teacher learners/reports/recommendation/activity/assessment list pages contain no emoji icons (confirmed by full scan).
- lucide icon export names are version-sensitive; the pinned install + `tsc -b` is the source of truth. Fallback aliases are provided for the three at-risk names (`TriangleAlert`, `BarChart3`, `ShieldCheck`).

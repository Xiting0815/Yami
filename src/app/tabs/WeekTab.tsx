import { RECIPE_BY_ID } from '../../data/recipes'
import { pendingRating } from '../../learning'
import { targetKcal } from '../../energy'
import { shortDate, weekdayName } from '../../store'
import { formatEuro } from '../../kitchen'
import { BreakfastCard, shortTitle } from '../../components/BreakfastCard'
import { RatingCard } from '../../components/RatingCard'
import { ReviewCard } from '../../components/ReviewCard'
import { StartCard, type StartStep } from '../../components/StartCard'
import { type Notice, WeekView } from '../../components/WeekView'
import { dayRangeText } from '../dates'
import type { AppModel } from '../useAppModel'

/** Tab „Woche“: Plan Mo–So mit Hinweis, Start-Checkliste, Rückblick, Bewertung und Frühstückskarte */
export function WeekTab({ m }: { m: AppModel }) {
  const { state, setState, cal, ui, plan, bf, energy, status, act, flash } = m
  const { today, days } = cal
  const { picks, prep, covered } = bf
  const profile = state.profile
  const { onboarding, plannedCount, openDay, dinnersDone, somethingPlanned, listDone, pendingSuggestion, urgentNames } = status

  const startSteps: StartStep[] = [
    {
      title: 'Profil anlegen',
      sub: profile ? `Tagesziel ${targetKcal(profile).toLocaleString('de-DE')} kcal` : 'Alter, Größe, Gewicht – daraus wird dein Kalorienziel',
      verb: 'Anlegen',
      done: !!profile,
      editable: true,
      onClick: () => ui.setShowProfile(true),
    },
    {
      title: `Frühstück für ${dayRangeText(covered)} wählen`,
      sub: picks.length ? picks.map((id) => shortTitle(RECIPE_BY_ID[id]?.title ?? '')).join(' + ') : `1–2 Rezepte, einmal vorbereiten (${weekdayName(prep, true)}, ${shortDate(prep)})`,
      verb: 'Wählen',
      done: picks.length > 0,
      editable: true,
      onClick: () => {
        ui.setMeal('breakfast')
        ui.setTab('wischen')
      },
    },
    {
      title: 'Abendessen wischen',
      sub: dinnersDone
        ? `${plannedCount} von 7 Tagen geplant`
        : plannedCount > 0 && openDay
          ? `${plannedCount} von 7 Tagen geplant – weiter ab ${weekdayName(openDay)}`
          : 'Für jeden Tag ein Gericht – nach Vorrat und Preis sortiert',
      verb: plannedCount > 0 ? 'Weiter' : 'Los geht’s',
      done: dinnersDone,
      editable: true,
      onClick: () => act.startSwipe(openDay ?? days.find((d) => d >= today) ?? days[0]),
    },
    {
      title: 'Einkaufsliste ansehen',
      sub: listDone
        ? `≈ ${formatEuro(plan.week.total)} · ${plan.week.buy.length} Artikel`
        : somethingPlanned
          ? 'Nach Regal sortiert, mit Packungsgrößen und Preisen'
          : 'Sobald etwas geplant ist',
      verb: 'Zur Liste',
      done: listDone,
      locked: !somethingPlanned,
      onClick: () => ui.setTab('liste'),
    },
  ]

  // höchstens ein Hinweis über dem Plan: Vorrat läuft ab > Vorschlag > Wiegetag
  const notice: Notice | undefined = status.justFinished
    ? { text: 'Alles eingerichtet – guten Appetit!', tone: 'ok', icon: 'check' }
    : urgentNames.size > 0
      ? { text: `${urgentNames.size} ${urgentNames.size === 1 ? 'Zutat läuft' : 'Zutaten laufen'} bald ab`, tone: 'warn', icon: 'alert', onClick: () => ui.setTab('vorrat') }
      : pendingSuggestion
        ? { text: `Vorschlag: Tagesziel ${pendingSuggestion.title}`, icon: 'trend', onClick: () => ui.setShowProgress(true) }
        : status.weighDue
          ? { text: 'Wiegetag – Werte eintragen', icon: 'scale', onClick: () => ui.setShowProgress(true) }
          : status.backupDue
            ? { text: 'Lange nicht gesichert – jetzt Sicherung speichern', icon: 'save', onClick: () => ui.setShowProfile(true) }
            : undefined

  return (
    <WeekView
      ratingSlot={(() => {
        const day = pendingRating(state.plan, state.ratings, today, state.ratingDismissed)
        const r = day ? RECIPE_BY_ID[state.plan[day]!.recipeId] : undefined
        if (!day || !r) return null
        return <RatingCard title={r.title} day={day} onRate={(v) => act.rate(day, v)} onDismiss={() => act.dismissRating(day)} />
      })()}
      days={days}
      plan={state.plan}
      today={today}
      total={plan.week.total}
      prices={state.prices}
      notice={notice}
      reviewSlot={
        status.showReviewCard && status.cardReview ? (
          <ReviewCard
            review={status.cardReview}
            onOpen={() => ui.setReviewMonday(status.cardMonday)}
            onDismiss={() => {
              setState((s) => ({ ...s, reviewDismissed: [...s.reviewDismissed, status.cardMonday].slice(-60) }))
              flash('Rückblick ausgeblendet – du findest ihn oben rechts unter „Wiegen & Fortschritt“')
            }}
          />
        ) : undefined
      }
      startSlot={
        onboarding ? (
          <StartCard
            steps={startSteps}
            onDismiss={() => {
              setState((s) => ({ ...s, onboarding: 'dismissed' }))
              flash('Du findest Profil und Wiegen oben rechts.')
            }}
          />
        ) : undefined
      }
      hideDays={onboarding && plannedCount === 0 && !picks.length}
      onSwipeDay={act.startSwipe}
      onOpen={(r, day) => ui.setSheet({ recipe: r, day, mode: 'view' })}
      onMore={ui.setActionsDay}
      onShop={() => ui.setTab('liste')}
      balances={energy.balances}
      portions={energy.portions}
      breakfastSlot={
        onboarding && !picks.length ? undefined : (
          <BreakfastCard
            picks={picks}
            assignment={bf.assignment}
            prep={prep}
            prepChoices={bf.prepChoices}
            covered={covered}
            onPrepDay={act.changePrepDay}
            prepProgress={{ done: bf.prepDone, total: bf.prepTotal }}
            open={!!state.bfOpen}
            onToggle={() => setState((s) => ({ ...s, bfOpen: !s.bfOpen }))}
            onPlan={() => {
              ui.setMeal('breakfast')
              ui.setTab('wischen')
            }}
            onPrep={() => ui.setShowPrep(true)}
            onOpen={(r) => ui.setSheet({ recipe: r, mode: 'view' })}
            onReset={act.resetBreakfast}
          />
        )
      }
    />
  )
}

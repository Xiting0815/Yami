import { useMemo } from 'react'
import { RECIPE_BY_ID } from '../../data/recipes'
import { pendingBakes, suggestBake } from '../../bakePlan'
import { BakeAskCard, BakeHintCard } from '../../components/BakeCards'
import { pendingRating } from '../../learning'
import { targetKcal } from '../../energy'
import { sharingActive, shortDate, weekdayName } from '../../store'
import { plannedBy } from '../../sync'
import { formatEuro } from '../../kitchen'
import { BreakfastCard, shortTitle } from '../../components/BreakfastCard'
import { RatingCard, SatietyCard } from '../../components/RatingCard'
import { pendingSatiety, prepRatingKey } from '../../breakfastPrep'
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

  const shared = sharingActive(state.ha)
  const allSteps: StartStep[] = [
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

  // Familie teilen: Profil (Kalorien) und Frühstück sind persönlich – nicht in die Checkliste drängen
  const startSteps = shared ? allSteps.slice(2) : allSteps
  const notices = shared ? (state.sync?.notices ?? []).slice(-3).reverse() : []
  const askWho = !!state.ha?.share && !state.ha.me

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

  // Backen: Nachfrage zum ersten unbeantworteten Backtag; sonst höchstens ein sanfter Vorschlag (nur ohne anderen Hinweis)
  const pendingBake = pendingBakes(state.bakePlan, today)[0]
  const bakeSuggestion = useMemo(
    () => (onboarding ? undefined : suggestBake({ today, pantry: state.pantry, baked: state.baked, bakeRatings: state.bakeRatings, bakePlan: state.bakePlan, hints: state.bakeHints })),
    [onboarding, today, state.pantry, state.baked, state.bakeRatings, state.bakePlan, state.bakeHints],
  )
  const askRecipe = pendingBake ? RECIPE_BY_ID[pendingBake.entry.recipeId] : undefined

  return (
    <WeekView
      bakes={state.bakePlan}
      onBake={(day, recipeId) => ui.setBakeSheet({ day, recipeId })}
      bakeSlot={
        pendingBake && askRecipe ? (
          <BakeAskCard
            recipe={askRecipe}
            day={pendingBake.day}
            onYes={() => act.confirmBaked(pendingBake.day, pendingBake.entry.recipeId)}
            onMove={() => ui.setBakeSheet({ day: pendingBake.day, recipeId: pendingBake.entry.recipeId, move: true })}
            onNo={() => act.removeBakeEntry(pendingBake.day, pendingBake.entry.recipeId)}
          />
        ) : bakeSuggestion && !notice ? (
          <BakeHintCard s={bakeSuggestion} onAccept={() => act.acceptBakeSuggestion(bakeSuggestion)} onDismiss={() => act.dismissBakeSuggestion(bakeSuggestion)} />
        ) : undefined
      }
      ratingSlot={(() => {
        const day = pendingRating(state.plan, state.ratings, today, state.ratingDismissed)
        const r = day ? RECIPE_BY_ID[state.plan[day]!.recipeId] : undefined
        // Frühstück: Sättigung am ersten Frühstückstag nach dem Vorbereiten (ab mittags) bzw. danach
        const sp = pendingSatiety(state.bfPreps, state.bfSatiety, state.bfSatietyDismissed, today, new Date().getHours())
        const sr = sp ? RECIPE_BY_ID[sp.recipeId] : undefined
        if ((!day || !r) && !sr) return null
        return (
          <>
            {day && r && <RatingCard title={r.title} day={day} portion={state.portionFeedback[day]} onPortion={(v) => act.setPortionFeedback(day, v)} onRate={(v) => act.rate(day, v)} onDismiss={() => act.dismissRating(day)} />}
            {sp && sr && <SatietyCard title={sr.title} day={sp.days[0]} onAnswer={(v) => act.setBfSatiety(prepRatingKey(sp), v)} onDismiss={() => act.dismissSatiety(prepRatingKey(sp))} />}
          </>
        )
      })()}
      days={days}
      plan={state.plan}
      planBy={(d) => plannedBy(state, d)}
      syncSlot={
        notices.length || askWho ? (
          <div className="sync-notices">
            {askWho && (
              <button className="notice" onClick={() => ui.setShowProfile(true, 'ha')}>
                <span className="notice-text">👨‍👩 Familie teilen: Wer bist du? Bitte einmal auswählen.</span>
              </button>
            )}
            {notices.map((n) => (
              <div key={n.id} className="notice sync-notice" role="status">
                <span className="notice-text">{n.text}</span>
                {n.undo && <button className="link small" onClick={() => act.undoSyncNotice(n.id)}>Rückgängig</button>}
                <button className="sync-x" aria-label="Hinweis schließen" onClick={() => act.dismissSyncNotice(n.id)}>✕</button>
              </div>
            ))}
          </div>
        ) : undefined
      }
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
            onShare={!state.ha?.share ? () => ui.setShowProfile(true, 'ha') : undefined}
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

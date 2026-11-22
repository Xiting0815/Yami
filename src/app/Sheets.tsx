import { RECIPE_BY_ID } from '../data/recipes'
import { forgottenItems } from '../forgot'
import { learnedPrepWeekday } from '../breakfast'
import { findPrep, preppedKeep, preppedText } from '../breakfastPrep'
import { pantryWishes, portionNote, satietyNote, summarize } from '../learning'
import { cookTarget } from '../cookDone'
import { bakesOn } from '../bakePlan'
import { portionFor } from '../energy'
import { defaultReviewMonday } from '../review'
import { addDays, isoDate, parseIso, sharingActive, weekdayName } from '../store'
import { syncStatusText } from '../sync'
import { DayActionsSheet } from '../components/DayActionsSheet'
import { BakeSheet } from '../components/BakeSheet'
import { DayPicker } from '../components/DayPicker'
import { FilterSheet } from '../components/FilterBar'
import { PantryDaySheet } from '../components/PantryDaySheet'
import { PrepSheet } from '../components/PrepSheet'
import { ProfileSheet } from '../components/ProfileSheet'
import { ProgressSheet } from '../components/ProgressSheet'
import { RecipeEditor } from '../components/RecipeEditor'
import { RateSheet } from '../components/RateSheet'
import { RecipeSheet } from '../components/RecipeSheet'
import { ReviewSheet } from '../components/ReviewSheet'
import type { AppModel } from './useAppModel'

/**
 * Alle Sheets/Overlays über den Tabs. Welche offen sind, steht in `useUi` –
 * dort hängen sie auch an der Zurück-Taste (useBackStack). Reihenfolge = Stapelreihenfolge im DOM.
 */
export function Sheets({ m }: { m: AppModel }) {
  const { state, cal, ui, plan, bf, energy, status, act, ha } = m
  const { today, days, weekKey } = cal
  const { sheet, editor, actionsDay } = ui
  const profile = state.profile
  const actionsEntry = actionsDay ? state.plan[actionsDay] : undefined
  const actionsRecipe = actionsEntry ? RECIPE_BY_ID[actionsEntry.recipeId] : undefined

  return (
    <>
      {sheet && (
        <RecipeSheet
          key={sheet.recipe.id}
          recipe={sheet.recipe}
          prices={state.prices}
          insight={plan.insights.get(sheet.recipe.id)}
          portion={(() => {
            const day = sheet.day
            if (sheet.recipe.breakfast || sheet.recipe.basic || !day) return undefined
            const budget = energy.dinnerBudgetFor(day)
            return budget != null
              ? { ...portionFor(sheet.recipe, budget, state.plan[day]?.servings ?? state.defaultServings), budget, household: portionNote(plan.portion) }
              : undefined
          })()}
          servings={
            sheet.recipe.breakfast
              ? act.prepPortions(sheet.recipe.id)
              : sheet.recipe.basic
                ? (sheet.day ? bakesOn(state.bakePlan, sheet.day).find((e) => e.recipeId === sheet.recipe.id && !e.status)?.amount ?? 1 : 1) * sheet.recipe.servings
                : ((sheet.day && state.plan[sheet.day]?.recipeId === sheet.recipe.id ? state.plan[sheet.day]?.servings : undefined) ??
                state.defaultServings)
          }
          onClose={() => ui.setSheet(null)}
          cooking={ui.cooking}
          onCooking={ui.setCooking}
          onFinish={
            sheet.recipe.breakfast
              ? {
                  label: 'Fertig vorbereitet ✓',
                  stock: (n: number) => `${preppedText(sheet.recipe, n)} (${preppedKeep(sheet.recipe)})`,
                  run: (servings: number) => act.finishPrep(sheet.recipe, servings),
                }
              : sheet.recipe.basic
                ? { run: (servings: number) => act.finishBasic(sheet.recipe, servings, sheet.day) }
                : (() => {
                  const t = cookTarget(state.plan, sheet.recipe.id, today, sheet.day)
                  return {
                    conflict: t.kind === 'conflict' ? t.title : undefined,
                    run: (servings: number, replace: boolean) => act.finishCooking(sheet.recipe, servings, sheet.day, replace),
                  }
                })()
          }
          onOpenRecipe={(r) => ui.setSheet({ recipe: r, mode: 'view' })}
          bakePlanner={
            sheet.recipe.basic && sheet.recipe.yields
              ? {
                  today,
                  plannedDays: Object.keys(state.bakePlan).filter((d) => bakesOn(state.bakePlan, d).some((e) => e.recipeId === sheet.recipe.id && !e.status)),
                  onPlan: (day, amount) => {
                    act.planBake(sheet.recipe, day, amount)
                    ui.setSheet(null)
                  },
                }
              : undefined
          }
          showClassic={state.showClassicSteps}
          onShowClassic={(v) => m.setState((s) => ({ ...s, showClassicSteps: v }))}
          onEdit={() => {
            const c = state.customRecipes.find((x) => x.id === sheet.recipe.id)
            ui.setSheet(null)
            if (c) ui.setEditor({ recipe: c })
          }}
          onDelete={() => act.deleteCustom(sheet.recipe.id)}
          action={
            sheet.recipe.breakfast
              ? sheet.mode === 'take' || sheet.mode === 'pick'
                ? {
                    label: bf.picks.includes(sheet.recipe.id) ? '✓ Schon gewählt' : '☀️ Fürs Frühstück Mo–Fr wählen',
                    onClick: () => {
                      if (!bf.picks.includes(sheet.recipe.id)) act.pickBreakfast(sheet.recipe)
                      ui.setSheet(null)
                    },
                  }
                : undefined
              : sheet.mode === 'take' && sheet.day
              ? {
                  label: `Für ${weekdayName(sheet.day)} nehmen`,
                  onClick: (servings) => {
                    act.take(sheet.recipe, sheet.day!, servings)
                    ui.setSheet(null)
                  },
                }
              : sheet.mode === 'view' && sheet.day && !sheet.recipe.basic && !state.plan[sheet.day]?.status
                ? {
                    label: 'Portionen übernehmen',
                    onClick: (servings) => {
                      act.setEntry(sheet.day!, { recipeId: sheet.recipe.id, servings })
                      ui.setSheet(null)
                    },
                  }
                : undefined
          }
        />
      )}

      {editor && (
        <RecipeEditor
          key={editor.recipe?.id ?? 'new'}
          initial={editor.recipe}
          defaultMeal={ui.meal}
          onSave={act.saveCustom}
          onCreateIngredient={act.createIngredient}
          onClose={() => ui.setEditor(null)}
        />
      )}

      {sheet?.mode === 'pick' && !sheet.recipe.breakfast && !sheet.recipe.basic && (
        <DayPicker
          days={days}
          plan={state.plan}
          onPick={(day) => {
            act.planOn(sheet.recipe, day)
            ui.setSheet(null)
          }}
        />
      )}

      {ui.bakeSheet && (() => {
        const { day, recipeId, move } = ui.bakeSheet
        const entry = bakesOn(state.bakePlan, day).find((e) => e.recipeId === recipeId)
        const recipe = RECIPE_BY_ID[recipeId]
        if (!entry || !recipe) return null
        return (
          <BakeSheet
            key={`${day}|${recipeId}`}
            day={day}
            entry={entry}
            recipe={recipe}
            today={today}
            plannedDays={Object.keys(state.bakePlan).filter((d) => bakesOn(state.bakePlan, d).some((e) => e.recipeId === recipeId && !e.status))}
            startMove={move}
            onClose={() => ui.setBakeSheet(null)}
            onAmount={(n) => act.changeBakeAmount(day, recipeId, n)}
            onView={() => {
              ui.setBakeSheet(null)
              ui.setSheet({ recipe, day, mode: 'view' })
            }}
            onBaked={() => act.confirmBaked(day, recipeId)}
            onMove={(to) => {
              ui.setBakeSheet(null)
              act.moveBakeTo(day, recipeId, to)
            }}
            onRemove={() => {
              ui.setBakeSheet(null)
              act.removeBakeEntry(day, recipeId)
            }}
          />
        )
      })()}

      {ui.pantryChooser && (
        <PantryDaySheet today={today} plan={state.plan} onClose={() => ui.setPantryChooser(false)} onPick={act.startPantrySwipe} />
      )}

      {actionsDay && actionsEntry && actionsRecipe && (
        <DayActionsSheet
          day={actionsDay}
          entry={actionsEntry}
          recipe={actionsRecipe}
          today={today}
          prices={state.prices}
          balance={energy.balances[actionsDay]}
          portion={energy.portions[actionsDay]}
          onClose={() => ui.setActionsDay(null)}
          onServings={(n) => act.setEntry(actionsDay, { ...actionsEntry, servings: n })}
          onView={() => {
            ui.setActionsDay(null)
            ui.setSheet({ recipe: actionsRecipe, day: actionsDay, mode: 'view' })
          }}
          onSwap={() => {
            ui.setActionsDay(null)
            act.startSwipe(actionsDay)
          }}
          onUncook={() => {
            ui.setActionsDay(null)
            act.uncookDay(actionsDay)
          }}
          onRecook={() => {
            ui.setActionsDay(null)
            act.recookDay(actionsDay)
          }}
          onRemove={() => {
            ui.setActionsDay(null)
            act.removeEntry(actionsDay)
          }}
        />
      )}

      {ui.rateDay && state.plan[ui.rateDay] && RECIPE_BY_ID[state.plan[ui.rateDay]!.recipeId] && (
        <RateSheet
          title={RECIPE_BY_ID[state.plan[ui.rateDay]!.recipeId].title}
          day={ui.rateDay}
          today={today}
          rating={state.ratings[ui.rateDay]}
          portion={state.portionFeedback[ui.rateDay]}
          onRate={(v) => act.setRating(ui.rateDay!, v)}
          onPortion={(v) => act.setPortionFeedback(ui.rateDay!, v)}
          onClose={() => {
            if (state.ratings[ui.rateDay!] !== undefined || state.portionFeedback[ui.rateDay!] !== undefined) m.flash('Danke – gemerkt ✓')
            ui.setRateDay(null)
          }}
        />
      )}

      {ui.rateBake && RECIPE_BY_ID[ui.rateBake.recipeId] && (
        <RateSheet
          title={RECIPE_BY_ID[ui.rateBake.recipeId].title}
          day={ui.rateBake.date}
          today={today}
          rating={state.bakeRatings[`${ui.rateBake.date}:${ui.rateBake.recipeId}`]}
          onRate={(v) => act.setBakeRating(ui.rateBake!.date, ui.rateBake!.recipeId, v)}
          onClose={() => {
            if (state.bakeRatings[`${ui.rateBake!.date}:${ui.rateBake!.recipeId}`] !== undefined) m.flash('Danke – gemerkt ✓')
            ui.setRateBake(null)
          }}
        />
      )}

      {ui.rateBf && RECIPE_BY_ID[ui.rateBf.recipeId] && (() => {
        const key = `${ui.rateBf.date}:${ui.rateBf.recipeId}`
        return (
          <RateSheet
            title={RECIPE_BY_ID[ui.rateBf.recipeId].title}
            day={ui.rateBf.date}
            today={today}
            hint="Probiert? Ob es bis mittags satt macht, frage ich nach dem ersten Frühstück."
            rating={state.bfRatings[key]}
            onRate={(v) => act.setBfRating(ui.rateBf!.date, ui.rateBf!.recipeId, v)}
            onClose={() => {
              if (state.bfRatings[key] !== undefined) m.flash('Danke – gemerkt ✓')
              ui.setRateBf(null)
            }}
          />
        )
      })()}

      {ui.showPrep && (
        <PrepSheet
          items={bf.prepItems}
          notes={bf.assignment.notes}
          prep={bf.prep}
          prepChoices={bf.prepChoices}
          onPrepDay={act.changePrepDay}
          checked={state.prepChecked[weekKey] ?? []}
          onToggle={act.togglePrepCheck}
          prepped={(id) => {
            const p = findPrep(state.bfPreps, weekKey, id)
            return p ? { date: p.date, text: preppedText(RECIPE_BY_ID[id], p.portions) } : undefined
          }}
          onFinish={(r) => {
            ui.setShowPrep(false)
            act.finishPrep(r, act.prepPortions(r.id))
          }}
          onUndo={(id) => act.undoPrep(id, weekKey)}
          onClose={() => ui.setShowPrep(false)}
        />
      )}

      {ui.showProgress && profile && (
        <ProgressSheet
          profile={profile}
          weighIns={state.weighIns}
          today={today}
          suggestion={status.pendingSuggestion}
          onReview={() => ui.setReviewMonday(defaultReviewMonday(today))}
          onClose={() => ui.setShowProgress(false)}
          onSave={act.saveWeighIn}
          onDelete={act.deleteWeighIn}
          onDecide={act.decideAdjust}
          onGoal={act.setGoal}
          onMuscleUnit={act.setMuscleUnit}
        />
      )}

      {ui.showProfile && (
        <ProfileSheet
          profile={profile}
          learned={summarize(plan.taste)}
          learnedOthers={plan.others.map((o) => ({ name: o.name, learned: summarize(o.model) }))}
          profileOptional={sharingActive(state.ha)}
          focusHa={ui.profileFocus === 'ha'}
          familyStatus={sharingActive(state.ha) ? syncStatusText(state.sync, state.ha.me, Date.now()) : undefined}
          haMain={state.sync?.main ? { person: state.sync.main.person, mine: state.sync.main.device === state.ha?.device } : undefined}
          portionNote={portionNote(plan.portion)}
          satietyNote={satietyNote(bf.satiety)}
          forgotten={forgottenItems(state.removals, today)}
          wishes={pantryWishes(state.pantryRequests)}
          prepWeekday={learnedPrepWeekday(state.prepDays, today)}
          onResetLearning={act.resetLearning}
          lastBackup={state.lastBackup}
          ha={state.ha}
          onHaChange={act.setHa}
          onHaSyncNow={() => void ha.syncNow()}
          haSyncing={ha.syncing}
          onExport={act.exportData}
          onImport={act.importData}
          onClose={() => ui.setShowProfile(false)}
          onSave={act.saveProfile}
        />
      )}

      {ui.showFilters && (
        <FilterSheet
          filters={state.filters}
          onChange={act.setFilters}
          count={plan.filteredCount}
          onClose={() => ui.setShowFilters(false)}
        />
      )}

      {status.sheetReview && ui.reviewMonday && (
        <ReviewSheet
          review={status.sheetReview}
          canNext={ui.reviewMonday < defaultReviewMonday(today)}
          onWeek={(delta) => ui.setReviewMonday((mon) => (mon ? isoDate(addDays(parseIso(mon), delta * 7)) : mon))}
          onClose={() => ui.setReviewMonday(null)}
        />
      )}
    </>
  )
}

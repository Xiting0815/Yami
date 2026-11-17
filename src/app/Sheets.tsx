import { RECIPE_BY_ID } from '../data/recipes'
import { learnedPrepWeekday } from '../breakfast'
import { pantryWishes, portionNote, summarize } from '../learning'
import { cookTarget } from '../cookDone'
import { portionFor } from '../energy'
import { defaultReviewMonday } from '../review'
import { addDays, isoDate, parseIso, weekdayName } from '../store'
import { DayActionsSheet } from '../components/DayActionsSheet'
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
            if (sheet.recipe.breakfast || !day) return undefined
            const budget = energy.dinnerBudgetFor(day)
            return budget != null
              ? { ...portionFor(sheet.recipe, budget, state.plan[day]?.servings ?? state.defaultServings), budget, household: portionNote(plan.portion) }
              : undefined
          })()}
          servings={
            sheet.recipe.breakfast
              ? 1
              : sheet.recipe.basic
                ? sheet.recipe.servings
                : ((sheet.day && state.plan[sheet.day]?.recipeId === sheet.recipe.id ? state.plan[sheet.day]?.servings : undefined) ??
                state.defaultServings)
          }
          onClose={() => ui.setSheet(null)}
          cooking={ui.cooking}
          onCooking={ui.setCooking}
          onFinish={
            sheet.recipe.breakfast
              ? undefined
              : sheet.recipe.basic
                ? { run: (servings: number) => act.finishBasic(sheet.recipe, servings) }
                : (() => {
                  const t = cookTarget(state.plan, sheet.recipe.id, today, sheet.day)
                  return {
                    conflict: t.kind === 'conflict' ? t.title : undefined,
                    run: (servings: number, replace: boolean) => act.finishCooking(sheet.recipe, servings, sheet.day, replace),
                  }
                })()
          }
          onOpenRecipe={(r) => ui.setSheet({ recipe: r, mode: 'view' })}
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
              : sheet.mode === 'view' && sheet.day && !state.plan[sheet.day]?.status
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

      {ui.showPrep && (
        <PrepSheet
          items={bf.prepItems}
          notes={bf.assignment.notes}
          prep={bf.prep}
          prepChoices={bf.prepChoices}
          onPrepDay={act.changePrepDay}
          checked={state.prepChecked[weekKey] ?? []}
          onToggle={act.togglePrepCheck}
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
          portionNote={portionNote(plan.portion)}
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

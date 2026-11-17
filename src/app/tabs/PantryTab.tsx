import { PantryView } from '../../components/PantryView'
import type { AppModel } from '../useAppModel'

/** Tab „Vorrat“ */
export function PantryTab({ m }: { m: AppModel }) {
  const { state, cal, ui, plan, act } = m
  return (
    <PantryView
      pantry={state.pantry}
      leftovers={plan.week.leftovers}
      hints={plan.hints}
      spices={state.spices}
      onSpice={act.setSpice}
      today={cal.today}
      onChange={act.changePantry}
      onAdded={act.noteRequest}
      onCreate={act.createPantryItem}
      onCook={() => ui.setPantryChooser(true)}
    />
  )
}

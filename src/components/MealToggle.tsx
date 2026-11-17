import type { Meal } from '../app/types'

export function MealToggle({ meal, onChange }: { meal: Meal; onChange: (m: Meal) => void }) {
  return (
    <div className="segmented" role="tablist">
      <button className={meal === 'breakfast' ? 'on' : ''} onClick={() => onChange('breakfast')} role="tab" aria-selected={meal === 'breakfast'}>
        ☀️ Frühstück
      </button>
      <button className={meal === 'dinner' ? 'on' : ''} onClick={() => onChange('dinner')} role="tab" aria-selected={meal === 'dinner'}>
        🌙 Abendessen
      </button>
    </div>
  )
}

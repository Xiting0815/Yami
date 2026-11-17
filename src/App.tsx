import { useAppModel } from './app/useAppModel'
import { TopBar } from './app/TopBar'
import { TabBar } from './app/TabBar'
import { Sheets } from './app/Sheets'
import { ToastBar } from './app/ToastBar'
import { WeekTab } from './app/tabs/WeekTab'
import { SwipeTab } from './app/tabs/SwipeTab'
import { ListTab } from './app/tabs/ListTab'
import { PantryTab } from './app/tabs/PantryTab'
import { RecipesTab } from './app/tabs/RecipesTab'

/**
 * Gerüst der App. Zustand, abgeleitete Werte und Aktionen: src/app/useAppModel.ts;
 * Tabs: src/app/tabs; Sheets & Zurück-Taste: src/app/Sheets.tsx + src/app/useUi.ts.
 */
export default function App() {
  const m = useAppModel()
  const { tab } = m.ui
  return (
    <div className="app">
      <TopBar m={m} />

      <main className={`content ${tab === 'wischen' ? 'swipe' : ''}`}>
        {tab === 'woche' && <WeekTab m={m} />}
        {tab === 'wischen' && <SwipeTab m={m} />}
        {tab === 'liste' && <ListTab m={m} />}
        {tab === 'vorrat' && <PantryTab m={m} />}
        {tab === 'rezepte' && <RecipesTab m={m} />}
      </main>

      <TabBar m={m} />

      <Sheets m={m} />

      <ToastBar m={m} />
    </div>
  )
}

import { useAppModel } from './app/useAppModel'
import { TopBar } from './app/TopBar'
import { TabBar } from './app/TabBar'
import { Sheets } from './app/Sheets'
import { ToastBar } from './app/ToastBar'
import { UpdateBanner } from './app/UpdateBanner'
import { WeekTab } from './app/tabs/WeekTab'
import { lazyNamed } from './app/lazy'

// Start-Tab „Woche“ sofort, die übrigen Tabs beim ersten Antippen (liegen offline im Vorab-Speicher)
const SwipeTab = lazyNamed(() => import('./app/tabs/SwipeTab').then((m) => m.SwipeTab))
const ListTab = lazyNamed(() => import('./app/tabs/ListTab').then((m) => m.ListTab))
const PantryTab = lazyNamed(() => import('./app/tabs/PantryTab').then((m) => m.PantryTab))
const RecipesTab = lazyNamed(() => import('./app/tabs/RecipesTab').then((m) => m.RecipesTab))

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
      <UpdateBanner />

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

import { useEffect, useMemo, useRef, useState } from 'react'
import { isoDate, parseIso, weekDays } from '../store'
import { defaultMonday, initialMonday } from './dates'

/** Heute und die angezeigte Woche */
export function useCalendar() {
  const [today, setToday] = useState(() => isoDate(new Date()))
  const [monday, setMonday] = useState(initialMonday)
  const days = useMemo(() => weekDays(monday), [monday])
  // App bleibt oft tagelang offen: wer die „aktuelle“ Woche ansieht, wandert beim Wochenwechsel mit
  const lastToday = useRef(today)
  useEffect(() => {
    const prev = lastToday.current
    lastToday.current = today
    if (prev !== today && isoDate(monday) === defaultMonday(prev) && defaultMonday(today) !== defaultMonday(prev)) {
      setMonday(parseIso(defaultMonday(today)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])

  // Datum aktuell halten (App bleibt oft tagelang offen)
  useEffect(() => {
    const tick = () => setToday(isoDate(new Date()))
    const id = window.setInterval(tick, 60_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  return { today, monday, setMonday, days, weekKey: days[0] }
}

export type Calendar = ReturnType<typeof useCalendar>

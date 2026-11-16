import { useEffect, useMemo, useRef, useState } from 'react'
import { CATALOG } from '../data/catalog'
import { CAT_DEFAULTS, baseUnitOf } from '../data/custom-registry'
import { UNITS } from '../data/define'
import { nutritionOf } from '../data/nutrition-calc'
import { ingredientText, parseIngredientText, searchIngredients, titleCase, unitWorks, workingUnits, CONFIDENT } from '../customIngredients'
import { shrinkImage } from '../imageResize'
import { uid } from '../kitchen'
import {
  BREAKFAST_LABEL, CUISINE_LABEL, SHOP_LABEL, SHOP_ORDER, TYPE_LABEL,
  type BreakfastType, type Cuisine, type CustomIngredient, type CustomRecipe, type DishType, type ShopCat,
} from '../types'

interface Row {
  id: string
  /** Text, wie er eingefügt wurde (zur Orientierung) */
  raw: string
  amount: string
  unit: string
  match: string | null
  /** Treffer ist nicht ganz sicher */
  guess: boolean
  alts: string[]
  ignore?: boolean
  /** Auswahlfeld offen */
  picking: boolean
  q: string
  /** Formular „Als neue Zutat anlegen“ */
  create: null | { name: string; cat: ShopCat; kcal: string; protein: string; grams: string }
}

const num = (s: string): number | null => {
  const t = s.trim().replace(',', '.')
  if (!t) return null
  const v = Number(t)
  return Number.isFinite(v) && v >= 0 ? v : NaN
}
const fmt = (v: number | null) => (v == null ? '' : String(Math.round(v * 100) / 100).replace('.', ','))

/** Schrittliste aus Text: eine Zeile je Schritt, Nummerierung ("1.", "2)", "Schritt 3:") entfällt */
export function parseSteps(text: string): string[] {
  let lines = text.split(/\r?\n/)
  // alles in einer Zeile mit "1. … 2. …" → trennen
  if (lines.filter((l) => l.trim()).length === 1 && /(^|\s)1[.)]\s.*\s2[.)]\s/.test(text)) lines = text.split(/\s+(?=\d{1,2}[.)]\s)/)
  return lines
    .map((l) => l.replace(/^\s*(schritt\s*\d+\s*[:.)-]?|\d{1,2}\s*[.):]|[-–•*])\s*/i, '').trim())
    .filter(Boolean)
}

function rowFrom(l: ReturnType<typeof parseIngredientText>[number]): Row {
  return {
    id: uid(),
    raw: l.raw,
    amount: fmt(l.amount),
    unit: l.amount == null ? '' : l.unit,
    match: l.match ?? null,
    guess: !!l.match && l.confidence < CONFIDENT,
    alts: l.alternatives,
    ignore: l.ignore,
    picking: !l.match && !l.ignore,
    q: l.text,
    create: null,
  }
}

interface Props {
  /** vorhandenes Rezept bearbeiten; ohne = neues */
  initial?: CustomRecipe
  defaultMeal: 'dinner' | 'breakfast'
  onSave: (r: Omit<CustomRecipe, 'id' | 'created'> & { id?: string }) => void
  onCreateIngredient: (c: CustomIngredient) => void
  onClose: () => void
}

export function RecipeEditor({ initial, defaultMeal, onSave, onCreateIngredient, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [meal, setMeal] = useState<'dinner' | 'breakfast'>(initial?.meal ?? defaultMeal)
  const [cuisine, setCuisine] = useState<Cuisine>(initial?.cuisine ?? 'de')
  const [type, setType] = useState<DishType>(initial?.type ?? 'haupt')
  const [bType, setBType] = useState<BreakfastType>(initial?.breakfast?.type ?? 'herzhaft')
  const [fridgeDays, setFridgeDays] = useState(String(initial?.breakfast?.fridgeDays ?? 3))
  const [freezer, setFreezer] = useState(initial?.breakfast?.freezer ?? false)
  const [container, setContainer] = useState(initial?.breakfast?.container ?? 'Glas')
  const [morning, setMorning] = useState(initial?.breakfast?.morning ?? '')
  const [time, setTime] = useState(String(initial?.time ?? 30))
  const [servings, setServings] = useState(String(initial?.servings ?? (defaultMeal === 'breakfast' ? 1 : 2)))
  const servingsTouched = useRef(!!initial)
  const [paste, setPaste] = useState('')
  const [rows, setRows] = useState<Row[]>(() =>
    (initial?.ingredients ?? []).map((i) => ({
      id: uid(), raw: ingredientText(i), amount: fmt(i.amount), unit: i.unit, match: i.name, guess: false, alts: [], picking: false, q: '', create: null,
    })),
  )
  const [stepsText, setStepsText] = useState((initial?.steps ?? []).join('\n'))
  const [image, setImage] = useState<string | undefined>(initial?.image)
  const [imgError, setImgError] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const patch = (id: string, p: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)))

  function addPasted() {
    const parsed = parseIngredientText(paste)
    if (!parsed.length) return
    setRows((rs) => [...rs, ...parsed.map(rowFrom)])
    setPaste('')
  }

  function chooseMatch(row: Row, name: string) {
    patch(row.id, { match: name, guess: false, picking: false, create: null })
  }

  function createIngredient(row: Row) {
    const c = row.create
    if (!c) return
    const name = c.name.trim()
    if (!name) return
    if (!CATALOG[name]) {
      const unit = baseUnitOf(row.unit)
      const ci: CustomIngredient = {
        name,
        cat: c.cat,
        kcal: Math.max(0, num(c.kcal) || 0),
        protein: Math.max(0, num(c.protein) || 0),
        unit,
        gramsPerPiece: unit === 'Stk' ? Math.max(1, num(c.grams) || 100) : undefined,
      }
      onCreateIngredient(ci)
    }
    patch(row.id, { match: name, guess: false, picking: false, create: null })
  }

  const amountOf = (r: Row) => num(r.amount)
  const rowOk = (r: Row) => !!r.ignore || (!!r.match && !!CATALOG[r.match] && !Number.isNaN(amountOf(r)) && (amountOf(r) == null || unitWorks(r.match, r.unit)))
  const live = rows.filter((r) => !r.ignore && r.match && CATALOG[r.match])
  const ingredients = live.filter(rowOk).map((r) => ({ name: r.match!, amount: amountOf(r), unit: amountOf(r) == null ? '' : r.unit }))
  const srv = Math.max(1, Math.round(Number(servings) || 1))
  const nutri = useMemo(() => nutritionOf(ingredients, srv), [rows, srv]) // eslint-disable-line react-hooks/exhaustive-deps
  const open = rows.filter((r) => !rowOk(r)).length
  const steps = parseSteps(stepsText)
  const missing: string[] = []
  if (!title.trim()) missing.push('Titel')
  if (!ingredients.length && !open) missing.push('Zutaten')
  if (open) missing.push(open === 1 ? '1 Zutat zuordnen' : `${open} Zutaten zuordnen`)
  if (!steps.length) missing.push('Schritte')
  const canSave = missing.length === 0

  function save() {
    if (!canSave) return
    onSave({
      id: initial?.id,
      title: title.trim(),
      meal,
      cuisine: meal === 'breakfast' ? 'de' : cuisine,
      type: meal === 'breakfast' ? 'haupt' : type,
      time: Math.max(1, Math.round(Number(time) || 30)),
      servings: srv,
      ingredients,
      steps,
      image,
      breakfast:
        meal === 'breakfast'
          ? {
              type: bType,
              fridgeDays: Math.max(1, Math.round(Number(fridgeDays) || 3)),
              freezer,
              container: container.trim() || 'Glas',
              morning: morning.trim(),
            }
          : undefined,
    })
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return
    setImgError('')
    try {
      setImage(await shrinkImage(file))
    } catch (e) {
      setImgError(e instanceof Error ? e.message : 'Das Foto konnte nicht verwendet werden.')
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet editor" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={initial ? 'Rezept bearbeiten' : 'Eigenes Rezept'}>
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>{initial ? '✏️ Rezept bearbeiten' : '➕ Eigenes Rezept'}</h2>

          <label className="ed-label" htmlFor="ed-title">Titel</label>
          <input id="ed-title" className="ed-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Omas Gulasch" maxLength={120} />

          <div className="ed-label">Mahlzeit</div>
          <div className="segmented">
            <button
              className={meal === 'dinner' ? 'on' : ''}
              onClick={() => {
                setMeal('dinner')
                if (!servingsTouched.current) setServings('2')
              }}
            >
              🌙 Abendessen
            </button>
            <button
              className={meal === 'breakfast' ? 'on' : ''}
              onClick={() => {
                setMeal('breakfast')
                if (!servingsTouched.current) setServings('1')
              }}
            >
              ☀️ Frühstück
            </button>
          </div>

          {meal === 'dinner' ? (
            <>
              <div className="ed-label">Küche</div>
              <div className="ed-chips">
                {(Object.keys(CUISINE_LABEL) as Cuisine[]).map((c) => (
                  <button key={c} className={`chip ${cuisine === c ? 'on' : ''}`} onClick={() => setCuisine(c)}>
                    {CUISINE_LABEL[c]}
                  </button>
                ))}
              </div>
              <div className="ed-label">Art</div>
              <div className="ed-chips">
                {(Object.keys(TYPE_LABEL) as DishType[]).map((t) => (
                  <button key={t} className={`chip ${type === t ? 'on' : ''}`} onClick={() => setType(t)}>
                    {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="ed-label">Frühstückstyp</div>
              <div className="ed-chips">
                {(Object.keys(BREAKFAST_LABEL) as BreakfastType[]).map((t) => (
                  <button key={t} className={`chip ${bType === t ? 'on' : ''}`} onClick={() => setBType(t)}>
                    {BREAKFAST_LABEL[t]}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="ed-grid">
            <label>
              Zeit (Min.)
              <input className="ed-input" inputMode="numeric" value={time} onChange={(e) => setTime(e.target.value.replace(/\D/g, ''))} />
            </label>
            <label>
              Portionen
              <input
                className="ed-input"
                inputMode="numeric"
                value={servings}
                onChange={(e) => {
                  servingsTouched.current = true
                  setServings(e.target.value.replace(/\D/g, ''))
                }}
              />
            </label>
            {meal === 'breakfast' && (
              <>
                <label>
                  Haltbar (Tage)
                  <input className="ed-input" inputMode="numeric" value={fridgeDays} onChange={(e) => setFridgeDays(e.target.value.replace(/\D/g, ''))} />
                </label>
                <label>
                  Behälter
                  <input className="ed-input" value={container} onChange={(e) => setContainer(e.target.value)} placeholder="Glas" />
                </label>
              </>
            )}
          </div>
          {meal === 'breakfast' && (
            <>
              <div className="ed-chips">
                <button className={`chip ${freezer ? 'on' : ''}`} onClick={() => setFreezer(!freezer)}>
                  ❄️ Einfrierbar
                </button>
              </div>
              <label className="ed-label" htmlFor="ed-morning">Morgens / auf der Arbeit</label>
              <input id="ed-morning" className="ed-input" value={morning} onChange={(e) => setMorning(e.target.value)} placeholder="z. B. 90 Sek. in der Mikrowelle erwärmen" />
            </>
          )}

          <div className="ed-label">Foto (optional)</div>
          <div className="ed-photo">
            {image ? <img src={image} alt="Rezeptfoto" /> : <div className="ed-photo-empty">📷</div>}
            <div className="ed-photo-btns">
              <label className="btn ghost">
                📷 Aufnehmen
                <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => { void onPhoto(e.target.files?.[0]); e.target.value = '' }} />
              </label>
              <label className="btn ghost">
                🖼️ Galerie
                <input type="file" accept="image/*" hidden onChange={(e) => { void onPhoto(e.target.files?.[0]); e.target.value = '' }} />
              </label>
              {image && (
                <button className="btn ghost" onClick={() => setImage(undefined)}>
                  Entfernen
                </button>
              )}
            </div>
          </div>
          {imgError && <p className="ed-warn">{imgError}</p>}

          <h3>Zutaten</h3>
          <label className="ed-label" htmlFor="ed-paste">Zutaten einfügen</label>
          <textarea
            id="ed-paste"
            className="ed-input ed-text"
            rows={4}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={'400 g Hackfleisch, 2 Zwiebeln, 1 EL Tomatenmark …\noder eine Zutat pro Zeile'}
          />
          <button className="btn ghost wide" disabled={!paste.trim()} onClick={addPasted}>
            Zutaten erkennen
          </button>

          {rows.length > 0 && (
            <ul className="ed-rows">
              {rows.map((r) => {
                const ok = rowOk(r)
                const known = !!r.match && !!CATALOG[r.match]
                const unitBad = known && amountOf(r) != null && !unitWorks(r.match!, r.unit)
                const results = r.picking ? (r.q.trim() ? searchIngredients(r.q) : r.alts) : []
                return (
                  <li key={r.id} className={`ed-row ${r.ignore ? 'ign' : !known ? 'bad' : unitBad || r.guess ? 'warn' : 'good'}`}>
                    <div className="ed-row-head">
                      <span className="ed-raw">{r.raw}</span>
                      <button className="icon-btn tiny" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`${r.raw} entfernen`}>
                        ✕
                      </button>
                    </div>
                    {r.ignore ? (
                      <div className="ed-status">💧 Wasser – kommt nicht auf die Einkaufsliste</div>
                    ) : (
                      <>
                        <div className="ed-line">
                          <input
                            className="ed-input ed-amt"
                            inputMode="decimal"
                            value={r.amount}
                            onChange={(e) => patch(r.id, { amount: e.target.value })}
                            placeholder="Menge"
                            aria-label="Menge"
                          />
                          <select className="ed-input ed-unit" value={r.unit} onChange={(e) => patch(r.id, { unit: e.target.value })} aria-label="Einheit">
                            <option value="">–</option>
                            {UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                                {known && !unitWorks(r.match!, u) ? ' ✗' : ''}
                              </option>
                            ))}
                          </select>
                          <span className="ed-arrow">→</span>
                          <button className="ed-match" onClick={() => patch(r.id, { picking: !r.picking, q: r.picking ? r.q : r.match ? '' : r.q })}>
                            {known ? r.match : 'Zutat wählen'}
                            <i>{ok && !r.guess ? ' ✓' : ' ▾'}</i>
                          </button>
                        </div>
                        {!known && <div className="ed-status bad">Unbekannt – bitte zuordnen</div>}
                        {known && r.guess && <div className="ed-status warn">Bitte prüfen – ist das richtig?</div>}
                        {unitBad && (
                          <div className="ed-status warn">
                            „{r.unit}“ passt nicht zu {r.match}. Nimm z. B. {workingUnits(r.match!).slice(0, 4).join(', ') || 'g'}.
                          </div>
                        )}
                        {Number.isNaN(amountOf(r)) && <div className="ed-status warn">Menge ist keine Zahl.</div>}

                        {r.picking && (
                          <div className="ed-pick">
                            <input
                              className="ed-input"
                              value={r.q}
                              onChange={(e) => patch(r.id, { q: e.target.value })}
                              placeholder="🔍 Zutat suchen …"
                              aria-label="Zutat suchen"
                            />
                            <div className="ed-results">
                              {results.map((n) => (
                                <button key={n} className="chip" onClick={() => chooseMatch(r, n)}>
                                  {n}
                                </button>
                              ))}
                              {!results.length && r.q.trim() && <span className="muted small">Nichts Passendes im Katalog.</span>}
                            </div>
                            {!r.create && (
                              <button
                                className="btn ghost wide"
                                onClick={() => {
                                  const d = CAT_DEFAULTS.gemuese
                                  patch(r.id, {
                                    create: { name: titleCase(r.q.trim() || r.raw.replace(/^[\d.,/½¼¾\s]+\S*\s/, '')), cat: 'gemuese', kcal: String(d.kcal), protein: String(d.protein), grams: '100' },
                                  })
                                }}
                              >
                                ➕ Als neue Zutat anlegen
                              </button>
                            )}
                            {r.create && (
                              <div className="ed-create">
                                <label>
                                  Name
                                  <input className="ed-input" value={r.create.name} onChange={(e) => patch(r.id, { create: { ...r.create!, name: e.target.value } })} />
                                </label>
                                <label>
                                  Einkaufsliste – Abschnitt
                                  <select
                                    className="ed-input"
                                    value={r.create.cat}
                                    onChange={(e) => {
                                      const cat = e.target.value as ShopCat
                                      const d = CAT_DEFAULTS[cat]
                                      patch(r.id, { create: { ...r.create!, cat, kcal: String(d.kcal), protein: String(d.protein) } })
                                    }}
                                  >
                                    {SHOP_ORDER.map((c) => (
                                      <option key={c} value={c}>
                                        {SHOP_LABEL[c]}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <div className="ed-grid">
                                  <label>
                                    kcal pro 100 g
                                    <input className="ed-input" inputMode="decimal" value={r.create.kcal} onChange={(e) => patch(r.id, { create: { ...r.create!, kcal: e.target.value } })} />
                                  </label>
                                  <label>
                                    Eiweiß pro 100 g
                                    <input className="ed-input" inputMode="decimal" value={r.create.protein} onChange={(e) => patch(r.id, { create: { ...r.create!, protein: e.target.value } })} />
                                  </label>
                                  {baseUnitOf(r.unit) === 'Stk' && (
                                    <label>
                                      Gewicht pro Stück (g)
                                      <input className="ed-input" inputMode="decimal" value={r.create.grams} onChange={(e) => patch(r.id, { create: { ...r.create!, grams: e.target.value } })} />
                                    </label>
                                  )}
                                </div>
                                <p className="muted small">Grobe Werte reichen – die App rechnet damit Nährwerte und Einkaufsmenge.</p>
                                <div className="row-btns">
                                  <button className="btn ghost" onClick={() => patch(r.id, { create: null })}>
                                    Abbrechen
                                  </button>
                                  <button className="btn primary grow" disabled={!r.create.name.trim()} onClick={() => createIngredient(r)}>
                                    Zutat anlegen
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          <h3>Schritte</h3>
          <textarea
            className="ed-input ed-text"
            rows={5}
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            placeholder={'Ein Schritt pro Zeile oder nummeriert:\n1. Zwiebeln anbraten\n2. Hack dazugeben …'}
            aria-label="Schritte"
          />
          {steps.length > 0 && <p className="muted small">{steps.length} {steps.length === 1 ? 'Schritt' : 'Schritte'} erkannt</p>}

          {ingredients.length > 0 && (
            <div className="ed-preview" aria-live="polite">
              <b>Pro Portion (≈)</b>
              <span>🔥 {nutri.kcal.toLocaleString('de-DE')} kcal</span>
              <span>💪 {Math.round(nutri.protein)} g Eiweiß</span>
              <span>🌾 {Math.round(nutri.fiber)} g Ballaststoffe</span>
            </div>
          )}
        </div>
        <div className="sheet-footer">
          {!canSave && <p className="ed-missing">Noch offen: {missing.join(' · ')}</p>}
          <div className="row-btns">
            <button className="btn ghost" onClick={onClose}>
              Abbrechen
            </button>
            <button className="btn primary grow" disabled={!canSave} onClick={save}>
              {initial ? 'Speichern' : 'Rezept speichern'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

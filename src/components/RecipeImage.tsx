import type { Recipe } from '../types'

const EMOJI: Record<Recipe['type'], string> = {
  haupt: '🍽️',
  pasta: '🍝',
  eintopf: '🍲',
  suppe: '🥣',
  auflauf: '🧀',
  brotzeit: '🥨',
}

const HUE: Record<Recipe['cuisine'], number> = { de: 28, it: 4, as: 340, gr: 205 }

export function RecipeImage({ recipe, className }: { recipe: Recipe; className?: string }) {
  if (recipe.image) {
    return <img className={className} src={recipe.image} alt={recipe.title} loading="lazy" draggable={false} />
  }
  const bt = recipe.breakfast?.type
  const h = bt ? 45 : HUE[recipe.cuisine]
  const emoji = bt ? (bt === 'herzhaft' ? '🍳' : bt === 'warm' ? '🥣' : '🫙') : EMOJI[recipe.type]
  return (
    <div
      className={`${className ?? ''} img-fallback`}
      style={{ background: `linear-gradient(135deg, hsl(${h} 75% 62%), hsl(${h + 25} 70% 45%))` }}
      aria-label={recipe.title}
    >
      <span>{emoji}</span>
    </div>
  )
}

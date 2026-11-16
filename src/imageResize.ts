/**
 * Foto verkleinern: höchstens 480 px breit, WebP (sonst JPEG) mit Qualität ≈ 0,7, möglichst unter 60 KB –
 * damit das Bild im localStorage Platz findet. Gibt eine Data-URL zurück.
 */
export async function shrinkImage(file: File, maxWidth = 480, maxBytes = 60_000): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('Das Bild konnte nicht gelesen werden.'))
      i.src = url
    })
    let w = Math.min(maxWidth, img.naturalWidth)
    let best = ''
    for (let round = 0; round < 6; round++) {
      const h = Math.max(1, Math.round((img.naturalHeight * w) / img.naturalWidth))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Das Bild konnte nicht verkleinert werden.')
      ctx.drawImage(img, 0, 0, w, h)
      for (const q of [0.7, 0.6, 0.5, 0.4]) {
        let data = canvas.toDataURL('image/webp', q)
        if (!data.startsWith('data:image/webp')) data = canvas.toDataURL('image/jpeg', q)
        best = data
        if (Math.round(((data.length - data.indexOf(',') - 1) * 3) / 4) <= maxBytes) return data
      }
      w = Math.round(w * 0.8)
    }
    return best
  } finally {
    URL.revokeObjectURL(url)
  }
}

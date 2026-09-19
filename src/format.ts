/** Normaliza separadores "//" a " · " en etiquetas de nivel ("Pro // $699 MXN/mes" → "Pro · $699 MXN/mes"). */
export const formatTier = (tier: string) => tier.replace(/\s*\/\/\s*/g, ' · ').trim();

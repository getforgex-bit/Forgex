/** Un estado de la materia a lo largo del scroll. Las 72 piezas del canvas nunca cambian; solo su forma. */
export interface ScrollyPhase {
  id: string;
  title: string;
  description: string;
  progressStart: number;
  progressEnd: number;
}

/** Respuesta de /api/diagnose: el nivel con el que conviene empezar. */
export interface PlanRecommendation {
  recommendedPlan: string;
  reason: string;
  firstStep: string;
}

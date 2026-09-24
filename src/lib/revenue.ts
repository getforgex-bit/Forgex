// "Haz la cuenta": cuántas visitas extra al mes cubren un plan, con los números que pone el dueño.
// Es aritmética sobre sus datos, no una proyección de resultados de ForgeX.

export const WEEKS_PER_MONTH = 52 / 12;

export interface RevenueInputs {
  /** Ticket promedio por visita, en MXN */
  ticket: number;
  /** Clientes atendidos por semana */
  weeklyClients: number;
  /** Porcentaje de cada venta que queda como ganancia (0-100) */
  marginPct: number;
  /** Porcentaje de clientes del mes que regresan una vez más (escenario que elige el dueño, 0-100) */
  returnPct: number;
}

export interface RevenueResult {
  monthlyClients: number;
  extraVisits: number;
  extraSales: number;
  extraProfit: number;
  /** Ganancia que deja cada visita */
  profitPerVisit: number;
}

const clamp = (n: number, min: number, max: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);

export function computeRevenue(inputs: RevenueInputs): RevenueResult {
  const ticket = clamp(inputs.ticket, 0, 1_000_000);
  const weekly = clamp(inputs.weeklyClients, 0, 1_000_000);
  const margin = clamp(inputs.marginPct, 0, 100) / 100;
  const ret = clamp(inputs.returnPct, 0, 100) / 100;

  const monthlyClients = Math.round(weekly * WEEKS_PER_MONTH);
  const extraVisits = Math.round(monthlyClients * ret);
  const profitPerVisit = ticket * margin;
  return {
    monthlyClients,
    extraVisits,
    extraSales: extraVisits * ticket,
    extraProfit: extraVisits * profitPerVisit,
    profitPerVisit,
  };
}

/** Visitas extra al mes cuya ganancia cubre el precio mensual. null si cada visita no deja ganancia. */
export function breakEvenVisits(monthlyPrice: number, profitPerVisit: number): number | null {
  if (!(profitPerVisit > 0)) return null;
  return Math.ceil(monthlyPrice / profitPerVisit);
}

export const formatMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Math.round(n));

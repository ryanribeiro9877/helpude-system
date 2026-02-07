export const ACTION_COSTS: Record<string, number> = {
  ia_call: 0.35,
  whatsapp: 0.08,
  rcs: 0.12,
  sms: 0.06,
  email: 0.02,
  link_generation: 0.01,
};

export function getActionCost(action: string): number {
  return ACTION_COSTS[action] ?? 0;
}

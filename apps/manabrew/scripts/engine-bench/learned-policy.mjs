export const FEATURE_NAMES = Object.freeze([
  "land", "creature", "instant", "sorcery", "artifact", "enchantment",
  "planeswalker", "commander", "graveyard", "cmc", "power", "toughness",
  "draw", "ramp", "removal", "token", "haste", "evasive",
  "land_urgency", "castable_curve", "expensive_early", "life_gain",
]);

const cap = (n, max) => Math.max(0, Math.min(max, Number(n) || 0));

export function castChoices(prompt, view) {
  if (prompt?.input?.type !== "chooseAction" || !Array.isArray(view?.zones)) return [];
  const actions = (prompt.input.actions ?? []).filter(
    (action) => action?.type === "cast" && typeof action.id === "string",
  );
  if (actions.length < 2) return [];

  const cards = new Map();
  const self = prompt.decidingPlayerId;
  let lands = 0;
  for (const zone of view.zones) {
    for (const card of zone.cards ?? []) {
      if (!card?.id || !card.identity?.name) continue;
      cards.set(card.id, { card, zone: zone.zone });
      if (zone.zone === "battlefield" && card.controllerId === self &&
          card.types?.includes("Land")) lands++;
    }
  }

  return actions.flatMap((action) => {
    const found = cards.get(action.cardId);
    if (!found) return [];
    const { card, zone } = found;
    const types = card.types ?? [];
    const is = (type) => types.includes(type);
    const lower = String(card.text ?? "").toLowerCase();
    const cmc = cap(card.cmc, 16);
    const land = Number(is("Land") || action.label?.startsWith("Play "));
    const enough = cmc <= lands;
    const features = [
      land, Number(is("Creature")), Number(is("Instant")), Number(is("Sorcery")),
      Number(is("Artifact")), Number(is("Enchantment")), Number(is("Planeswalker")),
      Number(zone === "command"), Number(zone === "graveyard"), cmc / 8,
      cap(card.power, 15) / 10, cap(card.toughness, 15) / 10,
      Number(/draw (?:a |two |three |\d+ )?cards?/.test(lower)),
      Number(/add \{|search your library for a (?:basic |land)|create a treasure/.test(lower)),
      Number(/destroy target|exile target|deals? \d+ damage|counter target/.test(lower)),
      Number(/create .*token/.test(lower)),
      Number(/haste/.test(lower)),
      Number(/flying|trample|unblockable|can't be blocked/.test(lower)),
      land * cap(4 - lands, 4) / 4,
      Number(!land && enough),
      Number(!land && !enough),
      Number(/gain \d+ life|lifelink/.test(lower)),
    ];
    return [{ id: action.id, cardId: action.cardId, label: action.label ?? "", features }];
  });
}

export function scoreCastChoices(choices, model) {
  if (model?.schemaVersion !== 1 ||
      JSON.stringify(model.features) !== JSON.stringify(FEATURE_NAMES) ||
      !Array.isArray(model.weights) ||
      model.weights.length !== FEATURE_NAMES.length ||
      !model.weights.every(Number.isFinite) ||
      choices.length < 2) return null;
  let best = null;
  for (const choice of choices) {
    if (choice.features.length !== model.weights.length ||
        !choice.features.every(Number.isFinite)) return null;
    const score = choice.features.reduce(
      (sum, value, index) => sum + value * model.weights[index], 0,
    );
    if (!best || score > best.score) best = { id: choice.id, score };
  }
  return best;
}
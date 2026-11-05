import { castChoices } from "./learned-policy.mjs";

export const TEACHER_PREFIX = "[forge-teacher] ";

// Forge's internal AI does not run through the ordinary external-prompt
// responder. Consume only explicit labelled teacher samples. The Java side
// records a viewer-filtered state before the AI selects a spell/land.
export function parseForgeTeacherEvent(event, payload) {
  if (event !== "forge:log" || typeof payload?.text !== "string" ||
      !payload.text.startsWith(TEACHER_PREFIX)) return null;
  let sample;
  try {
    sample = JSON.parse(payload.text.slice(TEACHER_PREFIX.length));
  } catch {
    return { error: "malformed_json" };
  }
  if (sample?.teacher !== "forge-ai" ||
      sample?.prompt?.decidingPlayerId !== `player-${sample.seat}` ||
      sample?.decision?.type !== "act" ||
      typeof sample?.decision?.actionId !== "string") {
    return { error: "invalid_teacher_sample" };
  }
  const choices = castChoices(sample.prompt, sample.view);
  if (choices.length < 2 ||
      !choices.some((choice) => choice.id === sample.decision.actionId)) {
    return { error: "no_visible_teacher_choice" };
  }
  // The learner consumes only prompt, viewer-filtered view and the chosen
  // offered action. Do not propagate any arbitrary extra engine fields.
  return {
    sample: {
      teacher: "forge-ai",
      seat: sample.seat,
      prompt: sample.prompt,
      view: sample.view,
      decision: sample.decision,
    },
  };
}

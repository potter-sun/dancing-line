import { getSignatureForUpdateLevel } from "./auth"


export const testToGetUpdatePayload = () => {
  const payload  = getSignatureForUpdateLevel({
    level_index: 0,
    level_user_score: 602,
    level_user_completed_progress: 100,
  })

  return payload
}
export type GuideText = { en: string; ar: string }
export type GuideStep = {
  id: string
  title: GuideText
  summary: GuideText
  instructions: GuideText[]
  note?: GuideText
}
export type GuideRecording = {
  id: string
  title: GuideText
  description: GuideText
  gif: string
  poster: string
}
export type FeatureGuide = {
  slug: string
  navigationKey: string
  title: GuideText
  summary: GuideText
  introduction: GuideText
  icon: string
  startRoute: string
  actionLabel: GuideText
  prerequisites: GuideText[]
  steps: GuideStep[]
  afterSetup: { title: GuideText; description: GuideText }[]
  questions: { question: GuideText; answer: GuideText }[]
  recordings: GuideRecording[]
}
export const guideText = (en: string, ar: string): GuideText => ({ en, ar })

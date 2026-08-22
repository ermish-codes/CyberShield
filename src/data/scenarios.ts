export interface Choice {
  type: 'best' | 'risky' | 'bad'
  threatDelta: number
  text: string
  feedback: string
  insight: string
}

export interface SpeakerLine {
  speaker: 'Kian' | 'Zara' | 'NOVA' | 'Ammi' | 'Sana' | string
  text: string
}

export interface Scene {
  id: string
  tag: string
  title: string
  notificationFeed?: string[]
  dialogue: SpeakerLine[]
  choices: Choice[]
}

export interface PlaybookStep {
  title: string
  description: string
}

export interface PreventionTip {
  title: string
  description: string
}

export interface Debrief {
  heading: string
  subtext: string
  playbook: PlaybookStep[]
  prevention: PreventionTip[]
}

export interface CaseFile {
  id: string
  title: string
  description: string
  scenes: Scene[]
  badgeLogic: {
    elite: number
    shield: number
  }
  debrief: Debrief
}

export const caseFiles: CaseFile[] = []

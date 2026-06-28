export type TimelineEra = 'Past' | 'Present' | 'Future'

export interface Timeline {
  id: string
  title: string
  era: TimelineEra
  setting: string
  status: 'active' | 'locked'
}

export const timelines: Timeline[] = [
  { id: 'heart-of-osiris', title: 'The Heart of Osiris', era: 'Past', setting: 'Egyptian Civilization · 1323 BC', status: 'locked' },
  { id: 'age-of-embers', title: 'Age of Embers', era: 'Past', setting: 'Lost Era', status: 'locked' },
  { id: 'echoes-of-the-artifact', title: 'Echoes of the Artifact', era: 'Past', setting: 'Westeros', status: 'locked' },
  { id: 'midnight-carnival', title: 'Midnight Carnival', era: 'Present', setting: 'Abandoned Carnival · 1888', status: 'locked' },
  { id: 'project-heisenberg', title: 'Project Heisenberg', era: 'Present', setting: 'Albuquerque', status: 'locked' },
  { id: 'protocol-zero', title: 'Protocol Zero', era: 'Present', setting: 'Near Future', status: 'locked' },
  { id: 'operation-deadlight', title: 'Operation Deadlight', era: 'Future', setting: 'Site Kennedy · 1996', status: 'active' },
  { id: 'the-card-cabinets', title: 'The Card Cabinets', era: 'Future', setting: 'Shibuya', status: 'locked' },
  { id: 'final-stage', title: 'Final Stage', era: 'Future', setting: 'Convergence', status: 'locked' },
]

export const aetherionStorageKey = 'aetherion-recovered-timelines'

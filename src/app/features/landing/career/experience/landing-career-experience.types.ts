export type MMMYYYY = `${
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec'} ${`19${number}${number}` | `20${number}${number}`}`;

export interface LandingCareerExperienceInput {
  company: string
  companyLogoImg: string
  position: string
  description?: string
  summary?: string
  from: MMMYYYY
  to: MMMYYYY | "Present"
  skills?: string[]
  highlights?: string
}
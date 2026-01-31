const monthToIndex = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
} as const;

type Month = keyof typeof monthToIndex

type Year =
  | `19${number}${number}`
  | `20${number}${number}`;

export type MMMYYYY = `${Month} ${Year}}`;


/**
 * Convert a `MMMYYYY` datestring to a Date() object.
 *
 * @export
 * @param {MMMYYYY} datestring
 * @returns {Date}
 */
export function mmmYYYYToDate(datestring: MMMYYYY): Date {
  const [month, yearStr] = datestring.split(' ') as [Month, Year];

  const monthIndex = monthToIndex[month];
  const year = Number(yearStr);

  return new Date(year, monthIndex);
}

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
  aboutURL?: string
}
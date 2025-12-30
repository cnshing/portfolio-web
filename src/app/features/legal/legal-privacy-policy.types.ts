/**
 * Year of `YYYY-MM-DD`.
 *
 * @typedef {YYYY}
 */
type YYYY = `19${number}` | `20${number}`
/**
 * Month of `YYYY-MM-DD`.
 *
 * @typedef {MM}
 */
type MM = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`
/**
 * Days of `YYYY-MM-DD`.
 *
 * @typedef {DD}
 */
type DD = `${0}${number}` | `${1 | 2}${number}` | `3${0 | 1}`

/**
 * `YYYY-MM-DD` string format
 *
 * @export
 * @typedef {YYYYMMDD}
 */
export type YYYYMMDD = `${YYYY}-${MM}-${DD}`

/**
 *
 * Object containing relevant information of the privacy policy.
 * @export
 * @interface LegalPrivacyPolicyContent
 * @typedef {LegalPrivacyPolicyContent}
 */
export interface LegalPrivacyPolicyContent {
  /**
   * When the privacy policy was last updated.
   *
   * @type {YYYYMMDD}
   */
  lastUpdated: YYYYMMDD
  /**
   * Raw markdown string of the privacy policy.
   *
   * @type {string}
   */
  content: string;
}
import { forwardRef, Signal, Type } from "@angular/core";
import { Remote } from "comlink";

/**
 * Using any of the Three.JS directives requires you to extend this class and implement the following properties.
 *
 * @export
 * @abstract
 * @class ThreeJSComponent
 * @typedef {ThreeJSComponent}
 * @template R The underlying worker class.
 */
export abstract class ThreeJSComponent<R> {
  /**
   * There must be a signal allowing access to the Worker object.
   *
   * @abstract
   * @type {(Signal<Remote<R> | undefined>)}
   */
  abstract threeWorker: Signal<Remote<R> | undefined>;
  /**
   * If your worker has a 'stars' settable function, then placing 'stars' in this list will ensure every time your component 'stars' binding changes, an update is sent to the worker automatically, with the signal binding Three.js worker directive.
   *
   * @abstract
   * @type {?string[]}
   */
  abstract threeBindings?: string[];
  // https://stackoverflow.com/questions/46014761/how-to-access-host-component-from-directive
}

/**
 *
 * Required component provider to use any of the Three.JS directives.
 * @export
 * @template T
 * @param {Type<T>} cls The name of your class
 * @returns {{ provide: typeof ThreeJSComponent; useExisting: any; }}
 */
export function provideThreeJSDirective<T>(cls: Type<T>) {
  return { provide: ThreeJSComponent, useExisting: forwardRef(() => cls) };
}
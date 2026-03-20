import { DestroyRef, Directive, effect, ElementRef, inject, input } from "@angular/core";
import { ThreeJSComponent } from "@shared/directives/three/core.directive";
import { Remote } from "comlink";

/**
 * Converts 'pointermove' -> 'onPointermove', for example.
 *
 * @template {string} E
 * @param {E} event Any event name as a string.
 * @returns {`on${Capitalize<E>}`}
 */
function toWorkerMethod<E extends string>(event: E) {
  return (
    'on' + event.charAt(0).toUpperCase() + event.slice(1)
  ) as `on${Capitalize<E>}`;
}

/**
 * Represents a full DOM Event.
 */
type DOMEvent<E extends string> =
  E extends keyof HTMLElementEventMap
    ? HTMLElementEventMap[E]
    : Event;

/**
 * An emitted event.
 */
export type EventSignature<E extends string> =
  (event?: DOMEvent<E>) => Promise<void> | void;

/**
 *
 */
export type WorkerEventSignature<E extends string> =
  (event?: Partial<DOMEvent<E>>) => Promise<void> | void;
/**
 * Maps, for example, an event type `pointermove` -> the function event signature of `onPointerMove`
 */
export type WorkerEvents<E extends string> = {
  [K in E as `on${Capitalize<K>}`]: WorkerEventSignature<K>;
};

/**
 * Reduces the full DOM event into a smaller subset of itself
 *
 */
export type EventPreprocessor<E extends string> =
  (event: DOMEvent<E>) => Partial<DOMEvent<E>>


/**
 * An record of various event type keys whose values reduce a DOMEvent to it's partial
 *
 * @export
 * @typedef {EventPreprocessors}
 * @template {string} E
 */
export type EventPreprocessors<E extends string> = {
    [K in E]?: EventPreprocessor<K>;
  };



/**
 * This directive is responsible for proxying any arbitrary event into the worker, provided the worker has support for it. Should only be used as a helper for other proxy offscreen directives.
 *
 * @export
 * @class EventProxyDirective
 * @typedef {EventProxyDirective}
 * @template {string} [E=string]
 */
@Directive({
  selector: '[proxy-events-to-offscreen]',
  standalone: true,
})
export class EventProxyDirective<E extends string = string> {


  /**
   * The events to proxy. Like "pointermove", etc.
   *
   * @type {*}
   */
  events = input<readonly E[]>([]);


  /**
   * For each event E, a corresponding function is optionally supplied to process event before sending it over to the worker.
   *
   * @type {*}
   */
  preprocessors = input<EventPreprocessors<E>>({});


  /**
   * Event options for addEventListener
   *
   * @type {*}
   */
  eventOptions = input<Partial<Record<E, AddEventListenerOptions | boolean>>>({});


  private host = inject(ThreeJSComponent) as ThreeJSComponent<WorkerEvents<E>>;
  private element = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);


  /**
   * Contains all active even listeners.
   *
   * @private
   * @type {(() => void)[]}
   */
  private listeners: (() => void)[] = [];


  /**
   * Creates an instance of EventProxyDirective.
   *
   * @constructor
   */
  constructor() {

    effect(() => {

      const worker = this.host.threeWorker();
      const events = this.events();
      const options = this.eventOptions();
      const preprocessors = this.preprocessors()

      if (!worker || !events) return;
      this.attach(worker, events, options, preprocessors);

    });

    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }


  /**
   * Attachs all event listeners to `worker`.
   *
   * @private
   * @param {Remote<WorkerEvents<E>>} worker A worker, for any event name 'eventname' has a corresponding worker function 'onEventname'
   * @param {readonly E[]} events A list of event types
   * @param {Partial<Record<E, AddEventListenerOptions | boolean>>} options Event options for addEventListener
   * @param {EventPreprocessors<E>} preprocessors Run this function on the event before sending it to the worker.
   */
  private attach(
    worker: Remote<WorkerEvents<E>>,
    events: readonly E[],
    options: Partial<Record<E, AddEventListenerOptions | boolean>>,
    preprocessors: EventPreprocessors<E>,
  ) {

    this.cleanup();

    const el = this.element.nativeElement;
    for (const eventName of events) {
      if (!eventName) continue;
      const method = toWorkerMethod(eventName);

      const handler = async (event?: Event) => {

        const fn =
          worker[method as keyof typeof worker] as WorkerEventSignature<E>;
        const process =
          preprocessors[eventName] ??
          ((event: DOMEvent<E>) => event);
        if (!fn) return;
        await fn(process(event as DOMEvent<E>));
      };

      const opts = options?.[eventName];

      el.addEventListener(
        eventName,
        handler as EventListener,
        opts,
      );

      this.listeners.push(() => {
        el.removeEventListener(
          eventName,
          handler as EventListener,
          opts,
        );
      });
    }
  }


  /**
   * Removes the event listener.
   *
   * @private
   */
  private cleanup() {
    for (const off of this.listeners) off();
    this.listeners = [];
  }
}

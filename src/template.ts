import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** Plain JavaScript identifier: "r", "data", "$value", "_item". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const REGEXP_OPTIONS = ["escape", "evaluate", "interpolate"] as const;

/**
 * Rejects template input that must not reach `_.template`.
 * The template must be a string. Options, when supplied, must be a plain
 * object whose `variable` is a plain identifier. An `imports` option and
 * values of the wrong type are rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template passed into `_.template`");
  }
  if (options === undefined) {
    return;
  }
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("Invalid options passed into `_.template`");
  }
  const prototype = Object.getPrototypeOf(options);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError("Invalid options passed into `_.template`");
  }

  const opts = options as Record<string, unknown>;

  if (opts.imports !== undefined) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }

  if (opts.variable !== undefined) {
    if (typeof opts.variable !== "string" || !PLAIN_IDENTIFIER.test(opts.variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }

  for (const key of REGEXP_OPTIONS) {
    const value = opts[key];
    if (value != null && !(value instanceof RegExp)) {
      throw new TypeError(`Invalid \`${key}\` option passed into \`_.template\``);
    }
  }

  if (opts.sourceURL !== undefined && typeof opts.sourceURL !== "string") {
    throw new TypeError("Invalid `sourceURL` option passed into `_.template`");
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Caller options are validated first. A `variable` option must be a plain
 * JavaScript identifier (for example "r" or "data"). The `imports` option
 * is not accepted.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

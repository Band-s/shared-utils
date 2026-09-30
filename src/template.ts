import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const REGEXP_OPTION_KEYS = ["escape", "evaluate", "interpolate"] as const;

/**
 * Rejects template text and options that must not reach `_.template`.
 * `variable` must be a plain JavaScript identifier. `imports` is rejected.
 * Wrong input types are rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template string passed into `_.template`");
  }
  if (options === undefined) {
    return;
  }
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("Invalid options passed into `_.template`");
  }
  const proto = Object.getPrototypeOf(options);
  if (proto !== Object.prototype && proto !== null) {
    throw new TypeError("Invalid options passed into `_.template`");
  }

  const opts = options as Record<string, unknown>;

  if (Object.prototype.hasOwnProperty.call(opts, "imports") && opts.imports !== undefined) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }

  if (Object.prototype.hasOwnProperty.call(opts, "variable") && opts.variable != null) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }

  for (const key of REGEXP_OPTION_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(opts, key) || opts[key] == null) {
      continue;
    }
    if (!(opts[key] instanceof RegExp)) {
      throw new TypeError(`Invalid \`${key}\` option passed into \`_.template\``);
    }
  }

  if (Object.prototype.hasOwnProperty.call(opts, "sourceURL") && opts.sourceURL != null) {
    if (typeof opts.sourceURL !== "string") {
      throw new TypeError("Invalid `sourceURL` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Callers may pass safe lodash template options (custom delimiters and a
 * `variable` that is a plain JavaScript identifier).
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

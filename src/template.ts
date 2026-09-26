import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not reach `_.template`.
 * A `variable` option must be a plain JavaScript identifier.
 * An `imports` option is always rejected. Wrong input types are rejected.
 */
export function validateTemplateInput(tpl: unknown, data: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Template must be a string");
  }
  if (data === null || typeof data !== "object") {
    throw new TypeError("Template data must be an object");
  }
  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Template options must be a plain object");
  }

  const opts = options as Record<string, unknown>;
  if ("imports" in opts) {
    throw new Error("Invalid `imports` option passed into template");
  }
  if ("variable" in opts && opts.variable != null) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
  for (const key of ["escape", "evaluate", "interpolate"] as const) {
    if (key in opts && opts[key] != null && !(opts[key] instanceof RegExp)) {
      throw new TypeError(`Invalid \`${key}\` option passed into template`);
    }
  }
  if ("sourceURL" in opts && opts.sourceURL != null && typeof opts.sourceURL !== "string") {
    throw new TypeError("Invalid `sourceURL` option passed into template");
  }
}

/**
 * Renders a lodash template with the given data.
 * `options.variable`, when set, must be a plain JavaScript identifier.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, data, options);
  return _.template(tpl, options)(data);
}

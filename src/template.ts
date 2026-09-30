import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** Plain JavaScript identifier: `r`, `data`, `$item`, `_value`. */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not reach `_.template`.
 *
 * A `variable` option is accepted only when it is a plain JavaScript identifier.
 * An `imports` option, a non-identifier `variable`, and wrong input types are rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Template source must be a string");
  }
  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Template options must be a plain object");
  }
  const proto = Object.getPrototypeOf(options);
  if (proto !== Object.prototype && proto !== null) {
    throw new TypeError("Template options must be a plain object");
  }

  const opts = options as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(opts, "imports")) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }
  if (Object.prototype.hasOwnProperty.call(opts, "variable")) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Caller options are checked by {@link validateTemplateInput} before compilation.
 * Safe `variable` names (plain identifiers) and custom delimiters are preserved.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

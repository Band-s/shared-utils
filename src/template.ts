import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** A plain JavaScript identifier, safe to use as a template `variable` name. */
const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not reach `_.template`.
 * Allows a `variable` option only when it is a plain identifier.
 * Rejects an `imports` option and values of the wrong type.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Template must be a string");
  }
  if (options === undefined) {
    return;
  }
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("Template options must be a plain object");
  }
  if (Object.prototype.hasOwnProperty.call(options, "imports")) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }
  if (Object.prototype.hasOwnProperty.call(options, "variable")) {
    const variable = (options as { variable?: unknown }).variable;
    if (typeof variable !== "string" || !IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
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

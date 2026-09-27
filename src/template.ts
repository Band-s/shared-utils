import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** A plain JavaScript identifier, such as "r" or "data". */
const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not reach `_.template`: a non-string
 * template, options of the wrong type, an `imports` option, or a `variable`
 * that is not a plain JavaScript identifier.
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

  const opts = options as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(opts, "imports")) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }
  if (Object.prototype.hasOwnProperty.call(opts, "variable")) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Safe caller options are passed through, including custom delimiters and a
 * `variable` that is a plain JavaScript identifier.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

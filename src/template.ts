import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** A plain JavaScript identifier, such as "r" or "data". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not reach `_.template`.
 * The template must be a string. Options, when present, must be an object.
 * A `variable` option must be a plain JavaScript identifier.
 * An `imports` option is always rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Template must be a string");
  }
  if (options == null) {
    return;
  }
  if (typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Template options must be an object");
  }

  const opts = options as Record<string, unknown>;

  if (Object.hasOwn(opts, "imports")) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }

  if (Object.hasOwn(opts, "variable") && opts.variable !== undefined) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
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

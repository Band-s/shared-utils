import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** A plain JavaScript binding identifier, such as "r" or "data". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not be compiled by `_.template`.
 * A `variable` option must be a plain identifier. An `imports` option and
 * values of the wrong type are rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template string");
  }
  if (options == null) {
    return;
  }
  if (typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Invalid template options");
  }
  const opts = options as Record<string, unknown>;
  if ("imports" in opts) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }
  if ("variable" in opts) {
    const variable = opts.variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 * Safe caller options (including a plain `variable` identifier) are preserved.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

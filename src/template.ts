import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input before it can reach `_.template`.
 * A `variable` option must be a plain JavaScript identifier. An `imports`
 * option, a non-identifier `variable`, and wrong input types are rejected.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template input");
  }
  if (options === undefined) {
    return;
  }
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("Invalid template options");
  }
  if (Object.hasOwn(options, "imports")) {
    throw new Error("Invalid template options");
  }
  if (Object.hasOwn(options, "variable")) {
    const variable = (options as { variable?: unknown }).variable;
    if (typeof variable !== "string" || !PLAIN_IDENTIFIER.test(variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Callers may pass safe lodash template options (custom delimiters and a
 * plain-identifier `variable`). Unsafe input is rejected before compile.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

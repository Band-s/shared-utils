import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not be compiled.
 * The template must be a string. Options, when supplied, must be an object.
 * `variable` must be a plain JavaScript identifier. `imports` is not allowed.
 */
export function validateTemplate(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Template must be a string");
  }
  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Template options must be an object");
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
 * Safe caller options still apply (custom delimiters, a plain `variable`
 * identifier). Unsafe input is rejected before compilation.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplate(tpl, options);
  return _.template(tpl, options)(data);
}

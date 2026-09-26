import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** A plain JavaScript identifier, e.g. "r" or "data". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Validates template source and options before they reach `_.template`.
 * Rejects a non-string source, a non-object options bag, any `imports`
 * option, and a `variable` that is not a plain JavaScript identifier.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template source passed into `_.template`");
  }
  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Invalid options passed into `_.template`");
  }

  const opts = options as Record<string, unknown>;

  if (opts.imports !== undefined) {
    throw new TypeError("Invalid `imports` option passed into `_.template`");
  }

  if (opts.variable !== undefined) {
    if (typeof opts.variable !== "string" || !PLAIN_IDENTIFIER.test(opts.variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 *
 * Callers may pass safe lodash template options (custom delimiters and a
 * plain-identifier `variable`). Unsafe `variable` values and `imports`
 * are rejected before compilation.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

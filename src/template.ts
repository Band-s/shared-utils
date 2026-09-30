import _ from "lodash";

export type RenderOptions = Omit<_.TemplateOptions, "imports">;

/** A plain JavaScript identifier: "r", "data", "_value". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template source and options that must not reach `_.template`.
 * `variable` must be a plain JavaScript identifier when present. An
 * `imports` option, a non-string template, and non-object options are rejected.
 */
export function validateTemplate(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template passed into `_.template`");
  }
  if (options === undefined) {
    return;
  }
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new TypeError("Invalid options passed into `_.template`");
  }

  const opts = options as Record<string, unknown>;
  if (opts.imports !== undefined) {
    throw new Error("Invalid `imports` option passed into `_.template`");
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
 * plain-identifier `variable`). Unsafe values are rejected before compilation.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplate(tpl, options);
  return _.template(tpl, options)(data);
}

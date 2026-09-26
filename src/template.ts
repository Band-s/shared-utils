import _ from "lodash";

export type RenderOptions = Omit<_.TemplateOptions, "imports">;

/** Plain JavaScript identifier, e.g. `r` or `data`. */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Rejects template input that must not be compiled.
 * The template must be a string. Options, when supplied, must be a plain
 * object: `variable` must be a plain identifier, `imports` is forbidden,
 * and known option fields must have the right type.
 */
export function validateTemplateInput(tpl: unknown, options?: unknown): void {
  if (typeof tpl !== "string") {
    throw new TypeError("Invalid template");
  }
  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
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

  for (const key of ["escape", "evaluate", "interpolate"] as const) {
    const value = opts[key];
    if (value !== undefined && !(value instanceof RegExp)) {
      throw new TypeError(`Invalid \`${key}\` option passed into \`_.template\``);
    }
  }

  if (opts.sourceURL !== undefined && typeof opts.sourceURL !== "string") {
    throw new TypeError("Invalid `sourceURL` option passed into `_.template`");
  }
}

/** Renders a lodash template with the given data. */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}

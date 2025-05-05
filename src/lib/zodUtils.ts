import { z } from "zod"

export const zParsedNumber = (
  msg: string,
  opts?: { min?: number; max?: number }
) => {
  let schema = z.number({ required_error: msg })
  if (opts?.min !== undefined)
    schema = schema.min(opts.min, {
      message: `Must be no less than ${opts.min.toString()}`,
    })
  if (opts?.max !== undefined)
    schema = schema.max(opts.max, {
      message: `Must be no more than ${opts.max.toString()}`,
    })
  return z.preprocess((val) => {
    const parsed = parseInt(val as string, 10)
    return isNaN(parsed) ? undefined : parsed
  }, schema)
}

// Small console wrapper: debug output only in dev builds, warnings and errors always.
const dev = import.meta.env.DEV;
export const logger = {
  debug: (...args: unknown[]) => { if (dev) console.debug(...args); },
  info: (...args: unknown[]) => { if (dev) console.info(...args); },
  log: (...args: unknown[]) => { if (dev) console.log(...args); },
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};
export default logger;

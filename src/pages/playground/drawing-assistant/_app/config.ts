export const appName = "drawing-assistant";

const pathname = globalThis.location.pathname;
export const isAppEnabled = pathname.includes(appName);

if (process.env.NODE_ENV === "development") {
  console.debug(`[config] ${appName}`, { isAppEnabled, pathname });
}

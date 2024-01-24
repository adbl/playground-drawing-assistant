export const timeout = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export function assert(value: unknown, message: string): asserts value {
  if (value) {
    return;
  }

  throw new Error(message);
}

export const sha1Hash = async (data: unknown) => {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(JSON.stringify(data))
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

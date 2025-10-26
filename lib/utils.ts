// Local lightweight replacement for 'tailwind-merge' to avoid an external dependency
// This simple implementation normalizes whitespace and removes duplicate classes while
// preserving the last occurrence of a class (sufficient for basic merging needs).
function twMerge(input: string) {
  const parts = input.split(/\s+/).filter(Boolean)
  const seen = new Set<string>()
  const result: string[] = []
  for (let i = parts.length - 1; i >= 0; i--) {
    const cls = parts[i]
    if (!seen.has(cls)) {
      seen.add(cls)
      result.unshift(cls)
    }
  }
  return result.join(" ")
}

// lightweight local implementation of clsx to avoid depending on the external package
function clsx(...inputs: any[]) {
  return inputs
    .flatMap(i => (Array.isArray(i) ? i : [i]))
    .filter(Boolean)
    .join(" ")
}

export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

const IN_BROWSER = typeof window !== 'undefined'
export function getMatchMedia () {
    if (!IN_BROWSER) return
  
    return window.matchMedia('(prefers-color-scheme: dark)')
}
export {
    IN_BROWSER,
}


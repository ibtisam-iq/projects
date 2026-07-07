import { useEffect, useRef, useState } from "react"

export const useInView = <T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true
    }
    return false
  })

  const threshold = options?.threshold ?? 0.1
  const root = options?.root
  const rootMargin = options?.rootMargin

  useEffect(() => {
    if (inView) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, threshold, root, rootMargin])

  return { ref, inView }
}

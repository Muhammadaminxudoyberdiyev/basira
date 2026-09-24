"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

// Maxsus kursor: tez nuqta + orqadan keladigan halqa. Havolalar
// ustida halqa kattalashadi. Faqat sichqonchali qurilmalarda
// (pointer: fine) va reduced-motion o'chiq bo'lganda ishlaydi.
export function Cursor() {
  const reduceMotion = useReducedMotion()
  // Mount bo'lgandan keyingina render — server (null) va gidratsiya
  // (null) bir xil bo'ladi, aks holda hydration mismatch chiqadi.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  // Faqat sichqonchali qurilmalarda — SSR'da false, gidratsiyada to'g'ri.
  const fine = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(pointer: fine)")
      mq.addEventListener("change", cb)
      return () => mq.removeEventListener("change", cb)
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  )
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 26 })
  const ringY = useSpring(y, { stiffness: 260, damping: 26 })

  useEffect(() => {
    if (!fine) return

    const move = (e: globalThis.MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as HTMLElement | null
      setHovering(!!t?.closest("a, button, [data-cursor]"))
    }
    const leave = () => setVisible(false)
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener("mousemove", move, { passive: true })
    document.documentElement.addEventListener("mouseleave", leave)
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)
    return () => {
      window.removeEventListener("mousemove", move)
      document.documentElement.removeEventListener("mouseleave", leave)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
    }
  }, [fine, x, y])

  if (!mounted || !fine || reduceMotion) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      {/* Nuqta — kursor uchida */}
      <motion.span
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="-mt-[3px] -ml-[3px] block size-1.5 rounded-full bg-white mix-blend-difference"
      />
      {/* Halqa — orqadan, hover'da kattalashadi, click'da puls */}
      <motion.span
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 2.4 : hovering ? 1.9 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="-mt-4 -ml-4 block size-8 rounded-full border border-white/70 mix-blend-difference"
      />
    </div>
  )
}

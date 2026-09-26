'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)

  function handleStart() {
    window.dispatchEvent(
      new CustomEvent('loader-dismissed')
    )

    const overlay = overlayRef.current
    if (!overlay) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const splitDuration = prefersReducedMotion ? 0.01 : isMobile ? 0.65 : 0.9

    overlay.style.pointerEvents = 'none'

    // Create split layers
    const top = document.createElement('div')
    top.className = styles.splitTop

    const bottom = document.createElement('div')
    bottom.className = styles.splitBottom

    // Center line
    const line = document.createElement('div')
    line.className = styles.centerLine

    document.body.appendChild(top)
    document.body.appendChild(bottom)
    document.body.appendChild(line)

    // Hide original overlay fast
    gsap.to(overlay, {
      opacity: 0,
      duration: prefersReducedMotion ? 0.01 : 0.18,
      ease: 'power2.out',
    })

    // Animate line
    gsap.fromTo(
      line,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: prefersReducedMotion ? 0.01 : 0.2,
        ease: 'power2.out',
      }
    )

    const splitTimeline = gsap.timeline({
      onComplete: () => {
        top.remove()
        bottom.remove()
        line.remove()
        window.dispatchEvent(new CustomEvent('loader-animation-done'))
        onDismiss()
      },
    })
    splitTimeline
      .to(top, { y: '-100%', duration: splitDuration, ease: 'power2.inOut', force3D: true }, 0)
      .to(bottom, { y: '100%', duration: splitDuration, ease: 'power2.inOut', force3D: true }, 0)

    // Fade line away
    gsap.to(line, {
      opacity: 0,
      duration: prefersReducedMotion ? 0.01 : 0.15,
      delay: prefersReducedMotion ? 0 : 0.15,
    })
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.liquidBg} aria-hidden />

      <button
        className={styles.startBtn}
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  )
}
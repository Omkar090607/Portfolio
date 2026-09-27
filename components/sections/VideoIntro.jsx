'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import { withBasePath } from '@/lib/siteConfig'
import styles from '@/styles/sections/VideoIntro.module.css'

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), { ssr: false })

function scrollNext() {
  window.dispatchEvent(new CustomEvent('navigate-to-index', { detail: 1 }))
}

export default function VideoIntro() {
  const bgImgRef   = useRef(null)
  const mainImgRef = useRef(null)
  const greetRef   = useRef(null)
  const nameRef    = useRef(null)
  const roleRef    = useRef(null)
  const scrollRef  = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMobile = () => setIsMobile(mediaQuery.matches)
    updateMobile()
    mediaQuery.addEventListener('change', updateMobile)
    return () => mediaQuery.removeEventListener('change', updateMobile)
  }, [])

  // Reveal the intro only after the Start transition, in name → photo → details order.
  useEffect(() => {
    const main = mainImgRef.current
    const bg   = bgImgRef.current
    if (!main || !bg) return

    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nameDuration = prefersReducedMotion ? 0.01 : isMobileViewport ? 0.65 : 0.9
    const imageDuration = prefersReducedMotion ? 0.01 : isMobileViewport ? 0.85 : 1.25
    const detailsDuration = prefersReducedMotion ? 0.01 : isMobileViewport ? 0.4 : 0.55

    gsap.set(nameRef.current, { autoAlpha: 0, x: -60 })
    gsap.set([greetRef.current, roleRef.current], { autoAlpha: 0, y: 20 })
    gsap.set(scrollRef.current, { autoAlpha: 0 })
    gsap.set([main, bg], { autoAlpha: 0 })
    gsap.set(main, { scale: prefersReducedMotion ? 1 : 1.08, transformOrigin: '50% 30%' })

    let kenBurnsTween
    const tl = gsap.timeline({ paused: true })
    tl.to(nameRef.current, { autoAlpha: 1, x: 0, duration: nameDuration, ease: 'power2.out' })
      .to([bg, main], { autoAlpha: 1, duration: imageDuration, ease: 'power2.out' }, `+=${prefersReducedMotion ? 0 : isMobileViewport ? 0.1 : 0.18}`)
      .call(() => {
        if (!prefersReducedMotion) {
          kenBurnsTween = gsap.to(main, {
            scale: 1,
            duration: isMobileViewport ? 9 : 14,
            ease: 'power1.out',
          })
        }
      }, [], '<')
      .to(greetRef.current, { autoAlpha: 1, y: 0, duration: detailsDuration, ease: 'power2.out' }, `-=${prefersReducedMotion ? 0 : 0.05}`)
      .to(roleRef.current, { autoAlpha: 1, y: 0, duration: prefersReducedMotion ? 0.01 : isMobileViewport ? 0.45 : 0.6, ease: 'power2.out' }, `-=${prefersReducedMotion ? 0 : 0.25}`)
      .to(scrollRef.current, { autoAlpha: 1, duration: prefersReducedMotion ? 0.01 : 0.5 }, `-=${prefersReducedMotion ? 0 : 0.1}`)

    function startIntro() {
      tl.play(0)
    }

    window.addEventListener('loader-animation-done', startIntro, { once: true })
    return () => {
      window.removeEventListener('loader-animation-done', startIntro)
      kenBurnsTween?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section className={styles.section}>

      {/* 1 - Blurred ambient background (static image, no video asset available) */}
      <Image
        ref={bgImgRef}
        src={withBasePath('/assets/intro.jpg')}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className={styles.bgVideo}
      />

      {/* 2 - Main image */}
      <Image
        ref={mainImgRef}
        src={withBasePath('/assets/intro.jpg')}
        alt={profile.name.full}
        fill
        priority
        sizes="100vw"
        className={styles.mainVideo}
      />

      {/* 3 - Cinematic gradient overlay */}
      <div className={styles.overlay} />

      {/* 4 - Three.js cinematic bokeh layer (desktop only) */}
      {!isMobile && <CinematicLayer />}

      {/* 5 - Landing text */}
      <div className={styles.heroContent}>
        <p ref={greetRef} className={styles.eyebrow}>{content.site.tagline}</p>
        <h1 ref={nameRef} className={styles.name}>
          {profile.name.first}<br />{profile.name.last}
        </h1>
        <p ref={roleRef} className={styles.role}>{profile.roles.detailed}</p>
      </div>

      {/* 6 - Scroll cue */}
      <button
        ref={scrollRef}
        className={styles.scrollCue}
        onClick={scrollNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>

    </section>
  )
}

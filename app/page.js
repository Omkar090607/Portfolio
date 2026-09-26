'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import ProjectsSection       from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import PublicationsFooterSection from '@/components/sections/PublicationsFooterSection'
import ScreenLoader from '@/components/sections/ScreenLoader'
import profile               from '@/data/profile.json'

// Snap: 0=video 1=hero 2=about 3..4=projects 5=work-exp 6=publications 7=footer (mobile: 6=publications 7=footer)
const PROJECT_SLIDES = profile.projects.length
const TOTAL          = 7 + PROJECT_SLIDES  // 9

export default function Home() {
  const mainRef        = useRef(null)
  const idxRef         = useRef(0)
  const busyRef        = useRef(false)
  const tweenRef       = useRef(null)
  const loopOverlayRef = useRef(null)
  const wheelGestureRef = useRef(false)
  const wheelTimerRef   = useRef(null)
  const touchScrollRef  = useRef(null)
  const pendingStepRef  = useRef(0)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    function motionDuration(desktop, mobile) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0.01
      return window.matchMedia('(max-width: 767px)').matches ? mobile : desktop
    }

    function finishTransition() {
      busyRef.current = false
      const pendingStep = pendingStepRef.current
      pendingStepRef.current = 0
      if (pendingStep) goTo(idxRef.current + pendingStep)
    }

    // Fade to black → instant scrollTop jump → fade in
    // Used whenever we loop footer → first section
    function fadeLoop(targetScrollTop, targetIdx) {
      busyRef.current = true
      tweenRef.current?.kill()
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: motionDuration(0.45, 0.32),
        ease: 'power2.inOut',
        onComplete: () => {
          el.scrollTop    = targetScrollTop
          idxRef.current  = targetIdx
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: motionDuration(0.55, 0.4),
            ease: 'power2.out',
            delay: motionDuration(0.05, 0.03),
            onComplete: finishTransition,
          })
        },
      })
    }

    function goTo(idx) {
      const direction = Math.sign(idx - idxRef.current)
      if (busyRef.current) {
        if (direction && !pendingStepRef.current) pendingStepRef.current = direction
        return
      }

      // Wrap-around
      if (idx >= TOTAL) idx = 0
      if (idx < 0)      idx = TOTAL - 1

      if (idx === idxRef.current) return

      // Footer → top: fade-cut instead of scrolling back through all sections
      if (idxRef.current === TOTAL - 1 && idx === 0) {
        fadeLoop(0, 0)
        return
      }

      // Top → footer: fade-cut instead of scrolling forward through all sections
      if (idxRef.current === 0 && idx === TOTAL - 1) {
        fadeLoop((TOTAL - 1) * window.innerHeight, TOTAL - 1)
        return
      }

      idxRef.current = idx
      busyRef.current = true
      tweenRef.current?.kill()
      tweenRef.current = gsap.to(el, {
        scrollTop: idx * window.innerHeight,
        duration: motionDuration(0.85, 0.65),
        ease: 'power2.inOut',
        onComplete: finishTransition,
      })
    }

    function onWheel(e) {
      e.preventDefault()
      clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => {
        wheelGestureRef.current = false
      }, 140)
      if (!e.deltaY || wheelGestureRef.current) return
      wheelGestureRef.current = true
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) {
      touchY = e.touches[0].clientY
      touchScrollRef.current = e.target.closest('[data-native-scroll]')
    }
    function onTouchMove(e) {
      if (!touchScrollRef.current) e.preventDefault()
    }
    function onTouchEnd(e) {
      const dy = touchY - e.changedTouches[0].clientY
      const scrollTarget = touchScrollRef.current
      touchScrollRef.current = null
      if (Math.abs(dy) < 40) return
      if (scrollTarget) {
        const canScroll = dy > 0
          ? scrollTarget.scrollTop + scrollTarget.clientHeight < scrollTarget.scrollHeight - 1
          : scrollTarget.scrollTop > 1
        if (canScroll) return
      }
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    function onScroll() {
      if (!busyRef.current) {
        idxRef.current = Math.round(el.scrollTop / window.innerHeight)
      }
    }

    function onNavigate(event) {
      const target = Number(event.detail)
      if (Number.isInteger(target)) goTo(target)
    }

    // Footer video ends → same fade-cut loop back to top
    function onFooterLoop() {
      if (busyRef.current) return
      fadeLoop(0, 0)
    }

    el.addEventListener('wheel',  onWheel,  { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true  })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    window.addEventListener('navigate-to-index', onNavigate)
    window.addEventListener('footer-loop-back', onFooterLoop)

    return () => {
      el.removeEventListener('wheel',  onWheel)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('navigate-to-index', onNavigate)
      window.removeEventListener('footer-loop-back', onFooterLoop)
      tweenRef.current?.kill()
      clearTimeout(wheelTimerRef.current)
      pendingStepRef.current = 0
    }
  }, [])

  return (
    <>
      {showLoader && (
        <ScreenLoader onDismiss={() => setShowLoader(false)} />
      )}

      {/* Full-screen fade overlay for seamless footer → top loop */}
      <div
        ref={loopOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll', overscrollBehavior: 'none' }}>
        <div>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <WorkExperienceSection />
          <PublicationsFooterSection />
        </div>
      </main>
    </>
  )
}

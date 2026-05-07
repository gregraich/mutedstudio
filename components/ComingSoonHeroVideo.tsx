'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** `#t=0.001` nudges iOS Safari to decode/show frame 0; omitting it often yields a stuck black tile. */
const HERO_MP4 = '/muted.mp4#t=0.001'

/**
 * Background hero video. Parent stack uses `pointer-events-none`; this subtree
 * MUST use `pointer-events-auto` or iOS never receives taps → stuck on native play UI.
 * `playGate` runs extra `play()` ticks after the intro overlay is gone.
 */
function armVideo(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.volume = 0
  video.playsInline = true
  video.loop = true
  video.controls = false
  video.removeAttribute('controls')
  video.disablePictureInPicture = true
  video.setAttribute('muted', '')
  video.setAttribute('loop', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('x5-playsinline', 'true')
  video.setAttribute('autoplay', '')
  video.preload = 'auto'
}

type ComingSoonHeroVideoProps = {
  playGate: boolean
}

export const ComingSoonHeroVideo = memo(function ComingSoonHeroVideo({ playGate }: ComingSoonHeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)

  const attemptPlay = useCallback(() => {
    const video = ref.current
    if (!video) return
    armVideo(video)
    void video.play().catch(() => {
      /* policy / Low Power */
    })
  }, [])

  /** iOS: muted / playsinline must be applied before the first decode tick. */
  useLayoutEffect(() => {
    const video = ref.current
    if (video) armVideo(video)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video) return

    let cancelled = false

    const raiseReady = () => {
      if (cancelled || readyOnce.current) return
      readyOnce.current = true
      setReady(true)
      setFailed(false)
    }

    armVideo(video)

    const onLoadedMetadata = () => {
      if (cancelled) return
      setFailed(false)
      attemptPlay()
    }

    const onLoadedData = () => {
      if (cancelled) return
      attemptPlay()
    }

    const onCanPlay = () => {
      if (cancelled) return
      raiseReady()
      attemptPlay()
    }

    const onPlaying = () => {
      if (cancelled) return
      raiseReady()
    }

    const onError = () => {
      if (cancelled) return
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        setFailed(true)
        return
      }
      setFailed(false)
      attemptPlay()
    }

    const onVisibility = () => {
      if (!document.hidden) attemptPlay()
    }

    const onPageShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) attemptPlay()
    }

    const onResize = () => attemptPlay()

    const onBuffer = () => {
      if (!cancelled) attemptPlay()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onBuffer)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('waiting', onBuffer)
    video.addEventListener('stalled', onBuffer)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    attemptPlay()
    const raf = requestAnimationFrame(() => attemptPlay())

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('canplaythrough', onBuffer)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('waiting', onBuffer)
      video.removeEventListener('stalled', onBuffer)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [attemptPlay])

  /** Any first touch / press on the page — iOS often only unlocks from a real gesture. */
  useEffect(() => {
    const unlock = () => attemptPlay()
    window.addEventListener('touchstart', unlock, { capture: true, passive: true })
    window.addEventListener('touchend', unlock, { capture: true, passive: true })
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true })
    window.addEventListener('click', unlock, { capture: true })
    return () => {
      window.removeEventListener('touchstart', unlock, { capture: true })
      window.removeEventListener('touchend', unlock, { capture: true })
      window.removeEventListener('pointerdown', unlock, { capture: true })
      window.removeEventListener('click', unlock, { capture: true })
    }
  }, [attemptPlay])

  /** Intro overlay is gone — WebKit frequently needs another play() here. */
  useEffect(() => {
    if (!playGate) return
    attemptPlay()
    const t50 = window.setTimeout(attemptPlay, 50)
    const t200 = window.setTimeout(attemptPlay, 200)
    const t600 = window.setTimeout(attemptPlay, 600)
    const raf = requestAnimationFrame(attemptPlay)
    return () => {
      window.clearTimeout(t50)
      window.clearTimeout(t200)
      window.clearTimeout(t600)
      cancelAnimationFrame(raf)
    }
  }, [playGate, attemptPlay])

  /**
   * Mobile Safari often paints a black box when `<video>` sits under composited
   * transforms or fractional opacity. Skip GPU transforms on small screens; keep
   * translateZ / backface polish for `sm+` only. Parent `sm:isolate` avoids
   * stacking-context issues on small viewports (see ComingSoonHome).
   */
  return (
    <div className="pointer-events-none absolute inset-0 min-h-[100svh] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 h-full min-h-[100svh] w-full sm:transform-gpu sm:[backface-visibility:hidden]"
        style={{ transformOrigin: '50% 50%' }}
      >
        <video
          ref={ref}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          className={`pointer-events-auto h-full min-h-[100svh] w-full object-cover object-[52%_46%] max-sm:[transform:none] sm:min-h-0 sm:object-center sm:[transform:translateZ(0)] ${
            failed
              ? 'pointer-events-none opacity-0'
              : ready
                ? 'max-sm:opacity-100 sm:opacity-[0.97]'
                : 'max-sm:opacity-100 opacity-[0.94] sm:opacity-[0.94]'
          } max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out`}
          onPointerDownCapture={() => attemptPlay()}
        >
          <source src={HERO_MP4} type="video/mp4" />
        </video>
        {failed && (
          <div className="absolute inset-0">
            <img
              src="/black8.jpg"
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </div>
    </div>
  )
})

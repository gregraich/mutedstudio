'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'

/**
 * Background hero video. Parent stack uses `pointer-events-none`; this subtree
 * MUST use `pointer-events-auto` or iOS never receives taps → stuck on native play UI.
 * `playGate` runs extra `play()` ticks after the intro overlay is gone.
 */
function armVideo(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.loop = true
  video.controls = false
  video.removeAttribute('controls')
  video.disablePictureInPicture = true
  video.setAttribute('muted', '')
  video.setAttribute('loop', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
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

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    attemptPlay()
    const raf = requestAnimationFrame(() => attemptPlay())

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [attemptPlay])

  /** Any first touch / press on the page — iOS often only unlocks from a real gesture. */
  useEffect(() => {
    const unlock = () => attemptPlay()
    window.addEventListener('touchstart', unlock, { capture: true, passive: true })
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true })
    return () => {
      window.removeEventListener('touchstart', unlock, { capture: true })
      window.removeEventListener('pointerdown', unlock, { capture: true })
    }
  }, [attemptPlay])

  /** Intro overlay is gone — WebKit frequently needs another play() here. */
  useEffect(() => {
    if (!playGate) return
    attemptPlay()
    const t = window.setTimeout(attemptPlay, 50)
    const raf = requestAnimationFrame(attemptPlay)
    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [playGate, attemptPlay])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transform-gpu [backface-visibility:hidden]"
        style={{ transformOrigin: '50% 50%' }}
      >
        <video
          ref={ref}
          src="/muted.mp4"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          className={`pointer-events-auto h-full w-full object-cover object-[52%_46%] [transform:translateZ(0)] sm:object-center ${
            failed
              ? 'opacity-0'
              : ready
                ? 'opacity-100 max-sm:opacity-[0.995] sm:opacity-[0.97]'
                : 'opacity-[0.94] max-sm:opacity-[0.97]'
          } max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out`}
          onPointerDownCapture={() => attemptPlay()}
        />
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

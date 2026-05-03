'use client'

import { memo, useEffect, useRef, useState } from 'react'

/**
 * Memoized background video so parent re-renders (intro, contact, framer) do not
 * reconcile the <video> DOM unnecessarily — that can contribute to Safari/iOS stutter.
 *
 * For smoother phones, add `public/muted-mobile.mp4` (720p ~2.5–3 Mbps, +faststart, -an)
 * and uncomment the first <source> below.
 */
const VIDEO_SRC = '/muted.mp4#t=0.001'

type ComingSoonHeroVideoProps = {
  /** When true, effect re-runs so `load()`/`play()` get a second chance after the intro layer is gone (same DOM, HTTP cache). */
  playGate: boolean
}

export const ComingSoonHeroVideo = memo(function ComingSoonHeroVideo({ playGate }: ComingSoonHeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (playGate) {
      readyOnce.current = false
    }

    let cancelled = false

    const raiseReady = () => {
      if (cancelled || readyOnce.current) return
      readyOnce.current = true
      setReady(true)
      setFailed(false)
    }

    const attemptPlay = async () => {
      if (cancelled) return
      try {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise
        }
      } catch {
        // iOS can reject autoplay promises in Low Power mode/settings.
        // Do not trigger fallback unless media loading actually fails.
      }
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('x5-playsinline', 'true')
    video.preload = 'auto'
    if (!video.getAttribute('src')) {
      video.src = VIDEO_SRC
    }
    video.load()

    const onLoadedMetadata = () => {
      if (cancelled) return
      setFailed(false)
      void attemptPlay()
    }

    const onLoadedData = () => {
      if (cancelled) return
      raiseReady()
      setFailed(false)
    }

    const onCanPlay = () => {
      if (cancelled) return
      raiseReady()
      void attemptPlay()
    }

    const onPlaying = () => {
      if (cancelled) return
      raiseReady()
    }

    const onError = () => {
      if (cancelled) return
      const err = video.error
      if (
        err?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED ||
        err?.code === MediaError.MEDIA_ERR_DECODE
      ) {
        setFailed(true)
        return
      }
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE && err) {
        setFailed(true)
        return
      }
      setFailed(false)
      void attemptPlay()
    }

    const kickGesture = () => {
      void attemptPlay()
    }

    const onPageShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) void attemptPlay()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    void attemptPlay()
    requestAnimationFrame(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (cancelled) return
        void attemptPlay()
      })
    })

    let n = 0
    const iv = window.setInterval(() => {
      if (cancelled || n++ >= 10) {
        window.clearInterval(iv)
        return
      }
      if (video.paused) void attemptPlay()
    }, 350)

    window.addEventListener('touchstart', kickGesture, { passive: true, capture: true })
    window.addEventListener('click', kickGesture, { capture: true })
    const onVisibility = () => {
      if (!document.hidden) void attemptPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      cancelled = true
      window.clearInterval(iv)
      window.removeEventListener('touchstart', kickGesture, { capture: true } as AddEventListenerOptions)
      window.removeEventListener('click', kickGesture, { capture: true } as AddEventListenerOptions)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [playGate])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ transformOrigin: '50% 50%' }}>
        <video
          ref={ref}
          src={VIDEO_SRC}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          poster="/black8.jpg"
          controls={false}
          className={`h-full w-full object-cover object-[52%_46%] sm:object-center ${
            failed
              ? 'opacity-0'
              : ready
                ? 'opacity-100 max-sm:opacity-[0.995] sm:opacity-[0.97]'
                : 'opacity-[0.94] max-sm:opacity-[0.97]'
          } max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out`}
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

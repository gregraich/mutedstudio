'use client'

import { memo, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * Memoized background video so parent re-renders (intro, contact, framer) do not
 * reconcile the <video> DOM unnecessarily — that can contribute to Safari/iOS stutter.
 *
 * Uses a single `src` chosen on the client. `<source media>` is unreliable on iOS
 * Safari; `matchMedia` + one URL avoids that. Narrow viewports try `muted-mobile.mp4`
 * first; if that request fails, we fall back to `muted.mp4` without device sniffing.
 */
const VIDEO_SRC_DESKTOP = '/muted.mp4'
const VIDEO_SRC_MOBILE = '/muted-mobile.mp4'

function subscribeMaxSm(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(max-width: 639px)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getMaxSmSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 639px)').matches
}

function getMaxSmServerSnapshot() {
  return false
}

type ComingSoonHeroVideoProps = {
  /** After the intro unmounts, call `play()` again — without `load()`, so we do not reset iOS media-user-gesture state. */
  playGate: boolean
}

function applyInlineAutoplayAttrs(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('autoplay', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('x5-playsinline', 'true')
}

export const ComingSoonHeroVideo = memo(function ComingSoonHeroVideo({ playGate }: ComingSoonHeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const maxSm = useSyncExternalStore(subscribeMaxSm, getMaxSmSnapshot, getMaxSmServerSnapshot)
  /** After a real failure loading the mobile asset, use the master file on small screens too. */
  const [mobileAssetBypass, setMobileAssetBypass] = useState(false)

  const resolvedSrc =
    maxSm && !mobileAssetBypass ? VIDEO_SRC_MOBILE : VIDEO_SRC_DESKTOP

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)

  useLayoutEffect(() => {
    const video = ref.current
    if (!video) return

    readyOnce.current = false
    setReady(false)

    let cancelled = false

    const raiseReady = () => {
      if (cancelled || readyOnce.current) return
      readyOnce.current = true
      setReady(true)
      setFailed(false)
    }

    const attemptPlay = () => {
      if (cancelled) return
      applyInlineAutoplayAttrs(video)
      void video.play().catch(() => {
        /* autoplay policy / Low Power — first real tap still unlocks via pointer listener */
      })
    }

    applyInlineAutoplayAttrs(video)
    video.preload = 'auto'
    // Do NOT call video.load() here: on iOS/WebKit it commonly forces the next play()
    // onto the "user gesture required" path and leaves the inline play overlay up.

    const onLoadedMetadata = () => {
      if (cancelled) return
      setFailed(false)
      attemptPlay()
    }

    const onLoadedData = () => {
      if (cancelled) return
      raiseReady()
      setFailed(false)
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
      const err = video.error
      const url = video.currentSrc || video.src || ''

      if (maxSm && !mobileAssetBypass && url.includes('muted-mobile')) {
        setMobileAssetBypass(true)
        setFailed(false)
        return
      }

      if (err?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        setFailed(true)
        return
      }
      if (err?.code === MediaError.MEDIA_ERR_DECODE) {
        setFailed(true)
        return
      }
      setFailed(false)
      attemptPlay()
    }

    const onPageShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) attemptPlay()
    }

    const onVisibility = () => {
      if (!document.hidden) attemptPlay()
    }

    let stallTimer: number | undefined
    const onStallOrWait = () => {
      if (stallTimer) window.clearTimeout(stallTimer)
      stallTimer = window.setTimeout(() => {
        if (!cancelled && video.paused) attemptPlay()
      }, 250)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)
    video.addEventListener('stalled', onStallOrWait)
    video.addEventListener('waiting', onStallOrWait)

    attemptPlay()
    queueMicrotask(attemptPlay)

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      cancelled = true
      if (stallTimer) window.clearTimeout(stallTimer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
      video.removeEventListener('stalled', onStallOrWait)
      video.removeEventListener('waiting', onStallOrWait)
    }
  }, [resolvedSrc])

  useEffect(() => {
    if (!maxSm) setMobileAssetBypass(false)
  }, [maxSm])

  useEffect(() => {
    if (!playGate) return
    const video = ref.current
    if (!video) return
    applyInlineAutoplayAttrs(video)
    queueMicrotask(() => {
      applyInlineAutoplayAttrs(video)
      void video.play().catch(() => {})
    })
  }, [playGate])

  const onVideoPointerDown = () => {
    const video = ref.current
    if (!video) return
    applyInlineAutoplayAttrs(video)
    void video.play().catch(() => {})
  }

  return (
    <div className="pointer-events-auto absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ transformOrigin: '50% 50%' }}>
        <video
          ref={ref}
          key={resolvedSrc}
          src={resolvedSrc}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          poster="/black8.jpg"
          suppressHydrationWarning
          onPointerDownCapture={onVideoPointerDown}
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

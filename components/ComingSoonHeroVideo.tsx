'use client'

import { memo, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * Memoized background video so parent re-renders (intro, contact, framer) do not
 * reconcile the <video> DOM unnecessarily — that can contribute to Safari/iOS stutter.
 *
 * The `<video>` is mounted only after the client commits (see `mediaMounted`). That
 * avoids iOS Safari hydration bugs where the element is created with one `src` from SSR
 * and immediately swapped for another on narrow viewports.
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
  playGate: boolean
}

function applyInlineAutoplayAttrs(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.loop = true
  video.setAttribute('muted', '')
  video.setAttribute('loop', '')
  video.setAttribute('autoplay', '')
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('x5-playsinline', 'true')
}

export const ComingSoonHeroVideo = memo(function ComingSoonHeroVideo({ playGate }: ComingSoonHeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const maxSm = useSyncExternalStore(subscribeMaxSm, getMaxSmSnapshot, getMaxSmServerSnapshot)
  const [mobileAssetBypass, setMobileAssetBypass] = useState(false)

  /** Do not mount <video> until after client layout — avoids iOS hydration/src churn (useLayoutEffect survives Strict Mode). */
  const [mediaMounted, setMediaMounted] = useState(false)
  useLayoutEffect(() => {
    setMediaMounted(true)
  }, [])

  const resolvedSrc =
    maxSm && !mobileAssetBypass ? VIDEO_SRC_MOBILE : VIDEO_SRC_DESKTOP

  const playbackSrc =
    maxSm && !resolvedSrc.includes('#') ? `${resolvedSrc}#t=0.001` : resolvedSrc

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)
  const prevResolvedSrc = useRef<string | null>(null)

  useEffect(() => {
    if (prevResolvedSrc.current === null) {
      prevResolvedSrc.current = resolvedSrc
      return
    }
    if (prevResolvedSrc.current === resolvedSrc) return
    prevResolvedSrc.current = resolvedSrc
    readyOnce.current = false
    setReady(false)
  }, [resolvedSrc])

  useLayoutEffect(() => {
    if (!mediaMounted) return
    const video = ref.current
    if (!video) return

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
      void video.play().catch(() => {})
    }

    applyInlineAutoplayAttrs(video)
    video.preload = 'auto'

    const onLoadedMetadata = () => {
      if (cancelled) return
      setFailed(false)
      if (maxSm) {
        try {
          if (video.currentTime === 0) video.currentTime = 0.001
        } catch {
          /* ignore */
        }
      }
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
      const triedMobile = maxSm && !mobileAssetBypass && resolvedSrc === VIDEO_SRC_MOBILE

      if (triedMobile) {
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
    queueMicrotask(() => queueMicrotask(attemptPlay))

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
  }, [resolvedSrc, maxSm, mobileAssetBypass, playbackSrc, mediaMounted])

  useEffect(() => {
    if (!maxSm) setMobileAssetBypass(false)
  }, [maxSm])

  useEffect(() => {
    if (!playGate || !mediaMounted) return
    const video = ref.current
    if (!video) return
    applyInlineAutoplayAttrs(video)
    queueMicrotask(() => {
      applyInlineAutoplayAttrs(video)
      void video.play().catch(() => {})
    })
  }, [playGate, mediaMounted])

  /** iOS: keep calling play() on touch until the element is actually playing. */
  useEffect(() => {
    if (!mediaMounted || !maxSm) return
    const node = ref.current
    if (!node) return

    const kick = () => {
      const v = ref.current
      if (!v || v.paused === false) return
      applyInlineAutoplayAttrs(v)
      void v.play().catch(() => {})
    }

    const opts: AddEventListenerOptions = { passive: true, capture: true }
    window.addEventListener('touchstart', kick, opts)
    window.addEventListener('touchend', kick, opts)

    const onPlaying = () => {
      window.removeEventListener('touchstart', kick, opts)
      window.removeEventListener('touchend', kick, opts)
      node.removeEventListener('playing', onPlaying)
    }
    node.addEventListener('playing', onPlaying)

    return () => {
      window.removeEventListener('touchstart', kick, opts)
      window.removeEventListener('touchend', kick, opts)
      node.removeEventListener('playing', onPlaying)
    }
  }, [mediaMounted, maxSm])

  const onVideoPointerDown = () => {
    const video = ref.current
    if (!video) return
    applyInlineAutoplayAttrs(video)
    void video.play().catch(() => {})
  }

  const posterClass =
    'h-full w-full object-cover object-[52%_46%] sm:object-center max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out'

  if (!mediaMounted) {
    return (
      <div className="pointer-events-auto absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ transformOrigin: '50% 50%' }}>
          <img src="/black8.jpg" alt="" className={`opacity-100 ${posterClass}`} loading="eager" decoding="async" />
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-auto absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ transformOrigin: '50% 50%' }}>
        <video
          ref={ref}
          src={playbackSrc}
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          poster={maxSm ? undefined : '/black8.jpg'}
          suppressHydrationWarning
          onPointerDownCapture={onVideoPointerDown}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className={`h-full w-full object-cover object-[52%_46%] sm:object-center ${
            failed
              ? 'opacity-0'
              : maxSm
                ? 'opacity-100'
                : ready
                  ? 'opacity-100 max-sm:opacity-[0.995] sm:opacity-[0.97]'
                  : 'opacity-[0.94] max-sm:opacity-[0.97]'
          } max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out`}
        />
        {failed && (
          <div className="absolute inset-0">
            <img src="/black8.jpg" alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
          </div>
        )}
      </div>
    </div>
  )
})

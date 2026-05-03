'use client'

import { memo, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * Memoized background video so parent re-renders (intro, contact, framer) do not
 * reconcile the <video> DOM unnecessarily — that can contribute to Safari/iOS stutter.
 *
 * Narrow viewports use `muted-mobile.mp4` when available; on load failure we fall back
 * to `muted.mp4` (same URL check as `onError` — do not rely on `currentSrc` containing
 * the filename; it is often empty when the resource errors).
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
  const [mobileAssetBypass, setMobileAssetBypass] = useState(false)

  const resolvedSrc =
    maxSm && !mobileAssetBypass ? VIDEO_SRC_MOBILE : VIDEO_SRC_DESKTOP

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)
  const prevResolvedSrc = useRef<string | null>(null)

  /** Only reset “ready” when the URL actually changes — never on first mount (that was clearing desktop after canplay). */
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
      void video.play().catch(() => {
        /* autoplay policy / Low Power */
      })
    }

    applyInlineAutoplayAttrs(video)
    video.preload = 'auto'

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
  }, [resolvedSrc, maxSm, mobileAssetBypass])

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

  /** First-touch unlock on small viewports only (does not touch desktop mouse flow). */
  useEffect(() => {
    const unlock = () => {
      if (!window.matchMedia('(max-width: 639px)').matches) return
      const v = ref.current
      if (!v) return
      applyInlineAutoplayAttrs(v)
      void v.play().catch(() => {})
    }
    window.addEventListener('touchstart', unlock, { passive: true, capture: true, once: true })
    return () => {
      window.removeEventListener('touchstart', unlock, { capture: true } as AddEventListenerOptions)
    }
  }, [])

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
          src={resolvedSrc}
          muted
          playsInline
          autoPlay
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

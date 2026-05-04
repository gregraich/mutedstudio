'use client'

import { memo, useEffect, useRef, useState } from 'react'

/**
 * Memoized background video so parent re-renders (intro, contact, framer) do not
 * reconcile the <video> DOM unnecessarily — that can contribute to Safari/iOS stutter.
 *
 * For smoother phones, add `public/muted-mobile.mp4` (720p ~2.5–3 Mbps, +faststart, -an)
 * and uncomment the first <source> below.
 */
export const ComingSoonHeroVideo = memo(function ComingSoonHeroVideo() {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const readyOnce = useRef(false)

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

    const play = () => {
      if (cancelled) return
      void video.play().catch(() => {
        /* autoplay policy / Low Power */
      })
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.disablePictureInPicture = true
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.preload = 'auto'
    // Intentionally no video.load() — it clears buffered data and often reads as hitching.

    const onLoadedMetadata = () => {
      if (cancelled) return
      setFailed(false)
      play()
    }

    const onCanPlay = () => {
      if (cancelled) return
      raiseReady()
      play()
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
      play()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    play()

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transform-gpu [backface-visibility:hidden]"
        style={{ transformOrigin: '50% 50%' }}
      >
        <video
          ref={ref}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          poster="/black8.jpg"
          disablePictureInPicture
          className={`h-full w-full object-cover object-[52%_46%] [transform:translateZ(0)] sm:object-center ${
            failed
              ? 'opacity-0'
              : ready
                ? 'opacity-100 max-sm:opacity-[0.995] sm:opacity-[0.97]'
                : 'opacity-[0.94] max-sm:opacity-[0.97]'
          } max-sm:transition-none sm:transition-opacity sm:duration-200 sm:ease-out`}
        >
          {/* <source src="/muted-mobile.mp4" type="video/mp4" media="(max-width: 639px)" /> */}
          <source src="/muted.mp4" type="video/mp4" />
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from '../App.module.css'

const DRAG_THRESHOLD = 6
const SETTLE_MS = 140

export default function ProjectCarousel({ items, getKey, getLabel, renderItem }) {
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const target = useRef(null)
  const settleTimer = useRef(0)
  const frame = useRef(0)
  const [position, setPosition] = useState({ index: 0, perView: 1, atStart: true, atEnd: false })
  const [dragging, setDragging] = useState(false)

  const measure = useCallback(() => {
    const track = trackRef.current
    const slides = track?.children
    if (!track || !slides?.length) return null
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth
    const max = track.scrollWidth - track.clientWidth
    const perView = Math.max(1, Math.min(items.length, Math.round(track.clientWidth / step)))
    return { track, step, max, perView, maxIndex: items.length - perView }
  }, [items.length])

  const sync = useCallback(() => {
    frame.current = 0
    const m = measure()
    if (!m) return
    const { track, step, max, perView, maxIndex } = m
    const atEnd = track.scrollLeft >= max - 2
    // Rounding the offset (rather than testing which slides are partly visible) changes the
    // counter exactly once per move instead of flickering while a card is half on screen.
    const index = atEnd ? maxIndex : Math.max(0, Math.min(maxIndex, Math.round(track.scrollLeft / step)))
    const next = { index, perView, atStart: track.scrollLeft <= 2, atEnd }
    setPosition((prev) =>
      prev.index === next.index && prev.perView === next.perView && prev.atStart === next.atStart && prev.atEnd === next.atEnd ? prev : next,
    )
  }, [measure])

  const settle = useCallback(() => {
    const track = trackRef.current
    target.current = null
    if (track && !drag.current) track.style.scrollSnapType = ''
    sync()
  }, [sync])

  const onScroll = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(sync)
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(settle, SETTLE_MS)
  }, [settle, sync])

  const goTo = useCallback(
    (index) => {
      const m = measure()
      if (!m) return
      const clamped = Math.max(0, Math.min(m.maxIndex, index))
      target.current = clamped
      const left = Math.min(clamped * m.step, m.max)
      m.track.scrollTo({ left, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
      if (Math.abs(m.track.scrollLeft - left) < 1) settle()
    },
    [measure, settle, shouldReduceMotion],
  )

  // Repeated clicks build on where the carousel is heading, not where it is mid-glide.
  const step = (direction) => goTo((target.current ?? position.index) + direction)

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('resize', sync)
      window.clearTimeout(settleTimer.current)
      cancelAnimationFrame(frame.current)
    }
  }, [sync])

  function onPointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, left: trackRef.current.scrollLeft, moved: false, startIndex: position.index }
  }

  function onPointerMove(event) {
    const state = drag.current
    if (!state) return
    const dx = event.clientX - state.x
    if (!state.moved && Math.abs(dx) < DRAG_THRESHOLD) return
    const track = trackRef.current
    if (!state.moved) {
      state.moved = true
      // Snap off while dragging so the track follows the pointer 1:1.
      track.style.scrollSnapType = 'none'
      track.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    track.scrollLeft = state.left - dx
  }

  function endDrag(event) {
    const state = drag.current
    drag.current = null
    if (!state?.moved) return
    suppressClick.current = true
    setDragging(false)
    const track = trackRef.current
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
    const dx = event.clientX - state.x
    const direction = Math.abs(dx) > 60 ? (dx < 0 ? 1 : -1) : 0
    goTo(state.startIndex + direction)
  }

  function onClickCapture(event) {
    if (!suppressClick.current) return
    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  function onKeyDown(event) {
    if (event.target !== trackRef.current) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  const { index, perView, atStart, atEnd } = position
  const first = index
  const last = Math.min(items.length - 1, index + perView - 1)
  const trackClass = `${styles.projectTrack} ${dragging ? styles.projectTrackDragging : ''}`.trim()
  const pad = (n) => String(n).padStart(2, '0')
  const isShown = (i) => i >= first && i <= last

  return (
    <div className={styles.projectCarousel}>
      <div className={styles.projectControls}>
        <div className={styles.projectDots}>
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              className={`${styles.projectDot} ${isShown(i) ? styles.projectDotActive : ''}`.trim()}
              aria-label={`Show ${getLabel(item)}`}
              aria-current={isShown(i) ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <p className={styles.projectHint} aria-hidden="true">
          <span className={styles.projectHintPointer}>Drag or use the arrows</span>
          <span className={styles.projectHintTouch}>Swipe for more</span>
        </p>
        <p className={styles.projectCounter} aria-live="polite">
          {first === last ? pad(first + 1) : `${pad(first + 1)}–${pad(last + 1)}`} / {pad(items.length)}
        </p>
        <div className={styles.projectArrows}>
          <button type="button" className={styles.projectArrow} onClick={() => step(-1)} disabled={atStart} aria-label="Previous project">
            ←
          </button>
          <button type="button" className={styles.projectArrow} onClick={() => step(1)} disabled={atEnd} aria-label="Next project">
            →
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className={trackClass}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onDragStart={(event) => event.preventDefault()}
      >
        {items.map((item, i) => (
          <div
            key={getKey(item)}
            className={styles.projectSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${getLabel(item)}`}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from '../App.module.css'

const DRAG_THRESHOLD = 6

export default function ProjectCarousel({ items, getKey, getLabel, renderItem }) {
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [dragging, setDragging] = useState(false)

  const slideLeft = useCallback((index) => {
    const track = trackRef.current
    const slide = track?.children[index]
    if (!slide) return 0
    return slide.offsetLeft - track.children[0].offsetLeft
  }, [])

  const goTo = useCallback(
    (index) => {
      const track = trackRef.current
      if (!track) return
      const clamped = Math.max(0, Math.min(items.length - 1, index))
      track.scrollTo({ left: slideLeft(clamped), behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    },
    [items.length, shouldReduceMotion, slideLeft],
  )

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 2)
    setAtEnd(track.scrollLeft >= max - 2)
    let nearest = 0
    let nearestDistance = Infinity
    for (let i = 0; i < items.length; i += 1) {
      const distance = Math.abs(slideLeft(i) - track.scrollLeft)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = i
      }
    }
    // The last slides can never reach the left edge, so the end of the track means the last item.
    setActive(track.scrollLeft >= max - 2 ? items.length - 1 : nearest)
  }, [items.length, slideLeft])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  function onPointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, left: trackRef.current.scrollLeft, moved: false }
  }

  function onPointerMove(event) {
    const state = drag.current
    if (!state) return
    const dx = event.clientX - state.x
    if (!state.moved && Math.abs(dx) < DRAG_THRESHOLD) return
    if (!state.moved) {
      state.moved = true
      setDragging(true)
      trackRef.current.setPointerCapture(event.pointerId)
    }
    trackRef.current.scrollLeft = state.left - dx
  }

  function endDrag(event) {
    const state = drag.current
    drag.current = null
    if (!state?.moved) return
    suppressClick.current = true
    setDragging(false)
    if (trackRef.current.hasPointerCapture(event.pointerId)) trackRef.current.releasePointerCapture(event.pointerId)
    const dx = event.clientX - state.x
    const direction = Math.abs(dx) > 60 ? (dx < 0 ? 1 : -1) : 0
    goTo(active + direction)
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
      goTo(active + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(active - 1)
    }
  }

  const trackClass = [
    styles.projectTrack,
    dragging ? styles.projectTrackDragging : '',
    atStart ? '' : styles.projectTrackFadeLeft,
    atEnd ? '' : styles.projectTrackFadeRight,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.projectCarousel}>
      <div
        ref={trackRef}
        className={trackClass}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onDragStart={(event) => event.preventDefault()}
      >
        {items.map((item, index) => (
          <div
            key={getKey(item)}
            className={styles.projectSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}: ${getLabel(item)}`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <div className={styles.projectControls}>
        <div className={styles.projectDots}>
          {items.map((item, index) => (
            <button
              key={getKey(item)}
              type="button"
              className={`${styles.projectDot} ${index === active ? styles.projectDotActive : ''}`.trim()}
              aria-label={`Show ${getLabel(item)}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <p className={styles.projectCounter} aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <div className={styles.projectArrows}>
          <button type="button" className={styles.projectArrow} onClick={() => goTo(active - 1)} disabled={atStart} aria-label="Previous project">
            ←
          </button>
          <button type="button" className={styles.projectArrow} onClick={() => goTo(active + 1)} disabled={atEnd} aria-label="Next project">
            →
          </button>
        </div>
      </div>
    </div>
  )
}

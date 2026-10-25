import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from '../App.module.css'

const STACKED_LAYOUT = '(max-width: 1024px)'
const CYCLE_MS = 2600

function startYear(period) {
  return period.match(/\d{4}/)?.[0] ?? ''
}

export default function CareerStack({ jobs, activeIndex, onSelect }) {
  const shouldReduceMotion = useReducedMotion()
  const stageRef = useRef(null)
  const hostRef = useRef(null)
  const labelRefs = useRef([])
  const apiRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [stacked, setStacked] = useState(() => window.matchMedia(STACKED_LAYOUT).matches)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [userPicked, setUserPicked] = useState(false)

  const shownIndex = stacked && !userPicked ? cycleIndex : activeIndex
  const latest = useRef({ shownIndex, visible })
  latest.current = { shownIndex, visible }

  useEffect(() => {
    const query = window.matchMedia(STACKED_LAYOUT)
    const onChange = () => setStacked(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    let cancelled = false
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        loadObserver.disconnect()
        import('./careerStackScene.js')
          .then(({ createCareerStack }) => {
            if (cancelled || !hostRef.current) return
            apiRef.current = createCareerStack(hostRef.current, {
              count: jobs.length,
              reducedMotion: Boolean(shouldReduceMotion),
              getLabels: () => labelRefs.current,
            })
            apiRef.current.setActive(latest.current.shownIndex)
            apiRef.current.setRunning(latest.current.visible)
          })
          .catch(() => {
            if (!cancelled) setFailed(true)
          })
      },
      { rootMargin: '600px 0px' },
    )
    loadObserver.observe(stage)

    const visibleObserver = new IntersectionObserver((entries) => {
      setVisible(entries.some((entry) => entry.isIntersecting))
    })
    visibleObserver.observe(stage)

    return () => {
      cancelled = true
      loadObserver.disconnect()
      visibleObserver.disconnect()
      apiRef.current?.dispose()
      apiRef.current = null
    }
    // The scene is built once; later changes go through setActive/setRunning.
  }, [])

  useEffect(() => {
    apiRef.current?.setRunning(visible)
  }, [visible])

  useEffect(() => {
    apiRef.current?.setActive(shownIndex)
  }, [shownIndex])

  useEffect(() => {
    if (!stacked || !visible || userPicked || shouldReduceMotion) return undefined
    const id = setInterval(() => setCycleIndex((i) => (i + 1) % jobs.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [stacked, visible, userPicked, shouldReduceMotion, jobs.length])

  if (failed) return null

  return (
    <div ref={stageRef} className={styles.careerStack}>
      <div ref={hostRef} className={styles.careerStackCanvas} aria-hidden="true" />
      <ol className={styles.careerStackLabels}>
        {jobs.map((job, i) => (
          <li key={job.slug}>
            <button
              type="button"
              ref={(el) => {
                labelRefs.current[i] = el
              }}
              className={`${styles.careerStackLabel} ${i === shownIndex ? styles.careerStackLabelActive : ''}`.trim()}
              onClick={() => {
                setUserPicked(true)
                setCycleIndex(i)
                onSelect(i)
              }}
              aria-label={`Jump to ${job.title} at ${job.company}`}
            >
              <span className={styles.careerStackLayer}>
                L{jobs.length - i} · {job.layer}
              </span>
              <span className={styles.careerStackRole}>
                {job.company === 'Shared Services Canada' ? 'SSC' : job.company} · {startYear(job.period)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

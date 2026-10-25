import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from '../App.module.css'

const CYCLE_MS = 3200

export default function SkillsToolbox({ skills }) {
  const shouldReduceMotion = useReducedMotion()
  const categories = Object.entries(skills)
  const stageRef = useRef(null)
  const hostRef = useRef(null)
  const apiRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [picked, setPicked] = useState(null)
  const [cycleIndex, setCycleIndex] = useState(0)

  const shown = hovered ?? picked ?? cycleIndex
  const latest = useRef({ shown, visible })
  latest.current = { shown, visible }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    let cancelled = false
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        loadObserver.disconnect()
        import('./toolboxScene.js')
          .then(({ createToolbox }) => {
            if (cancelled || !hostRef.current) return
            apiRef.current = createToolbox(hostRef.current, {
              count: categories.length,
              reducedMotion: Boolean(shouldReduceMotion),
            })
            apiRef.current.setActive(latest.current.shown)
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
    apiRef.current?.setActive(shown)
  }, [shown])

  useEffect(() => {
    if (!visible || hovered !== null || picked !== null || shouldReduceMotion) return undefined
    const id = setInterval(() => setCycleIndex((i) => (i + 1) % categories.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [visible, hovered, picked, shouldReduceMotion, categories.length])

  return (
    <div className={`${styles.toolbox} ${failed ? styles.toolboxNoModel : ''}`.trim()}>
      <div className={styles.toolboxList} onMouseLeave={() => setHovered(null)}>
        {categories.map(([category, items], index) => (
          <div
            key={category}
            className={`${styles.toolboxRow} ${index === shown ? styles.toolboxRowActive : ''}`.trim()}
            onMouseEnter={() => setHovered(index)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            onClick={() => setPicked(index)}
          >
            <h2 className={styles.toolboxLabel}>
              <button type="button" className={styles.toolboxLabelButton} aria-pressed={index === shown}>
                {category}
              </button>
            </h2>
            <div className={styles.skillTags}>
              {items.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {failed ? null : (
        <div ref={stageRef} className={styles.toolboxStage}>
          <div ref={hostRef} className={styles.toolboxCanvas} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

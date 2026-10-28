import { useEffect, useMemo, useRef } from 'react'
import data from '../data/githubContributions.json'
import styles from '../App.module.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LEVEL_CLASS = ['ghPort0', 'ghPort1', 'ghPort2', 'ghPort3', 'ghPort4']

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

function summarize(weeks) {
  const days = weeks.flat()
  let busiest = days[0]
  let longest = 0
  let run = 0
  for (const day of days) {
    if (day.count > busiest.count) busiest = day
    run = day.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  const monthLabels = []
  weeks.forEach((week, index) => {
    const month = Number(week[0].date.slice(5, 7)) - 1
    const previous = index > 0 ? Number(weeks[index - 1][0].date.slice(5, 7)) - 1 : -1
    // Skip a label squeezed into the first column when the next month starts right after it.
    if (month !== previous && !(index === 0 && week[0].date.slice(8) > '24')) {
      monthLabels.push({ index, label: MONTHS[month] })
    }
  })
  return { activeDays: days.filter((day) => day.count > 0).length, busiest, longest, monthLabels }
}

export default function GithubActivity() {
  const scrollRef = useRef(null)
  const { activeDays, busiest, longest, monthLabels } = useMemo(() => summarize(data.weeks), [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  return (
    <section className={styles.ghPanel} aria-labelledby="github-activity-title">
      <div className={styles.ghHeader}>
        <div>
          <p className={styles.ghCommand}>$ show interface github {data.user}</p>
          <h3 id="github-activity-title" className={styles.ghTitle}>
            GitHub activity
          </h3>
        </div>
        <div className={styles.ghStatus}>
          <span className={styles.ghLinkLed} aria-hidden="true" />
          <span>link up</span>
          <a href={`https://github.com/${data.user}`} className={styles.ghProfileLink} target="_blank" rel="noreferrer">
            github.com/{data.user} ↗
          </a>
        </div>
      </div>

      <div ref={scrollRef} className={styles.ghScroll}>
        <div className={styles.ghFaceplate} style={{ '--gh-weeks': data.weeks.length }}>
          <div className={styles.ghMonths} aria-hidden="true">
            {monthLabels.map((month) => (
              <span key={month.index} style={{ gridColumnStart: month.index + 1 }}>
                {month.label}
              </span>
            ))}
          </div>
          <div
            className={styles.ghPorts}
            role="img"
            aria-label={`${data.total} contributions in the last year across ${activeDays} active days. Busiest day ${formatDate(busiest.date)} with ${busiest.count}.`}
          >
            {data.weeks.map((week, weekIndex) =>
              week.map((day) => (
                <span
                  key={day.date}
                  className={`${styles.ghPort} ${styles[LEVEL_CLASS[day.level]]}`}
                  style={{ gridColumnStart: weekIndex + 1, gridRowStart: day.weekday + 1 }}
                  title={`${day.count === 0 ? 'No' : day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDate(day.date)}`}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <div className={styles.ghFooter}>
        <dl className={styles.ghCounters}>
          <div>
            <dt>contributions</dt>
            <dd>{data.total.toLocaleString('en-CA')}</dd>
          </div>
          <div>
            <dt>active days</dt>
            <dd>{activeDays}</dd>
          </div>
          <div>
            <dt>peak</dt>
            <dd>
              {busiest.count} on {formatDate(busiest.date).replace(/, \d{4}$/, '')}
            </dd>
          </div>
          <div>
            <dt>longest streak</dt>
            <dd>
              {longest} day{longest === 1 ? '' : 's'}
            </dd>
          </div>
        </dl>
        <div className={styles.ghLegend} aria-hidden="true">
          <span>idle</span>
          {LEVEL_CLASS.map((level) => (
            <span key={level} className={`${styles.ghPort} ${styles[level]}`} />
          ))}
          <span>saturated</span>
        </div>
      </div>
    </section>
  )
}

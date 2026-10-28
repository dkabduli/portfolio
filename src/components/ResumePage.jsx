import preview from '../data/resumePreview.json'
import styles from '../App.module.css'

export default function ResumePage({ base, pdfUrl, linkedinUrl, emailUrl, onBack }) {
  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <div className={styles.container}>
          <div className={styles.detailNav}>
            <a href={base} className={styles.detailBackLink} onClick={onBack}>
              ← Back to portfolio
            </a>
            <div className={styles.detailActions}>
              <a href={linkedinUrl} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={emailUrl} className={styles.detailResumeLink}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.resumeMain}>
        <div className={styles.container}>
          <div className={styles.resumeIntro}>
            <div>
              <p className={styles.detailLabel}>Resume</p>
              <h1 className={styles.resumeTitle}>Abdul Rehman</h1>
              <p className={styles.resumeLead}>The full one-page resume. Every link on it works, or grab the PDF.</p>
            </div>
            <div className={styles.resumeActions}>
              <a href={pdfUrl} className={styles.primaryButton} download="Abdul_Rehman_Resume.pdf">
                Download PDF
              </a>
              <a href={pdfUrl} className={styles.resumeSecondaryButton} target="_blank" rel="noreferrer">
                Open PDF ↗
              </a>
            </div>
          </div>

          <div className={styles.resumeSheets}>
            {preview.pages.map((page) => (
              <figure
                key={page.number}
                className={styles.resumeSheet}
                style={{ aspectRatio: String(page.aspect) }}
              >
                <img
                  src={`${base}resume/${page.image}`}
                  alt={`Abdul Rehman resume, page ${page.number} of ${preview.pages.length}`}
                  className={styles.resumeImage}
                />
                {page.links.map((link) => (
                  <a
                    key={`${link.href}-${link.top}`}
                    href={link.href}
                    className={styles.resumeHotspot}
                    style={{ left: `${link.left}%`, top: `${link.top}%`, width: `${link.width}%`, height: `${link.height}%` }}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={link.label}
                  />
                ))}
              </figure>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

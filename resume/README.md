# Resume PDF

Place the canonical resume PDF here as **`Resume.pdf`**.

Full path: `public/resume/Resume.pdf`

Download links use `/portfolio/resume/Resume.pdf` (see `RESUME_URL` in `src/App.jsx`).

The in-site resume page (`#/resume`) shows `resume-page-*.png` with clickable link hotspots from `src/data/resumePreview.json`. After replacing `Resume.pdf`, regenerate both with:

```
npm run resume:preview
```

This needs poppler (`pdftoppm`, `pdftohtml`) installed.

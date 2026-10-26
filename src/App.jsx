import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LazyMotion, domAnimation, motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { contactMethods } from './data/contact'
import styles from './App.module.css'
import CareerStack from './components/CareerStack'
import ProjectCarousel from './components/ProjectCarousel'
import SkillsToolbox from './components/SkillsToolbox'

const BASE = import.meta.env.BASE_URL || '/'
const RESUME_URL = `${BASE}resume/Resume.pdf`
const LINKEDIN_URL = contactMethods.find((item) => item.id === 'linkedin')?.href || 'https://linkedin.com'
const EMAIL_URL = contactMethods.find((item) => item.id === 'email')?.href || 'mailto:'
const EXPERIENCE_ROUTE_PREFIX = 'experience/'
const PROJECT_ROUTE_PREFIX = 'projects/'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'extracurriculars', label: 'Extracurriculars' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const QUICK_STATS = [
  { value: '2+', label: 'YRS INDUSTRY EXP.' },
  { value: '50+', label: 'SWITCHES UPGRADED' },
  { value: '132', label: 'INACTIVE ACCOUNTS FOUND' },
  { value: '15×', label: 'FASTER CERT PROVISIONING' },
]


const KEY_STRENGTHS = ['Infrastructure', 'Automation', 'NetDevOps', 'Full-Stack']

const EDUCATION = {
  institution: 'Carleton University',
  joint: 'joint with Algonquin College',
  degree: 'Bachelor of Information Technology (B.IT.) — Network Technology',
  year: '4th Year',
  period: 'SEPT 2023 — APRIL 2027',
  location: 'Ottawa, Ontario',
  awards: ['General In-Course Scholarship'],
  languages: ['English', 'Urdu'],
  extracurriculars: ["Carleton Muslim Students' Association (MSA) — Islamic Awareness Week (IAW)"],
}

const CREDENTIALS = [
  {
    label: 'Active Federal Clearance',
    name: 'Secret Security Clearance',
    issuer: 'Government of Canada',
    issued: 'April 2025',
    expires: 'April 2035',
    note: 'Active Secret-level clearance — eligible for classified federal roles and environments requiring GoC security screening.',
  },
]


const EXPERIENCE = [
  {
    slug: '4ummah-software-developer',
    layer: 'Applications',
    period: 'SEPT 2026 — PRESENT',
    title: 'Founding Software Developer',
    company: '4Ummah',
    logo: `${BASE}images/4ummah-logo.jpg`,
    image: `${BASE}images/4ummah-homepage.jpg`,
    imageAlt: '4Ummah homepage: "Digital home of the Muslim ecosystem", with a wall of listed app icons',
    imageNatural: true,
    highlights: [
      'Built the organisation side **end to end**, from registration and admin review to job postings, on **Next.js** and **Supabase**.',
      'Pulled real listings in automatically: job postings from company **applicant tracking systems** and apps from the **App Store**.',
      '**100+ commits** shipped through code review on a team of **5 developers**.',
    ],
    timelineBullets: [
      'Built the organisation experience end to end on **Next.js 16**, **React 19** and **Supabase**: registration with a guidelines agreement, an admin review queue, takedown and reinstatement, a reapply path for declined organisations, and organisation-level job publishing.',
      'Completed the account lifecycle with **password recovery**, **email confirmation** and route **middleware**, and fixed public company pages that returned a **500 error** to signed-out visitors.',
      'Built importers that pull job postings from company **applicant tracking systems** and fill product listings and screenshots from the **App Store**, with checks that refuse redirects onto private hosts.',
      'Added the search foundations a directory depends on: **structured data** for jobs, products, events and companies, plus a **sitemap** and **robots** rules behind an indexing switch.',
      'Audited session, route and **Postgres Row Level Security** boundaries and revoked access nobody needed.',
      'Redesigned the home, events and organisation pages with a new display typeface and warm palette, and added admin tools for featuring listings.',
    ],
    roleContext:
      '4Ummah is building digital infrastructure for the global Muslim community, starting with a searchable directory of Muslim-built products and jobs. Joined the core team as a software developer in the main **Next.js** and **Supabase** monorepo, shipping **100+ commits** alongside **4 other developers**. Work is planned in **Jira** sprints and every change goes through a pull request reviewed by the lead developer. The project keeps strict rules: authorization is enforced in **Postgres Row Level Security** and column grants, applied migrations are never edited, and all database access runs through a single services layer.',
    detailDepth: [
      {
        title: 'The organisation side, end to end',
        text: 'Organisations are how companies get onto 4Ummah, so this flow had to work from the first form to a published job. Built the whole path in one feature branch, then hardened it through review.',
        bullets: [
          'Registration that asks who is registering and requires agreement to the community guidelines.',
          'A tabbed **admin review queue**, plus takedown and reinstatement for verified organisations. A takedown also takes their jobs down.',
          'A reapply path for declined organisations, so a rejection is not a dead end.',
          'Organisation-level **job publishing**, company profile fields, and a public company page.',
        ],
      },
      {
        title: 'Bringing in real listings',
        text: 'A directory is only useful once it has real content. Built importers so listings come from the source instead of being typed in by hand.',
        bullets: [
          'Job postings pulled from company **applicant tracking systems**, matched to verified organisations by slug, with only published roles shown.',
          'Product listings, logos and screenshots filled from the **App Store**, querying the right storefront for each app.',
          'Fetching that refuses a redirect onto a private host before following it, so the importer cannot be pointed at internal services.',
        ],
      },
      {
        title: 'Search visibility',
        text: 'The site is server-rendered because most visitors will arrive from search. Added the pieces that let search engines understand it.',
        bullets: [
          '**Structured data** for jobs, products, events and companies.',
          'A **sitemap** and **robots** rules behind an indexing switch, keeping suspended organisations out of the sitemap.',
          'Listing ids accepted as permalinks and redirected to their readable slug.',
        ],
      },
      {
        title: 'Security boundaries',
        text: 'Audited the session, route and **Row Level Security** boundaries and revoked grants nobody needed. Data changes ship as forward-only **migrations**, with database types regenerated against the CI-pinned Supabase CLI.',
      },
    ],
    sidebarNote:
      'Startup team: Jira sprints, pull request review, and Postgres Row Level Security as the security boundary.',
  },
  {
    slug: 'infrastructure-dev-intern',
    layer: 'Platforms',
    period: 'MAY 2026 — PRESENT',
    title: 'Infrastructure Dev Intern',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/ai-intro01.png`,
    imageAlt: 'Infrastructure development and automation',
    imageContain: false,
    highlights: [
      'Shipped a **production** intake platform replacing a legacy Excel process — **Next.js**, **PostgreSQL**, **Entra SSO**.',
      'Automated ticket intake across **10+ service areas** with **n8n** and a tested **Python** mailbox-to-**Taiga** service.',
      '**Zero-data-loss** migration of n8n and DocuSeal, cutting recovery time from **20–30 min** to **under 10**.',
    ],
    timelineBullets: [
      'Replaced a legacy **Excel**-based Commercial Wireless Services intake process by designing and shipping a production full-stack tracking system — **Next.js 15**, **React 19**, **Prisma**, **PostgreSQL 16**, **Docker** — with an **eight-status request lifecycle**, role-based access across **4 global and 5 request-level roles**, **Microsoft Entra SAML SSO**, and full-text search across every request field.',
      'Eliminated manual shared-mailbox triage by building a scheduled **Python** service that reads **Microsoft 365** mail via **Microsoft Graph**, deduplicates processed messages, auto-creates and routes **Taiga** tickets, and posts **Teams** notifications — hardened by **25 automated tests** and a safe-by-default dry-run mode before production rollout.',
      'Reduced ticket intake overhead across **10+ infrastructure service areas** by designing and deploying an **n8n** automated routing workflow that eliminated duplicate creation and centralized unassigned work into a shared queue—validated against **25+ production-ready NetOps tickets** under SSC change-control approval.',
      'Achieved zero-data-loss platform migration of **n8n** (**7 active workflows**) and **DocuSeal** from **dev01** to **app01**—verified across **120 templates**, **251 completed documents**, and **494 storage objects** via database dump/restore, blob sync, and row-count parity checks—cutting deployment recovery time from **20–30 min** to **under 10 min**.',
    ],
    roleContext:
      'Operated inside SSC platform engineering under federal change-control constraints—every deployment touched production-facing services requiring documented testing, approval workflows, and service-owner sign-off before going live. Scope spanned full-stack application delivery (**Next.js**, **Prisma**, **PostgreSQL**), mailbox automation (**Python**, **Microsoft Graph**, **Taiga**), and platform work across **n8n**, **DocuSeal**, **Ansible AAP**, **GitLab CI**, and **HashiCorp Vault** alongside internal ITSM and ticketing systems. Work involved **Docker**-based container deployments, **Microsoft Entra SAML SSO** integration, and multi-hop **SSH** jump configurations across SSC network boundaries—all reviewed against the security baseline prior to production rollout.',
    detailDepth: [
      {
        title: 'CWS Intake App — production intake platform',
        text: 'A full-stack replacement for the legacy **Excel**-based Commercial Wireless Services intake process, built with **Next.js 15**, **React 19**, **Prisma**, **PostgreSQL 16**, **Docker**, and **Zod** — **22 API route files**, **10 Prisma models**, **17 enums**, and **16 database migrations** — now in production use, converting unstructured spreadsheet workflows into a searchable, filterable, role-aware request tracking system.',
        bullets: [
          'Structured request lifecycle across **8 statuses** — **draft → submitted → in review → awaiting client → procurement → implementation → complete/cancelled** — the foundation for operational dashboards, audit history, and standardized service-delivery tracking.',
          'Protected client collaboration links with token/password access, expiry handling, encrypted invite secrets, email delivery, save-progress support, and a send-back-to-SSC workflow — validated by **48 automated test cases** across unit and E2E coverage.',
          'Role-based access engineered for **4 global user roles** and **5 request membership roles** — separating **Admin**, **SSC**, **Client**, and **GC WiFi** permissions across internal routes, APIs, and protected external links, with unauthorized protected-link edits rejected again at the API layer.',
          'Multi-building and campus request support backed by dedicated **CwsBuilding**, **CoverageArea**, and **CablingAssessment** models — one intake record manages multiple buildings with per-building coverage areas, cabling assessments, access details, support data, and file attachments.',
          '**Microsoft Entra SAML SSO** alongside environment-driven local authentication: signed HTTP-only sessions, logout handling, protected routes, and configurable dev/prod auth behavior.',
          'Audit tracking across **5 audit categories** and **8 audit sources** — field-level change history, actor tracking, review acknowledgements, and protected-link activity for request ownership and operational accountability.',
          '**PostgreSQL** full-text search and trigram indexes across request text, departments, civic addresses, contacts, floors, notes, and site details — fast dashboard filtering and request lookup.',
          'Release hardening through **5 quality gates**: **TypeScript** typecheck, production build, **Vitest** unit tests, **Playwright** E2E tests, and local smoke testing through `/api/health` — plus deployment docs covering the **Docker** pre-production flow, certificate handling, and regression matrices.',
        ],
      },
      {
        title: 'Mailbox-to-Taiga integration',
        text: 'A scheduled **Python** automation service — **10 source modules**, **7 test files** — that reads a **Microsoft 365** shared mailbox through **Microsoft Graph**, parses incoming requests, deduplicates processed mail, and creates **Taiga** issues or user stories — replacing manual mailbox triage with auditable automation.',
        bullets: [
          'Safe-by-default **dry-run mode** logs intended Taiga payloads without creating tickets or marking mail processed — controlled validation before anything went live.',
          'Duplicate prevention keyed on both **Graph message IDs** and internet message IDs — validated by automated duplicate-detection tests, so repeated mailbox scans never create duplicate tickets.',
          'Configurable routing: single-domain matches assigned directly to owners, ambiguous or unmatched work routed to a shared bin user — with **Taiga** project membership validated before live creation, so tickets are never created unassigned when configured users are missing.',
          '**Teams** notifications for newly created tickets plus daily reminders for open bin-assigned work — unassigned requests don\'t sit unnoticed.',
          'Least-privileged **Microsoft Graph** client using **Mail.Read** scope for mailbox reads, attachment discovery, retry handling, and optional mark-as-read behavior.',
          '**25 automated Python tests** covering parsing, routing, assignment, duplicate prevention, persistence, Taiga assignment resolution, and **Teams** webhook behavior — plus deployment docs for **Linux VM** setup, **cron** installation, dry-run validation, and first-live-ticket testing.',
        ],
      },
      {
        title: 'n8n on app01',
        text: '**n8n** runs internal workflow automation on SSC container standards. Moving off **dev01** meant rebuilding the **Docker**-based app stack on **app01**, restoring workflow DB state, and proving **HTTPS** through the production reverse-proxy chain—not lifting the old VM image.',
      },
      {
        title: 'DocuSeal on app01',
        text: '**DocuSeal** runs on a custom **SSC Docker** image with a **PostgreSQL** backend. Cutover required rebuilding the image on **app01**, performing a database dump/restore, syncing blob storage, and running row-count parity checks across **120 templates**, **117 submissions**, **251 completed documents**, and **494 storage objects** before the DNS flip — every count verified before go-live, not assumed.',
      },
    ],
    sidebarNote:
      'Federal infrastructure context: pre-production rigor, change control, and coordination with platform owners before production rollout.',
  },
  {
    slug: 'netdevops-intern',
    layer: 'Automation',
    period: 'APR 2025 — APR 2026',
    title: 'NetDevOps Intern',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/aap-logo.png`,
    imageAlt: 'Ansible Automation Platform logo',
    imageContain: true,
    highlights: [
      'Cut certificate provisioning from **20–30 min** to **under 2** with a reusable **Ansible** role.',
      'Cut incident detection from **hours to minutes** by gating **GitLab CI/CD** on **Zabbix** health checks.',
      'Automated health polling for **75+ devices**; a **REST API** audit found **132** inactive GitLab accounts.',
    ],
    timelineBullets: [
      'Reduced platform licensing costs by identifying **132 inactive accounts** across the full organizational **GitLab** instance—delivering a prioritized deactivation plan to platform admins—by engineering a **REST API** audit script that systematically covered the complete account scope.',
      'Improved network health coverage across **75+ devices** by building **Ansible** playbooks that automated continuous polling and alert triggering, replacing manual checks that previously left off-hours anomalies undetected.',
      'Cut **SSL/TLS certificate provisioning from 20–30 minutes to under 2 minutes** per request by building a reusable **Ansible** role that automates CSR generation, private key handling, and **OpenSSL** configuration for **Azure**-compatible SSC environments.',
      'Cut incident detection lag **from hours to minutes** across **dev, staging, and prod** by integrating **Zabbix** real-time monitoring into **GitLab CI/CD** pipeline gates—ensuring degraded device health blocked deployments before advancing to the next environment tier.',
      'Improved automation reliability by refactoring **20+ Ansible playbooks** and automating **15 network monitoring jobs**—eliminating **30%** of redundant execution steps—through a structured audit of the production playbook library consumed daily by SSC network operations.',
    ],
    roleContext:
      "Embedded in SSC's NetDevOps practice alongside senior engineers who owned the **Ansible Automation Platform** and live monitoring stack. Scope covered improving a production playbook library (**20+ playbooks**, **75+ polled devices**), integrating **Zabbix** into **CI/CD** pipeline gates, and replacing a manual **OpenSSL** certificate workflow with a reusable **Ansible** role—not one-off fixes, but changes the ops team depended on daily. Automation work applied **Python** scripting, **REST API** integration, and **GitLab CI** pipeline configuration; all changes were version-controlled and peer-reviewed before pipeline deployment. The **GitLab API** audit required designing a programmatic approach to traverse the full organizational account scope and coordinate deactivation timing with platform admins to avoid disrupting active teams.",
    detailDepth: [
      {
        title: 'Zabbix + CI/CD pipeline integration',
        text: 'Zabbix had been running as a standalone monitoring tool—alerts existed but nothing acted on them in the pipeline. Wired **Zabbix** health checks into **GitLab CI** gates across **dev, staging, and prod** so a degraded device could block a deployment before it reached the next tier. The integration required mapping Zabbix host groups to pipeline environment variables so the same job template worked across tiers without hardcoded thresholds.',
      },
      {
        title: 'SWLINUXPatching / Azure CSR automation',
        text: 'Replaced a manual **OpenSSL** certificate workflow with **Ansible** automation across **5 roles** — playbooks, templates, role defaults, and an **OpenSSL Jinja2** template that generate **Azure**/TLS Protect–compatible CSR and private-key artifacts — then extended the same role structure into Linux patching validation.',
        bullets: [
          'Certificate request prep dropped from a **20–30 minute** manual OpenSSL process to a repeatable role-driven run generating the standardized OpenSSL config, private key, and CSR in the expected **TLS Protect/Azure** format.',
          'Validation workflows for **14 documented Linux servers** across **Barrie EC63** and **Borden EC04** environments — health checks spanning primary, secondary, backup, jump, and lab infrastructure groups.',
          'Documented separate login models for **12 netops-managed servers** and **2 personal BOKS-access servers**, plus manual restart requirements — repeatable post-maintenance validation during patching windows.',
          'Structured inventory, host variables, and role-specific tasks so patching checks can be rerun and adapted across multiple SSC server environments.',
        ],
      },
      {
        title: 'Multi-hop Ansible to GitLab',
        text: '**SWLINUX** certificate output cannot reach **git02** directly from a single network hop. Playbooks chain **devHost** as a jump host through the inventory into **Azure GitLab** using **SSH proxy** settings — so the same Ansible role run publishes CSRs and keys to the correct project namespace for production-style rollout without manual file transfer.',
      },
      {
        title: 'Ansible Forms assessment',
        text: 'Assessed **Ansible Forms** as a self-service front end for approved cross-team automation. Mapped which requests could safely become parameterized job templates—read-only health checks first, then constrained operational changes—documented inventory and credential scope boundaries, and delivered a phased rollout plan that senior engineers approved before any change reached the production **Ansible AAP** environment.',
      },
    ],
    sidebarNote:
      "Worked inside SSC's NetDevOps practice with **Ansible Automation Platform**, engineering leads, and ops teams who consumed reports and pipeline gates.",
  },
  {
    slug: 'lan-operations-technician',
    layer: 'Network',
    period: 'MAY 2024 — APR 2025',
    title: 'LAN Operations Technician',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/ssc-switch-upgrade.png`,
    imageAlt: 'Abdul Rehman Baseem upgrading switches in a network environment',
    highlights: [
      'Brought **50+ Juniper switches** into security baseline compliance with scripted firmware upgrades.',
      '**~40%** faster bridge-call resolution across **10+ NCR sites** with standardized topology docs.',
    ],
    timelineBullets: [
      'Brought **50+ Juniper EX-4300** switches into full **security baseline compliance** by scripting a **Linux**-based batch firmware upgrade that automated push and post-install version validation across multiple NCR sites—eliminating per-device manual upgrades and remediating **CVE**-flagged vulnerabilities during approved maintenance windows.',
      'Reduced bridge call resolution time by **~40%** across **10+ NCR sites** by designing **Visio** topology diagrams—formally adopted by field technicians as the single source of truth—that centralized subnet tables, physical layouts, and device inventory previously scattered across inconsistently named file shares.',
    ],
    roleContext:
      "Worked hands-on in SSC's National Capital Region LAN operations—coordinating with field technicians, the ops center, and security teams during live incidents. Interfaced with security on **vulnerability remediation** timelines (**CVE** tracking and baseline sign-off) and with operations planners on documentation standards. The firmware upgrade scope required scripting a repeatable **Linux** process across **50+ Juniper EX-4300** devices without disrupting live traffic, accounting for maintenance windows and rollback procedures. Topology documentation formally replaced per-site file shares with no consistent format, cutting the lookup overhead field technicians reported spending during incidents by roughly 40%.",
    detailDepth: [
      {
        title: 'Centralized site documentation',
        text: 'Configs, topology drawings, and switch inventory for **10+ NCR sites** had lived in separate, inconsistently named file shares. Built a single indexed reference per site—subnet tables, physical layout diagrams, and device lists in one place. Ops teams reported roughly **40%** less time spent hunting for answers during bridge calls.',
      },
      {
        title: 'Firmware upgrade scripting',
        text: 'Upgrading **50+ Juniper EX-4300** devices manually would have required a technician at each device across multiple NCR sites. Wrote **Linux shell scripts** to push firmware bundles, validate post-install versions, and log per-device status—enabling batch execution during approved maintenance windows and producing an audit trail for **security baseline sign-off** and **CVE** remediation documentation.',
      },
    ],
    sidebarNote:
      'NCR LAN operations: coordination with field technicians, ops planners, and security baseline expectations on government-managed switching.',
  },
]

const EXTRACURRICULARS = [
  {
    org: "Carleton University Muslim Students' Association",
    logo: `${BASE}images/msa-logo.png`,
    role: 'Resource Director, Islamic Awareness Week',
    period: 'Aug 2026 – Present',
    cause: 'Education',
    previous: 'Previously Volunteer, Sep 2024 – Aug 2026',
    href: 'https://cumsa.ca',
  },
  {
    org: 'Human Concern International',
    logo: `${BASE}images/hci-logo.svg`,
    role: 'Volunteer',
    period: 'Jan 2021 – Present',
    cause: 'Disaster and Humanitarian Relief',
    text: 'Sending medical equipment and aid boxes to Lebanon, and raising awareness of Indigenous injustices.',
    href: 'https://humanconcern.org',
  },
  {
    org: 'Penny Appeal Canada',
    logo: `${BASE}images/pennyappeal-logo.svg`,
    role: 'Community Volunteer',
    period: 'May 2021 – 2024',
    cause: 'Poverty Alleviation',
    text: "Supported Penny Appeal's work with less fortunate communities.",
    href: 'https://pennyappeal.ca',
  },
  {
    org: 'Relay For Life',
    logo: `${BASE}images/relayforlife-logo.png`,
    role: 'Member',
    period: 'Dec 2022 – Jun 2023',
    cause: 'Health',
    text: 'Raised money to fund cancer research and support people affected by cancer.',
    href: 'https://www.relayforlife.ca',
  },
]

const SKILLS = {
  Networking: ['Cisco IOS', 'Juniper Junos', 'BGP', 'OSPF', 'EIGRP', 'MPLS', 'VLANs'],
  'Automation & Infrastructure': ['Ansible', 'Docker', 'GitLab CI/CD', 'Zabbix', 'Linux', 'Azure'],
  Development: ['Python', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Supabase'],
}

const PROJECTS = [
  {
    name: 'VisionCompanion',
    slug: 'visioncompanion',
    year: '2026',
    description:
      'AI walking companion for blind and low-vision pedestrians. The phone\'s rear camera snapshots the street every 0.8 s, Gemini flags hazards — potholes, curbs, construction, traffic signals — and pre-recorded ElevenLabs voice clips announce them through open-ear headphones about 2 seconds after they appear. A hazard map built from ~1,500 open City of Ottawa 311 reports warns about damage reported ahead. Built at Hack the Hill III.',
    tags: ['Gemini', 'ElevenLabs', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL'],
    featured: true,
    image: `${BASE}images/visioncompanion-logo.png`,
    fallback: `${BASE}images/visioncompanion-logo.png`,
    imagePosition: 'center center',
    github: 'https://github.com/dkabduli/VisionCompanion',
    external: 'https://visioncompanion.vercel.app',
    externalLabel: 'Live app',
    detailMeta: ['AI accessibility PWA · Team Goobers', 'Hack the Hill III — Sept 2026', 'Vercel + Tiger Data'],
    overviewTitle: 'What it is',
    flowTitle: 'How a walk works',
    deepDiveTitle: 'Engineering decisions',
    screenshotsIntro: 'Home screen, hazard map, and the signal path from camera to ear.',
    sidebarNarrativeTitle: 'Why it exists',
    sidebarTraitsTitle: 'Technical notes',
    sidebarNarrative:
      'A white cane finds the ground — VisionCompanion finds everything else: hazards announced before the walker reaches them, silence about everything that doesn\'t matter.',
    summary:
      'A hands-free pipeline that runs continuously while walking: snapshots go to **Gemini** for hazard analysis (median **2.0 s**), the phone decides whether the result deserves a voice, and **ElevenLabs** clips play instantly through open-ear headphones. Two snapshots stay in flight at once, so a fresh look at the street arrives about every second. Voice commands ("VisionCompanion, what\'s ahead?") answer in a median **2.5 s**, and a **Tiger Data** (PostgreSQL + TimescaleDB) hazard map layers in ~**1,500** City of Ottawa 311 reports for GPS alerts like "lifted or sunken sidewalk panel reported about 40 metres ahead." Fully bilingual — English and French across screen, voice, and commands — with VoiceOver support and a large-text mode for low-vision users.',
    humanSummary: [
      {
        label: 'Live app',
        value: 'visioncompanion.vercel.app',
      },
      {
        label: 'Repository',
        value: 'github.com/dkabduli/VisionCompanion',
      },
    ],
    incidentFlow: [
      {
        title: '1. Capture',
        text: 'The rear camera takes a 768 px snapshot every 0.8 s with the phone hung on the chest. Two requests stay in flight simultaneously so coverage never gaps while an answer is pending.',
      },
      {
        title: '2. Analyze',
        text: 'Each snapshot goes to Gemini with a strict hazard rubric: stop signs, potholes, steps, doors, construction, head-height obstacles, crosswalks, and traffic lights within 10–15 m.',
      },
      {
        title: '3. Decide',
        text: 'The phone filters for what deserves a voice — each hazard is announced once per 30–45 s, trip hazards get a second warning under 2 m, and uncertain detections are never announced.',
      },
      {
        title: '4. Speak',
        text: 'Pre-recorded ElevenLabs clips play instantly; live questions get synthesized speech in 0.36 s. After 10 quiet seconds, an ambient description ("Before you, a wide sidewalk with trees") confirms the system is alive.',
      },
    ],
    deepDive: [
      'Model choice was measured, not assumed: the larger Gemini model took **3.9–37.7 s** per frame — the Flash-Lite tier\'s ~**2 s** median is what makes real-time walking alerts possible.',
      '**478** pre-recorded voice clips across **4 voices and 2 languages** cover the full hazard vocabulary, eliminating synthesis latency on the critical path.',
      'People, cars, and chairs are deliberately excluded from automatic alerts — in early tests they drowned out the hazards that matter. The app informs but never commands: it will not say "go," "clear," or "safe."',
      'GPS hazard warnings compute "distance minus accuracy" so alerts fire early rather than late, and snapshots are discarded immediately after analysis for privacy.',
      'Shipped with **186** phone tests and **91** server tests; the FastAPI backend on Vercel is rate-limited to 400 requests/minute.',
    ],
    screenshots: [
      {
        src: `${BASE}images/visioncompanion-near-me.jpg`,
        alt: 'VisionCompanion home screen with usage steps, a potholes-near-me answer, and the Start walk button',
        eyebrow: 'Home screen',
        title: 'Street mode & voice answers',
        caption: '"Potholes near me" answered with distances and addresses before leaving home.',
      },
      {
        src: `${BASE}images/visioncompanion-hazard-map.jpg`,
        alt: 'VisionCompanion hazard map of downtown Ottawa with pothole, uneven pavement, and crossing signal filters',
        eyebrow: 'Hazard map',
        title: 'Ottawa 311 reports, mapped',
        caption: 'Open 311 reports and walker-reported hazards stored in Tiger Data, filterable by type and age.',
      },
      {
        src: `${BASE}images/visioncompanion-signal-path.png`,
        alt: 'Diagram of the VisionCompanion pipeline from camera to Gemini to ElevenLabs to headphones',
        eyebrow: 'Architecture',
        title: 'Camera to ear in ~2 seconds',
        caption: 'Photo → Gemini hazard analysis → decision layer → ElevenLabs voice → open-ear headphones.',
      },
    ],
    sidebarFacts: [
      'Median 2.0 s snapshot analysis · ~2 s hazard-to-heard latency',
      '478 pre-recorded clips — 4 voices, English + French',
      '186 phone + 91 server automated tests',
      'Never claims "safe to cross" — informs, never commands',
    ],
  },
  {
    name: '5G Network Slicing Capstone',
    slug: '5g-network-slicing',
    year: '2026–27',
    status: 'Ongoing',
    description:
      'Capstone team project: three isolated 5G network slices (passenger broadband, ultra-low-latency station safety and operator management) sharing one physical backhaul, built with Free5GC, UERANSIM and Containerlab. Per-slice QoS cut the safety slice\'s latency from 53.9 ms to 0.10 ms while another slice flooded the link, and isolation tests show no cross-slice reachability.',
    tags: ['5G Core', 'Free5GC', 'Containerlab', 'FRR', 'Linux QoS', 'Python'],
    image: `${BASE}images/capstone-3d-map.jpg`,
    fallback: `${BASE}images/capstone-network-overview.jpg`,
    imagePosition: 'center center',
    github: null,
    external: null,
    detailMeta: ['NET 4901 Capstone · Carleton University', 'Team of 5 · Supervisor: Prof. Ashraf Matrawy', '2026–27 · in progress'],
    overviewTitle: 'What it is',
    flowTitle: 'How isolation is enforced',
    deepDiveTitle: 'What we measured',
    screenshotsIntro: 'Figures from the project repository.',
    sidebarNarrativeTitle: 'Why it matters',
    sidebarTraitsTitle: 'Highlights',
    sidebarNarrative:
      'If slices share the same hardware, is the separation real? The project answers with measurements, not diagrams: a compromised device on the passenger slice cannot reach the safety systems, and cannot slow them down by flooding the link.',
    summary:
      'A shared mobile network has to serve customers with incompatible needs: passengers want bandwidth, safety systems want near-zero delay, and the operator\'s own systems must always work. **5G network slicing** runs separate logical networks over the same hardware. The project builds three slices for an O-Train station (**eMBB** passenger broadband, **URLLC** station safety and dispatch over MQTT, and an operator **management** slice for billing and monitoring), each separated end to end from the radio to its own data network, and measures whether that separation holds up under attack.',
    humanSummary: [
      {
        label: 'Status',
        value: 'In progress · phase 1 transport lab verified',
      },
      {
        label: 'Stack',
        value: 'Free5GC v4.2.3 · UERANSIM · Containerlab · FRR',
      },
    ],
    incidentFlow: [
      {
        title: '1. Access',
        text: 'One routing table per slice, chosen by ingress port, plus anti-spoofing ACLs: a device forging another slice\'s address is dropped at the access router.',
      },
      {
        title: '2. Transport',
        text: 'A VRF per slice with no route leaking, explicit source filters, and a per-slice HTB queue so a flood in one slice cannot starve another.',
      },
      {
        title: '3. Core',
        text: 'A separate UPF and data network per slice, with each subscriber permitted only its own slice. Configured, with validation on the full 5G core in progress.',
      },
    ],
    deepDive: [
      'With one slice saturating the shared **200 Mbit/s** backhaul, per-slice **HTB** queues cut the safety slice\'s median latency from **53.90 ms** to **0.10 ms**, **518×** lower, while the flooding slice\'s own throughput rose from 177 to **193 Mbit/s**.',
      'The guarantee held flat from **1 to 50** concurrent sessions per slice: about **0.13 ms** for the safety slice versus **57 ms** on a shared queue, with Jain fairness of **0.999** or better.',
      'Isolation tests regenerate on every run: each slice reaches only its own services, all **6** device-to-device paths are blocked, and **5/5** spoofed packets are dropped at the access router.',
      'Next: running the full **Free5GC** core with **UERANSIM** on a department lab server, to test slice admission, registration load and control-plane security.',
    ],
    screenshots: [
      {
        src: `${BASE}images/capstone-network-overview.jpg`,
        alt: 'Diagram of passengers, station safety systems and the operator sharing one 5G network split into three slices',
        eyebrow: 'Architecture',
        title: 'One network, three slices',
        caption: 'An O-Train station: passengers, station safety systems and the operator share one physical network.',
      },
      {
        src: `${BASE}images/capstone-qos-contention.png`,
        alt: 'Chart of safety-slice round-trip time with a shared queue versus per-slice HTB while another slice floods the backhaul',
        eyebrow: 'Measured result',
        title: 'Safety-slice latency under a flood',
        caption: 'Shared queue versus per-slice HTB while the broadband slice saturates the backhaul.',
      },
      {
        src: `${BASE}images/capstone-scale-latency.png`,
        alt: 'Chart of safety-slice latency staying flat from 1 to 50 concurrent sessions',
        eyebrow: 'Scale test',
        title: 'Flat from 1 to 50 sessions',
        caption: 'The latency guarantee does not erode as sessions are added.',
      },
    ],
    sidebarFacts: [
      '518× lower latency for the safety slice under load',
      'No cross-slice reachability; 5/5 spoofed packets dropped',
      'Free5GC, UERANSIM and Containerlab',
      'Team of 5, supervised by Prof. Ashraf Matrawy',
    ],
  },
  {
    name: 'Shop Elsewhere Arnprior',
    slug: 'shop-elsewhere-arnprior',
    year: '2026',
    status: 'Client project',
    description:
      'Freelance e-commerce site for a small Arnprior business selling native plants and organic sourdough. Customers browse the catalogue, reserve plants, book a pickup slot for baked goods and pay at pickup, while the owners run products, bake batches, inventory, orders and pickup slots from their own admin dashboard.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Resend', 'Vercel'],
    image: `${BASE}images/shop-elsewhere-home.jpg`,
    fallback: `${BASE}images/shop-elsewhere-home.jpg`,
    imagePosition: 'left center',
    github: null,
    external: 'https://shop-elsewhere-arnprior.vercel.app',
    externalLabel: 'Live preview',
    detailMeta: ['Freelance client project', 'Arnprior, Ontario', 'Next.js 16 · Supabase · Resend'],
    overviewTitle: 'What it is',
    flowTitle: 'How it works',
    deepDiveTitle: 'Build notes',
    screenshotsIntro: 'The live storefront.',
    sidebarNarrativeTitle: 'Why it exists',
    sidebarTraitsTitle: 'Highlights',
    sidebarNarrative:
      'A small seasonal business needs ordering that fits how it actually works: no online payments, no customer accounts, and stock that arrives in batches.',
    summary:
      'Shop Elsewhere grows Ontario wildflowers from seed and bakes organic sourdough in a certified home kitchen. The site gives them a real ordering flow built around a two-person seasonal business: **pay at pickup**, guest checkout with no accounts, plant reservations before stock is ready, and baked goods ordered against a **pickup slot**.',
    humanSummary: [
      {
        label: 'Live preview',
        value: 'shop-elsewhere-arnprior.vercel.app',
      },
      {
        label: 'Client',
        value: 'Native plant nursery and home bakery in Arnprior, ON',
      },
    ],
    incidentFlow: [
      {
        title: '1. Browse',
        text: 'A catalogue of native plants, baked goods and garden transplants with stock status, plus notify-me sign-ups for items that are not available yet.',
      },
      {
        title: '2. Order',
        text: 'Guest cart and checkout with a pickup date and time slot. Each order gets its own private tracking link.',
      },
      {
        title: '3. Run the shop',
        text: 'An admin dashboard for products, bake batches, inventory, orders, pickup slots, garden design inquiries and shop settings.',
      },
    ],
    deepDive: [
      'Data model in **Supabase Postgres** across **5** migrations, with bake batches kept separate from products so several future bakes can be scheduled at once.',
      'Notify-me emails sent through **Resend**, with one-click unsubscribe.',
      'Launched with the owners\' first **21** products, their own photography and a photo credits page.',
      'Redesigned the storefront around the owners\' photography and local identity, away from a generic template look.',
    ],
    screenshots: [
      {
        src: `${BASE}images/shop-elsewhere-home.jpg`,
        alt: 'Shop Elsewhere Arnprior homepage: "Native plants & sourdough from Arnprior" over a photo of wildflowers and a monarch butterfly',
        eyebrow: 'Storefront',
        title: 'Homepage',
        caption: 'Order online, pay at pickup in Arnprior.',
      },
    ],
    sidebarFacts: ['Pay at pickup, guest checkout', 'Admin dashboard with 7 sections', 'Next.js 16, Supabase and Resend on Vercel'],
  },
  {
    name: 'BlackBoxNet',
    slug: 'blackboxnet',
    year: '2026',
    description:
      'Full-stack network replay platform with 12 scripted multi-vendor outage labs across Cisco, Juniper, and Nokia. Step through T1→T5, investigate live topology, correlate root cause from semantic config diffs, and replay what changed before the failure — deployed with GitHub Actions CI on Render.',
    tags: ['FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Git'],
    image: `${BASE}images/blackboxnet-dashboard.png`,
    fallback: `${BASE}images/blackboxnet-dashboard.png`,
    imagePosition: 'center center',
    github: 'https://github.com/dkabduli/BlackBoxNet',
    external: 'https://blackboxnet-web.onrender.com',
    externalLabel: 'Live demo',
    detailMeta: ['Full-stack · Author: Abdul Rehman', '12 scripted outage scenarios', 'Render + Neon'],
    overviewTitle: 'What it is',
    pillarsTitle: 'Features',
    flowTitle: 'Live demo walkthrough',
    deepDiveTitle: 'Architecture',
    screenshotsIntro: 'UI captures from the product; open the live demo for current behavior.',
    sidebarNarrativeTitle: 'Why it exists',
    sidebarTraitsTitle: 'Technical notes',
    sidebarNarrative:
      'Like a flight recorder for network state: replay what changed before an outage instead of reconstructing it from scattered logs.',
    summary:
      'End-to-end platform designed and built from scratch: scripted outages replay step-by-step, config history is Git-backed with per-commit snapshots, and a vendor-specific rules engine correlates which change caused the failure. All state is namespaced by scenario_id so vendor switching and resets never corrupt an active lab. Currently deployed on Render with Neon PostgreSQL.',
    humanSummary: [
      {
        label: 'Live demo',
        value: 'blackboxnet-web.onrender.com',
      },
      {
        label: 'Repository',
        value: 'github.com/dkabduli/BlackBoxNet',
      },
    ],
    incidentFlow: [
      {
        title: '1. Pick vendor & scenario',
        text: 'Use the header next to BlackBoxNet to choose Cisco, Juniper, or Nokia. On the dashboard, pick a scenario (e.g. ACL Regression, LDP Collision). Each switch resets that scenario to T1 (with confirmation if you had progress).',
      },
      {
        title: '2. Run T1 → T5',
        text: 'On the simulation card, click Run T1 through Run T5. Each step collects snapshots and events into Postgres and Git for that scenario_id only.',
      },
      {
        title: '3. Investigate',
        text: 'Open the incident for timeline, root-cause summary, and semantic diff. Topology highlights impacted subnets, device health, and annotations (e.g. rogue STP switch, LFIB collision).',
      },
      {
        title: '4. Reset & explore',
        text: 'Reset replays the active scenario from T1. Try Juniper BGP hold-time or Nokia SDP blackhole to see different layouts and correlation rules.',
      },
    ],
    deepDive: [
      '**scenario_id** namespacing on all API routes, database queries, and Git commit paths — reset or vendor switch never corrupts another active lab\'s state.',
      'Topology diagrams and failure narratives live in JSON fixtures — adding a new lab extends data, not React layout code.',
      'Shipped with **14** API endpoint tests and a production frontend build gate in **GitHub Actions** CI on every push to main.',
    ],
    screenshots: [
      {
        src: `${BASE}images/blackboxnet-dashboard.png`,
        alt: 'BlackBoxNet dashboard with Nokia VPRN scenario, topology preview, and T1–T5 simulation',
        eyebrow: 'Dashboard',
        title: 'Multi-vendor dashboard',
        caption: 'Nokia VPRN leak scenario on the public Render deployment.',
      },
      {
        src: `${BASE}images/blackboxnet-incident.png`,
        alt: 'BlackBoxNet incident summary and correlation analysis screen',
        eyebrow: 'Incident investigation',
        title: 'Root cause & correlation',
        caption: 'Correlation narrative before the raw unified diff.',
      },
      {
        src: `${BASE}images/blackboxnet-outage.png`,
        alt: 'BlackBoxNet root cause and investigation timeline screen',
        eyebrow: 'Evidence layer',
        title: 'Timeline + config diff',
        caption: 'Event order tied to Git-backed config comparison.',
      },
    ],
    sidebarFacts: ['Semantic diff parsers per vendor (IOS, Junos, SR OS)', 'GitHub Actions CI on push to main', 'API docs on Render'],
    resourceLinks: [{ label: 'API docs', href: 'https://blackboxnet-api.onrender.com/docs' }],
  },
  {
    name: 'IPv6 EIGRP Network',
    slug: 'ipv6-eigrp-network',
    year: '2024',
    description:
      'IPv6 routing lab exploring EIGRP control-plane behavior on a multi-router Cisco topology — classic and named modes, passive interfaces, route summarization, MD5/HMAC-SHA-256 authentication, and verification-first methodology that explains why routes appear and disappear rather than just pasting config.',
    tags: ['IPv6 EIGRP', 'Routing tuning & security', 'Topology documentation'],
    image: `${BASE}images/ipv6-network.png`,
    fallback: `${BASE}images/ipv6-network-placeholder.svg`,
    imagePosition: 'center center',
    github: null,
    external: null,
    detailMeta: ['Advanced routing lab', 'IPv6 control-plane tuning', 'Cisco Packet Tracer'],
    overviewTitle: 'Overview',
    pillarsTitle: 'What the lab covered',
    flowTitle: 'Lab sequence',
    deepDiveTitle: 'What I validated',
    screenshotsIntro: 'Topology and configs from the Packet Tracer lab.',
    sidebarNarrativeTitle: 'Why it matters',
    sidebarTraitsTitle: 'Verification',
    summary:
      'Advanced **Cisco Packet Tracer** lab focused on IPv6 routing control-plane decisions — when to suppress adjacencies using passive interfaces, how route summaries propagate across the topology, and how **MD5** and **HMAC-SHA-256** authentication changes what appears in the routing and topology tables. Every conclusion is drawn from `show ipv6 eigrp` verification output, not assumed from config.',
    humanSummary: [
      {
        label: 'Environment',
        value: 'Cisco Packet Tracer — multi-router IPv6 with VLANs and loopbacks.',
      },
      {
        label: 'Configs',
        value: 'R1, R2, R3, D1, D2 — linked below.',
      },
    ],
    incidentFlow: [
      {
        title: '1. Bring up adjacencies',
        text: 'IPv6 unicast routing, router IDs, and interface participation across classic and named **EIGRP for IPv6** models.',
      },
      {
        title: '2. Control advertisements',
        text: 'Passive interfaces, default-route injection, and loopback summarization to limit unnecessary protocol exposure.',
      },
      {
        title: '3. Secure and prove it',
        text: '**MD5** and **HMAC-SHA-256** on links, then neighbor, interface, and route verification with `show ipv6 eigrp` commands.',
      },
    ],
    deepDive: [
      'Compared **static default redistribution** versus **summary default injection** and verified how each propagates differently in the IPv6 EIGRP topology table across R1, R2, and R3.',
      'Applied route summarization on loopback addresses and validated the downstream reachability impact on R2 and R3 routing tables using `show ipv6 route`.',
    ],
    screenshots: [
      {
        src: `${BASE}images/ipv6-network.png`,
        alt: 'IPv6 EIGRP network topology in Cisco Packet Tracer',
        eyebrow: 'Routing topology',
        title: 'Multi-router IPv6 EIGRP lab',
        caption:
          'The topology includes routed links, VLAN subinterfaces, loopbacks, and downstream segments so protocol behavior can be validated across more than a simple point-to-point setup.',
      },
    ],
    sidebarNarrative: 'Goal: reason about EIGRP behavior from `show` command output — understand why routes appear and disappear, not just apply config and move on.',
    sidebarFacts: ['Classic vs. named EIGRP for IPv6', 'MD5 and HMAC-SHA-256 authentication verified', 'Route summarization and default injection validated'],
    configLinks: [
      { label: 'Router R1 configuration', href: `${BASE}configs/eigrp/r1.txt` },
      { label: 'Router R2 configuration', href: `${BASE}configs/eigrp/r2.txt` },
      { label: 'Router R3 configuration', href: `${BASE}configs/eigrp/r3.txt` },
      { label: 'Switch D1 configuration', href: `${BASE}configs/eigrp/d1.txt` },
      { label: 'Switch D2 configuration', href: `${BASE}configs/eigrp/d2.txt` },
    ],
  },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>/'

function useScramble(finalText, { duration = 1100, skip = false } = {}) {
  const [text, setText] = useState(finalText)
  useEffect(() => {
    if (skip) { setText(finalText); return }
    let frame = 0
    const totalFrames = Math.floor(duration / 28)
    const id = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setText(
        finalText.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i / finalText.length < progress) return char
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join('')
      )
      if (frame >= totalFrames) { clearInterval(id); setText(finalText) }
    }, 28)
    return () => clearInterval(id)
  }, [finalText, duration, skip])
  return text
}

function AnimatedStat({ value, label }) {
  const shouldReduceMotion = useReducedMotion()
  const match = value.match(/^(\d+)(.*)$/)
  const num = match ? parseInt(match[1]) : 0
  const suffix = match ? match[2] : ''
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (shouldReduceMotion) { count.set(num); return }
    if (!isInView) return
    const controls = animate(count, num, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [isInView, shouldReduceMotion, num, count])

  return (
    <div ref={ref} className={styles.statCard}>
      <strong className={styles.statValue}>
        <motion.span>{rounded}</motion.span>{suffix}
      </strong>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function renderRichText(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className={styles.textStrong}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function hasExperienceDetails(job) {
  return Boolean(job.roleContext || job.detailDepth?.length)
}

const EXPERIENCE_LINKS = EXPERIENCE.filter(hasExperienceDetails).map((job) => ({
  href: `#/${EXPERIENCE_ROUTE_PREFIX}${job.slug}`,
  label: `${job.title} More info`,
  shortLabel: job.title,
}))

const PROJECT_LINKS = PROJECTS.filter((project) => project.slug).map((project) => ({
  href: `#/${PROJECT_ROUTE_PREFIX}${project.slug}`,
  label: `${project.name} More info`,
  shortLabel: project.name,
}))

function getDetailRoute() {
  if (typeof window === 'undefined') return null
  const { hash } = window.location
  if (!hash.startsWith('#/')) return null
  return hash.slice(2)
}

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(ids[0] ?? 'about')

  useEffect(() => {
    /** Last section whose top has passed this line wins — stable for tall #about + #experience. */
    const ACTIVATION_RATIO = 0.26

    const update = () => {
      const y = window.innerHeight * ACTIVATION_RATIO
      let current = ids[0] ?? 'about'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top } = el.getBoundingClientRect()
        if (top <= y) current = id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return activeSection
}

function getNavDropdownLinks(itemId) {
  if (itemId === 'experience') return EXPERIENCE_LINKS
  if (itemId === 'projects') return PROJECT_LINKS
  return []
}

function Section({ id, label, children, className = '', contentClassName = '' }) {
  return (
    <section id={id} className={`${styles.section} ${className}`.trim()}>
      {label ? <p className={styles.sectionLabel}>{label}</p> : null}
      <div className={`${styles.sectionContent} ${contentClassName}`.trim()}>{children}</div>
    </section>
  )
}

function TopologyGraphic() {
  return (
    <svg className={styles.topology} viewBox="0 0 480 480" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M80 108 L220 84 L352 148 L394 286 L302 392 L126 370 L66 232 Z" />
        <path d="M126 370 L220 242 L394 286" />
        <path d="M80 108 L220 242 L302 392" />
        <path d="M220 84 L220 242 L66 232" />
      </g>
      {[
        [80, 108],
        [220, 84],
        [352, 148],
        [394, 286],
        [302, 392],
        [126, 370],
        [66, 232],
        [220, 242],
      ].map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="6" fill="currentColor" />
      ))}
    </svg>
  )
}

function LogoMark() {
  return <span className={styles.logoMark}>ARB</span>
}

function PlaceholderLogo({ src = `${BASE}images/ssc-logo.png` }) {
  return (
    <span className={styles.companyLogoWrap} aria-hidden="true">
      <img src={src} alt="" className={styles.companyLogo} />
    </span>
  )
}

const HERO_PHOTOS = [
  {
    src: `${BASE}images/profile-hero.jpg`,
    alt: 'Abdul Rehman Baseem working in a network rack environment',
    className: 'nodeTopLeft',
  },
  {
    src: `${BASE}images/hero-soccer.png`,
    alt: 'Abdul Rehman Baseem playing soccer indoors',
    className: 'nodeBottomLeft',
  },
  {
    src: `${BASE}images/hero-car.png`,
    alt: 'A black sports car on a city street',
    className: 'nodeRight',
  },
]

function HeroPhotoNodes() {
  return (
    <div className={styles.heroPhotoLayer} aria-hidden="true">
      {HERO_PHOTOS.map((photo) => (
        <figure key={photo.src} className={`${styles.heroNodeCard} ${styles[photo.className]}`}>
          <img src={photo.src} alt={photo.alt} className={styles.heroNodeImage} />
        </figure>
      ))}
    </div>
  )
}

function ProjectImage({ project }) {
  const [src, setSrc] = useState(project.image || project.fallback)

  return (
    <img
      src={src}
      alt={`${project.name} project preview`}
      className={styles.projectImage}
      style={{ objectPosition: project.imagePosition || 'center center' }}
      onError={() => setSrc(project.fallback)}
    />
  )
}

function ContactMethodIcon({ id }) {
  if (id === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className={styles.contactIconSvg} aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm6.86 5.5H8.86V20h3.25v-5.7c0-1.5.28-2.95 2.15-2.95 1.84 0 1.86 1.72 1.86 3.05V20h3.26v-6.27c0-3.08-.66-5.45-4.26-5.45-1.73 0-2.88.95-3.35 1.85h-.05V8.5Z"
        />
      </svg>
    )
  }

  if (id === 'github') {
    return (
      <svg viewBox="0 0 24 24" className={styles.contactIconSvg} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.3 9.42 7.87 10.94.58.11.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.09 1.77 1.19 1.77 1.19 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.19 1.18a10.9 10.9 0 0 1 5.8 0c2.22-1.49 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.54 11.54 0 0 0 23.5 12.03C23.5 5.66 18.35.5 12 .5Z"
        />
      </svg>
    )
  }

  if (id === 'email') {
    return (
      <svg viewBox="0 0 24 24" className={styles.contactIconSvg} aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Zm2.2.75 6.8 5.3 6.8-5.3H5.2Zm13.55 1.47-6.06 4.73a1.12 1.12 0 0 1-1.38 0L5.25 7.47v11.28h13.5V7.47Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.contactIconSvg} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.77 2 6.4 4.96v8.66C6.4 18.33 9.2 21 12 22c2.8-1 5.6-3.67 5.6-8.38V4.96L12.77 2Zm-.85 3.06 2.98.7-.46 2.02-1.63-.38v5.56c0 1.57-.62 2.94-2.18 2.94-.7 0-1.4-.24-1.88-.72l1.1-1.46c.16.14.4.28.66.28.44 0 .57-.34.57-1.02V5.06h.84Z"
      />
    </svg>
  )
}

function returnToPortfolio(hash) {
  window.history.pushState(null, '', hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

function ExperienceDetailPage({ job }) {
  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <div className={styles.container}>
          <div className={styles.detailNav}>
            <a href={`#experience-${job.slug}`} className={styles.detailBackLink} onClick={(e) => { e.preventDefault(); returnToPortfolio(`#experience-${job.slug}`) }}>
              ← Back to portfolio
            </a>
            <div className={styles.detailActions}>
              <a href={RESUME_URL} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                Resume
              </a>
              <a href={LINKEDIN_URL} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={EMAIL_URL} className={styles.detailResumeLink}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.detailMain}>
        <div className={styles.container}>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Read more</p>
            <h1 className={styles.detailTitle}>{job.title}</h1>
            <div className={styles.detailMeta}>
              <span>{job.company}</span>
              <span>{job.period}</span>
              {job.location ? <span>{job.location}</span> : null}
            </div>

            <p className={styles.detailLead}>
              The timeline shows the headlines. This page has the full results, the constraints, and the team context.{' '}
              <a href={`#experience-${job.slug}`} className={styles.detailLeadLink} onClick={(e) => { e.preventDefault(); returnToPortfolio(`#experience-${job.slug}`) }}>
                Back to timeline →
              </a>
            </p>

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                {job.timelineBullets?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>Key results</h2>
                    <ul className={styles.detailBullets}>
                      {job.timelineBullets.map((bullet) => (
                        <li key={bullet}>{renderRichText(bullet)}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {job.roleContext ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>About this role</h2>
                    <p className={styles.detailText}>{renderRichText(job.roleContext)}</p>
                  </section>
                ) : null}

                {job.detailDepth?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>Deeper look</h2>
                    <div className={styles.detailOnlyStack}>
                      {job.detailDepth.map((item) => (
                        <article key={item.title} className={styles.detailOnlyCard}>
                          <h3 className={styles.detailOnlyTitle}>{item.title}</h3>
                          <p className={styles.detailText}>{renderRichText(item.text)}</p>
                          {item.bullets?.length ? (
                            <ul className={styles.detailBullets}>
                              {item.bullets.map((bullet) => (
                                <li key={bullet}>{renderRichText(bullet)}</li>
                              ))}
                            </ul>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className={styles.detailSidebar}>
                <div className={styles.detailImageCard}>
                  <img
                    src={job.image}
                    alt={job.imageAlt}
                    className={`${styles.detailImage} ${job.imageContain ? styles.detailImageContain : ''} ${job.imageNatural ? styles.detailImageNatural : ''}`}
                  />
                </div>
                <div className={styles.detailSidebarCard}>
                  <PlaceholderLogo src={job.logo} />
                  <p className={styles.detailSidebarText}>{job.sidebarNote}</p>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

function ProjectDetailPage({ project }) {
  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <div className={styles.container}>
          <div className={styles.detailNav}>
            <a href="#projects" className={styles.detailBackLink} onClick={(e) => { e.preventDefault(); returnToPortfolio('#projects') }}>
              ← Back to portfolio
            </a>
            <div className={styles.detailActions}>
              <a href={RESUME_URL} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                Resume
              </a>
              <a href={LINKEDIN_URL} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={EMAIL_URL} className={styles.detailResumeLink}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.detailMain}>
        <div className={styles.container}>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Project More Info</p>
            <h1 className={styles.detailTitle}>{project.name}</h1>
            <div className={styles.detailMeta}>
              {project.detailMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            {project.external || project.github || project.resourceLinks?.length ? (
              <div className={styles.projectDetailLinks}>
                {project.external ? (
                  <a href={project.external} className={styles.primaryButton} target="_blank" rel="noreferrer">
                    {project.externalLabel || 'Live demo'}
                  </a>
                ) : null}
                {project.github ? (
                  <a href={project.github} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                ) : null}
                {project.resourceLinks?.map((link) =>
                  link.href === project.external || link.href === project.github ? null : (
                    <a key={link.href} href={link.href} className={styles.detailResumeLink} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            ) : null}

            {project.humanSummary?.length ? (
              <div className={styles.projectSummaryGrid}>
                {project.humanSummary.map((item) => (
                  <section key={item.label} className={styles.projectSummaryCard}>
                    <p className={styles.projectSummaryLabel}>{item.label}</p>
                    <p className={styles.projectSummaryValue}>{item.value}</p>
                  </section>
                ))}
              </div>
            ) : null}

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                <p className={styles.detailLead}>
                  {project.slug === 'blackboxnet'
                    ? 'Architecture, design decisions, and a walkthrough of the live demo — pick up where the project card left off.'
                    : 'A closer look at scope, methodology, and verification — what the project card couldn\'t fit.'}
                </p>

                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>{project.overviewTitle || 'Overview'}</h2>
                  <p className={styles.detailText}>{project.summary}</p>
                </section>

                {project.incidentFlow?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>{project.flowTitle || 'Process'}</h2>
                    <div className={styles.projectFlowGrid}>
                      {project.incidentFlow.map((step) => (
                        <article key={step.title} className={styles.projectFlowCard}>
                          <p className={styles.projectFlowTitle}>{step.title}</p>
                          <p className={styles.projectFlowText}>{step.text}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                {project.deepDive?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>{project.deepDiveTitle || 'Details'}</h2>
                    <ul className={styles.detailBullets}>
                      {project.deepDive.map((item) => (
                        <li key={item}>{renderRichText(item)}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                <section className={styles.detailSection}>
                  <div className={styles.projectScreenshotHeader}>
                    <div>
                      <h2 className={styles.detailSectionTitle}>Featured Screens</h2>
                      <p className={styles.detailText}>{project.screenshotsIntro || 'Selected screenshots and supporting context.'}</p>
                    </div>
                  </div>
                  <div className={styles.projectScreenshotGrid}>
                    {project.screenshots.map((shot) => (
                      <figure key={shot.title} className={styles.projectScreenshotCard}>
                        <img src={shot.src} alt={shot.alt} className={styles.projectScreenshotImage} />
                        <figcaption className={styles.projectScreenshotCaption}>
                          <p className={styles.projectScreenshotEyebrow}>{shot.eyebrow}</p>
                          <h3 className={styles.projectScreenshotTitle}>{shot.title}</h3>
                          <p className={styles.projectScreenshotText}>{shot.caption}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              </div>

              <aside className={styles.detailSidebar}>
                <div className={styles.detailImageCard}>
                  <img src={project.image} alt={`${project.name} dashboard preview`} className={`${styles.detailImage} ${styles.detailImageContain}`} />
                </div>

                <div className={styles.detailSidebarCard}>
                  <p className={styles.projectSidebarLabel}>Stack</p>
                  <div className={styles.detailSkills}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.detailSkillTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.detailSidebarCard}>
                  <p className={styles.projectSidebarLabel}>{project.sidebarNarrativeTitle || 'Why it matters'}</p>
                  <p className={styles.detailSidebarText}>{project.sidebarNarrative || 'This project combines technical depth with a clearer explanation of why the work matters.'}</p>
                </div>

                <div className={styles.detailSidebarCard}>
                  <p className={styles.projectSidebarLabel}>{project.sidebarTraitsTitle || 'Key traits'}</p>
                  <ul className={styles.detailBullets}>
                    {project.sidebarFacts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {project.configLinks?.length ? (
                  <div className={styles.detailSidebarCard}>
                    <p className={styles.projectSidebarLabel}>Configurations</p>
                    <div className={styles.projectConfigLinks}>
                      {project.configLinks.map((item) => (
                        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={styles.projectConfigLink}>
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [detailRoute, setDetailRoute] = useState(getDetailRoute)
  const shouldReduceMotion = useReducedMotion()
  const kickerText = useScramble('$ whoami', { duration: 1100, skip: !!shouldReduceMotion })
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  })
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const contactLinks = contactMethods.filter((item) => ['email', 'linkedin', 'github', 'discord'].includes(item.id))
  const activeExperienceDetail = detailRoute
    ? EXPERIENCE.find((job) => `${EXPERIENCE_ROUTE_PREFIX}${job.slug}` === detailRoute)
    : null
  const activeProjectDetail = detailRoute
    ? PROJECTS.find((project) => project.slug && `${PROJECT_ROUTE_PREFIX}${project.slug}` === detailRoute)
    : null

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onRouteChange = () => setDetailRoute(getDetailRoute())
    window.addEventListener('hashchange', onRouteChange)
    window.addEventListener('popstate', onRouteChange)
    return () => {
      window.removeEventListener('hashchange', onRouteChange)
      window.removeEventListener('popstate', onRouteChange)
    }
  }, [])

  // iOS Safari sometimes swallows hashchange for hashes containing '/' with no matching element.
  // Calling setDetailRoute directly in onClick avoids depending on hashchange firing at all.
  const handleDetailNav = useCallback((href) => (e) => {
    e.preventDefault()
    const route = href.startsWith('#/') ? href.slice(2) : null
    if (route) {
      window.history.pushState(null, '', href)
      setDetailRoute(route)
    }
  }, [])

  useEffect(() => {
    if (!activeExperienceDetail && !activeProjectDetail) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeExperienceDetail, activeProjectDetail])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (window.location.hash.startsWith('#experience-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const onDetailPage = Boolean(activeExperienceDetail || activeProjectDetail)
  const wasOnDetailPage = useRef(onDetailPage)
  useEffect(() => {
    const returning = wasOnDetailPage.current && !onDetailPage
    wasOnDetailPage.current = onDetailPage
    if (!returning) return undefined
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id.startsWith('/')) return undefined
    let frame = 0
    const started = performance.now()
    // The portfolio mounts after the detail page's exit transition, so wait for the target to exist.
    const seek = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: target.tagName === 'ARTICLE' ? 'center' : 'start' })
        // The return target is one-off; a reload after this should start at the top.
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
        return
      }
      if (performance.now() - started < 2000) frame = requestAnimationFrame(seek)
    }
    frame = requestAnimationFrame(seek)
    return () => cancelAnimationFrame(frame)
  }, [onDetailPage])

  const [activeJob, setActiveJob] = useState(0)
  const timelineItemRefs = useRef([])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const focusLine = window.innerHeight * 0.42
      let best = 0
      let bestDistance = Infinity
      timelineItemRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = rect.top <= focusLine && rect.bottom >= focusLine ? 0 : Math.min(Math.abs(rect.top - focusLine), Math.abs(rect.bottom - focusLine))
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      setActiveJob(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [activeExperienceDetail, activeProjectDetail])

  const scrollToJob = useCallback((index) => {
    timelineItemRefs.current[index]?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'center' })
  }, [shouldReduceMotion])

  const pageTransition = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.22, ease: 'easeInOut' } }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        {activeExperienceDetail ? (
          <motion.div key={`exp-${activeExperienceDetail.slug}`} {...pageTransition} style={{ minHeight: '100vh' }}>
            <ExperienceDetailPage job={activeExperienceDetail} />
          </motion.div>
        ) : activeProjectDetail ? (
          <motion.div key={`proj-${activeProjectDetail.slug}`} {...pageTransition} style={{ minHeight: '100vh' }}>
            <ProjectDetailPage project={activeProjectDetail} />
          </motion.div>
        ) : (
          <motion.div key="main" {...pageTransition}>
      <div className={styles.pageShell}>
        <motion.div className={styles.progressBar} style={{ scaleX: progress }} />

        <header className={`${styles.navWrap} ${scrolled ? styles.navWrapScrolled : ''}`}>
          <div className={styles.container}>
            <div className={styles.nav}>
              <a href="#top" className={styles.brand} aria-label="Back to top">
                <LogoMark />
              </a>

              <nav className={styles.desktopNav} aria-label="Primary">
                {NAV_ITEMS.map((item) => (
                  item.id === 'experience' || item.id === 'projects' ? (
                    <div key={item.id} className={styles.navDropdown}>
                      <a
                        href={`#${item.id}`}
                        className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ''}`}
                        aria-haspopup="menu"
                      >
                        <span className={styles.navLinkInner}>
                          {item.label}
                          <span className={styles.navCaret} aria-hidden="true">
                            +
                          </span>
                        </span>
                      </a>
                      <div className={styles.navDropdownMenu}>
                        {getNavDropdownLinks(item.id).map((link) => (
                          <a key={link.href} href={link.href} className={styles.navDropdownLink}>
                            {link.shortLabel}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ''}`}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </nav>

              <div className={styles.navSocials}>
                <a href={LINKEDIN_URL} className={styles.navSocialLink} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" className={styles.navSocialIcon} aria-hidden="true">
                    <path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm6.86 5.5H8.86V20h3.25v-5.7c0-1.5.28-2.95 2.15-2.95 1.84 0 1.86 1.72 1.86 3.05V20h3.26v-6.27c0-3.08-.66-5.45-4.26-5.45-1.73 0-2.88.95-3.35 1.85h-.05V8.5Z" />
                  </svg>
                </a>
                <a href="https://github.com/dkabduli" className={styles.navSocialLink} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" className={styles.navSocialIcon} aria-hidden="true">
                    <path fill="currentColor" d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.3 9.42 7.87 10.94.58.11.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.09 1.77 1.19 1.77 1.19 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.19 1.18a10.9 10.9 0 0 1 5.8 0c2.22-1.49 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.54 11.54 0 0 0 23.5 12.03C23.5 5.66 18.35.5 12 .5Z" />
                  </svg>
                </a>
              </div>

              <button
                type="button"
                className={styles.menuButton}
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                Menu
              </button>
            </div>
          </div>

          <motion.div
            id="mobile-nav"
            className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
            initial={false}
            animate={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
          >
            {NAV_ITEMS.map((item) => (
              item.id === 'experience' || item.id === 'projects' ? (
                <div key={item.id} className={styles.mobileNavGroup}>
                  <a href={`#${item.id}`} className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </a>
                  <div className={styles.mobileNavSubmenu}>
                    {getNavDropdownLinks(item.id).map((link) => (
                      <a key={link.href} href={link.href} className={styles.mobileNavSubLink} onClick={(e) => { handleDetailNav(link.href)(e); setMenuOpen(false) }}>
                        {link.shortLabel}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={item.id} href={`#${item.id}`} className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              )
            ))}
          </motion.div>
        </header>

        <main id="top">
          <section className={`${styles.hero} ${mounted ? styles.heroMounted : ''}`}>
            <div className={styles.container}>
              <div className={styles.heroGrid}>
                <div className={styles.heroCopy}>
                  <motion.p
                    className={styles.heroKicker}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0 }}
                  >
                    {kickerText}
                  </motion.p>
                  <motion.h1
                    className={styles.heroTitle}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.05 }}
                  >
                    <span className={styles.heroTitleLine}>Abdul Rehman</span>
                    <span className={styles.heroTitleLine}>Baseem</span>
                  </motion.h1>
                  <motion.p
                    className={styles.heroMeta}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.15 }}
                  >
                    <span className={styles.heroMetaLine}>Infrastructure &amp; NetDevOps</span>
                    <span className={styles.heroMetaLine}>Shared Services Canada · <span className={styles.noWrap}>Carleton B.IT. '27</span></span>
                  </motion.p>
                  <motion.p
                    className={styles.heroLocation}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.2 }}
                  >
                    Ottawa, ON
                  </motion.p>
                  <motion.p
                    className={styles.heroBody}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.28 }}
                  >
                    Building production systems at Shared Services Canada: a full-stack intake platform (Next.js/PostgreSQL), Ansible-based provisioning, Zabbix CI/CD pipelines, and mailbox-to-ticket automation, all deployed under federal change-control constraints.
                  </motion.p>
                  <motion.div
                    className={styles.heroStrengths}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.38 }}
                  >
                    {KEY_STRENGTHS.map((item) => (
                      <span key={item} className={styles.heroStrengthTag}>
                        {item}
                      </span>
                    ))}
                  </motion.div>
                  <motion.div
                    className={styles.heroActions}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.44 }}
                  >
                    <a href={RESUME_URL} className={styles.primaryButton} target="_blank" rel="noreferrer">
                      Download Resume
                    </a>
                    <a href={LINKEDIN_URL} className={styles.secondaryLink} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                    <a href={EMAIL_URL} className={styles.secondaryLink}>
                      Contact
                    </a>
                    <a href="#projects" className={styles.secondaryLink}>
                      View Projects →
                    </a>
                  </motion.div>
                </div>

                <div className={styles.heroArt}>
                  <div className={styles.heroStage}>
                    <TopologyGraphic />
                    <span className={styles.heroWatermark}>ARB</span>
                    <HeroPhotoNodes />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Section id="about" label="// 00 — ABOUT">
            <div className={styles.aboutStatsRow}>
              <div className={styles.aboutPortraitFrame}>
                <img
                  src={`${BASE}images/about-face.png`}
                  alt="Portrait of Abdul Rehman Baseem"
                  className={styles.aboutPortrait}
                />
              </div>
              <div className={styles.aboutRightCol}>
                <div className={styles.aboutInfoRow}>
                  <div className={styles.aboutInfoItem}>
                    <img src={`${BASE}images/carleton-logo.svg`} alt="Carleton University" className={styles.carletonLogo} />
                    <p className={styles.aboutInfoSub}>B.IT. Network Technology · April 2027</p>
                    <div className={styles.aboutInfoTags}>
                      <span className={styles.aboutInfoTag}>General In-Course Scholarship</span>
                      <span className={styles.aboutInfoTag}>English · Urdu</span>
                    </div>
                  </div>
                  <div className={`${styles.aboutInfoItem} ${styles.aboutInfoItemAccent}`}>
                    <img src={`${BASE}images/goc-logo.png`} alt="Government of Canada" className={styles.gocLogo} />
                    <p className={styles.aboutInfoLabel}>Security Clearance</p>
                    <p className={styles.aboutInfoSub}>Issued April 2025 · Valid until April 2035</p>
                  </div>
                </div>
                <div className={styles.statsGrid}>
                  {QUICK_STATS.map((stat) => (
                    <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </div>
              <p className={styles.aboutBio}>
                Fourth-year B.IT. Network Technology student at Carleton University (joint with Algonquin College), completing three consecutive co-op terms at Shared Services Canada across enterprise LAN operations, NetDevOps pipelines, infrastructure automation, and full-stack application delivery. My work runs under federal change-control and security baseline requirements — production environments, not sandboxes. Outside of work, I build things end to end: VisionCompanion, an AI walking companion that announces street hazards to blind and low-vision pedestrians, and BlackBoxNet, a multi-vendor network replay platform that applies real incident-investigation methodology to lab environments.
              </p>
            </div>
          </Section>

          <Section id="experience" label="// 01 — EXPERIENCE">
            <div className={styles.experienceLayout}>
              <div className={styles.timeline}>
                {EXPERIENCE.map((job, index) => (
                  <article
                    key={job.title}
                    id={`experience-${job.slug}`}
                    ref={(el) => {
                      timelineItemRefs.current[index] = el
                    }}
                    className={`${styles.timelineItem} ${index === activeJob ? styles.timelineItemActive : ''}`.trim()}
                  >
                    <span className={styles.timelineDot} aria-hidden="true" />
                    <div className={styles.timelineCard}>
                      <div className={styles.timelineMetaRow}>
                        <p className={styles.timelinePeriod}>{job.period}</p>
                        <span className={styles.timelineLayer}>
                          L{EXPERIENCE.length - index} · {job.layer}
                        </span>
                      </div>
                      <h2 className={styles.timelineTitle}>{job.title}</h2>
                      <div className={styles.timelineCompanyRow}>
                        <p className={styles.timelineCompany}>{job.company}</p>
                        <PlaceholderLogo src={job.logo} />
                      </div>
                      {job.highlights.length ? (
                        <ul className={styles.timelineBullets}>
                          {job.highlights.map((bullet) => (
                            <li key={bullet}>{renderRichText(bullet)}</li>
                          ))}
                        </ul>
                      ) : null}
                      {hasExperienceDetails(job) ? (
                        <a href={`#/${EXPERIENCE_ROUTE_PREFIX}${job.slug}`} className={styles.caseStudyLink} onClick={handleDetailNav(`#/${EXPERIENCE_ROUTE_PREFIX}${job.slug}`)}>
                          Read more →
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              <CareerStack jobs={EXPERIENCE} activeIndex={activeJob} onSelect={scrollToJob} />
            </div>

            <a href={RESUME_URL} className={styles.resumeLink} target="_blank" rel="noreferrer">
              View full resume →
            </a>
          </Section>

          <Section id="projects" label="// 02 — PROJECTS">
            <ProjectCarousel
              items={PROJECTS}
              getKey={(project) => project.slug}
              getLabel={(project) => project.name}
              renderItem={(project) => (
                <motion.article
                  key={project.name}
                  className={styles.projectCard}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
                >
                  <div className={styles.projectMedia}>
                    <div className={styles.projectMediaHeader}>
                      {project.featured ? <span className={styles.featuredBadge}>FEATURED</span> : null}
                      {project.status ? <span className={styles.statusBadge}>{project.status}</span> : null}
                    </div>
                    <div className={styles.projectImageFrame}>
                      <ProjectImage project={project} />
                    </div>
                  </div>
                  <div className={styles.projectBody}>
                    <div className={styles.projectMeta}>
                      <div className={styles.projectTags}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.projectTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className={styles.projectYear}>{project.year}</p>
                    </div>
                    <h2 className={styles.projectTitle}>{project.name}</h2>
                    <p className={styles.projectDescription}>{project.description}</p>
                    {project.github || project.external || project.slug ? (
                      <div className={styles.projectLinks}>
                        {project.github ? (
                          <a href={project.github} target="_blank" rel="noreferrer">
                            GitHub
                          </a>
                        ) : null}
                        {project.external ? (
                          <a href={project.external} target="_blank" rel="noreferrer">
                            {project.externalLabel || 'Live demo'}
                          </a>
                        ) : null}
                        {project.slug ? (
                          <a href={`#/${PROJECT_ROUTE_PREFIX}${project.slug}`} onClick={handleDetailNav(`#/${PROJECT_ROUTE_PREFIX}${project.slug}`)}>
                            Case study →
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              )}
            />
          </Section>

          <Section id="extracurriculars" label="// 03 — EXTRACURRICULARS">
            <div className={styles.extraGrid}>
              {EXTRACURRICULARS.map((item) => (
                <a key={item.org} href={item.href} className={styles.extraCard} target="_blank" rel="noreferrer" aria-label={`${item.role} at ${item.org}, ${item.period}. Opens ${item.org} website`}>
                  <span className={styles.extraLogo}>
                    <img src={item.logo} alt="" loading="lazy" />
                  </span>
                  <span className={styles.extraRole}>{item.role}</span>
                  <span className={styles.extraPeriod}>{item.period}</span>
                  <span className={styles.extraArrow} aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </Section>

          <Section id="skills" label="// 04 — SKILLS">
            <SkillsToolbox skills={SKILLS} />
          </Section>

          <Section id="contact" label="// 05 — CONTACT">
            <div className={styles.contactInfo}>
              <p className={styles.contactIntro}>
                <span className={styles.contactIntroLine}>Seeking new grad roles in network engineering, NetDevOps and infrastructure.</span>
                <span className={styles.contactIntroLine}>Graduating April 2027.</span>
              </p>
              <div className={styles.contactLinks}>
                {contactLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href || undefined}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className={styles.contactLink}
                  >
                    <span className={styles.contactIcon} aria-hidden="true">
                      <ContactMethodIcon id={item.id} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <span>
                        {item.id === 'email' && item.value.includes('@') ? (
                          <>
                            {item.value.split('@')[0]}@<wbr />
                            {item.value.split('@').slice(1).join('@')}
                          </>
                        ) : (
                          item.value
                        )}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
              <a href={RESUME_URL} className={styles.primaryButton} target="_blank" rel="noreferrer">
                Download Resume
              </a>
            </div>
          </Section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <p>© 2026 Abdul Rehman Baseem · Built with React + Vite</p>
          </div>
        </footer>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}

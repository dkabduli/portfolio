import { useEffect, useMemo, useState } from 'react'
import { LazyMotion, domAnimation, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { contactMethods } from './data/contact'
import styles from './App.module.css'

const BASE = import.meta.env.BASE_URL || '/'
const RESUME_URL = `${BASE}resume/Resume.pdf`
const LINKEDIN_URL = contactMethods.find((item) => item.id === 'linkedin')?.href || 'https://linkedin.com'
const EMAIL_URL = contactMethods.find((item) => item.id === 'email')?.href || 'mailto:'
const EXPERIENCE_ROUTE_PREFIX = 'experience/'
const PROJECT_ROUTE_PREFIX = 'projects/'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const QUICK_STATS = [
  { value: '2+', label: 'YRS INDUSTRY EXP.' },
  { value: '50+', label: 'SWITCHES UPGRADED' },
  { value: '132', label: 'INACTIVE ACCOUNTS FOUND' },
  { value: '15×', label: 'FASTER CERT PROVISIONING' },
]


const KEY_STRENGTHS = ['Infrastructure', 'Automation', 'NetDevOps', 'Full-Stack']

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


const COURSEWORK = [
  'DevOps',
  'Real-time Systems',
  'Network Management and ML',
  'IP Architecture and Solutions',
  'Desktop and Server Environments II',
  'Transmission Systems',
  'Computer Architecture',
  'Wireless Networks',
  'Data Structures',
  'Databases',
]

const EXPERIENCE = [
  {
    slug: 'infrastructure-dev-intern',
    period: 'MAY 2026 — PRESENT',
    title: 'Infrastructure Dev Intern',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/ai-intro01.png`,
    imageAlt: 'Infrastructure development and automation',
    imageContain: false,
    timelineBullets: [
      'Reduced ticket intake overhead across **10+ infrastructure service areas** by designing and deploying an **n8n** automated routing workflow that eliminated duplicate creation and centralized unassigned work into a shared queue—validated against **25+ production-ready NetOps tickets** under SSC change-control approval.',
      'Achieved zero-data-loss platform migration of **n8n** and **DocuSeal** from **dev01** to **app01**—verified across **120 templates**, **251 completed documents**, and **494 storage objects** via database dump/restore, blob sync, and row-count parity checks—cutting deployment recovery time from **20–30 min** to **under 10 min**.',
      'Cut **SSL/TLS certificate provisioning from 20–30 minutes to under 2 minutes** per request by building a reusable **Ansible** role that automates CSR generation, private key handling, and **OpenSSL** configuration for **Azure**-compatible **SSC NAI** environments.',
    ],
    roleContext:
      'Operated inside SSC platform engineering under federal change-control constraints—every deployment touched production-facing services requiring documented testing, approval workflows, and service-owner sign-off before going live. Toolchain spanned **n8n**, **DocuSeal** (**PostgreSQL** backend), **Ansible AAP**, **OpenSSL**, **GitLab CI**, and **HashiCorp Vault** alongside internal ITSM and ticketing systems. Work involved **Docker**-based container deployments, multi-hop **SSH** jump configurations across SSC network boundaries, and **SSL/TLS** lifecycle management—all reviewed against the security baseline prior to production rollout.',
    detailDepth: [
      {
        title: 'n8n on app01',
        text: '**n8n** runs internal workflow automation on SSC container standards. Moving off **dev01** meant rebuilding the **Docker**-based app stack on **app01**, restoring workflow DB state, and proving **HTTPS** through the production reverse-proxy chain—not lifting the old VM image.',
      },
      {
        title: 'DocuSeal on app01',
        text: '**DocuSeal** runs on a custom **SSC Docker** image with a **PostgreSQL** backend. Cutover required rebuilding the image on **app01**, performing a database dump/restore, syncing blob storage, and running row-count parity checks across **120 templates**, **117 submissions**, **251 completed documents**, and **494 storage objects** before the DNS flip — every count verified before go-live, not assumed.',
      },
      {
        title: 'Multi-hop Ansible to GitLab',
        text: '**SWLINUX** certificate output cannot reach **git02** directly from a single network hop. Playbooks chain **devHost** as a jump host through the inventory into **Azure GitLab** using **SSH proxy** settings — so the same Ansible role run publishes CSRs and keys to the correct project namespace for production-style rollout without manual file transfer.',
      },
    ],
    sidebarNote:
      'Federal infrastructure context: pre-production rigor, change control, and coordination with platform owners before production rollout.',
  },
  {
    slug: 'netdevops-intern',
    period: 'APR 2025 — APR 2026',
    title: 'NetDevOps Intern',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/aap-logo.png`,
    imageAlt: 'Ansible Automation Platform logo',
    imageContain: true,
    timelineBullets: [
      'Reduced platform licensing costs by identifying **132 inactive accounts** across the full organizational **GitLab** instance—delivering a prioritized deactivation plan to platform admins—by engineering a **REST API** audit script that systematically covered the complete account scope.',
      'Improved network health coverage across **75+ devices** by building **Ansible** playbooks that automated continuous polling and alert triggering, replacing manual checks that previously left off-hours anomalies undetected.',
      'Cut incident detection lag **from hours to minutes** across **dev, staging, and prod** by integrating **Zabbix** real-time monitoring into **GitLab CI/CD** pipeline gates—ensuring degraded device health blocked deployments before advancing to the next environment tier.',
      'Improved automation reliability by refactoring **20+ Ansible playbooks** and automating **15 network monitoring jobs**—eliminating **30%** of redundant execution steps—through a structured audit of the production playbook library consumed daily by SSC network operations.',
    ],
    roleContext:
      "Embedded in SSC's NetDevOps practice alongside senior engineers who owned the **Ansible Automation Platform** and live monitoring stack. Scope covered improving a production playbook library (**20+ playbooks**, **75+ polled devices**) and integrating **Zabbix** into **CI/CD** pipeline gates—not one-off fixes, but changes the ops team depended on daily. Automation work applied **Python** scripting, **REST API** integration, and **GitLab CI** pipeline configuration; all changes were version-controlled and peer-reviewed before pipeline deployment. The **GitLab API** audit required designing a programmatic approach to traverse the full organizational account scope and coordinate deactivation timing with platform admins to avoid disrupting active teams.",
    detailDepth: [
      {
        title: 'Zabbix + CI/CD pipeline integration',
        text: 'Zabbix had been running as a standalone monitoring tool—alerts existed but nothing acted on them in the pipeline. Wired **Zabbix** health checks into **GitLab CI** gates across **dev, staging, and prod** so a degraded device could block a deployment before it reached the next tier. The integration required mapping Zabbix host groups to pipeline environment variables so the same job template worked across tiers without hardcoded thresholds.',
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
    period: 'MAY 2024 — APR 2025',
    title: 'LAN Operations Technician',
    company: 'Shared Services Canada',
    location: 'Ottawa, Ontario',
    image: `${BASE}images/ssc-switch-upgrade.png`,
    imageAlt: 'Abdul Rehman Baseem upgrading switches in a network environment',
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

const SKILLS = {
  'Languages & Frameworks': ['Python', 'Java', 'C', 'C++', 'MATLAB', 'LC-3 Assembly', 'TypeScript', 'React', 'FastAPI'],
  'Network Operating Systems': ['Cisco IOS CLI', 'Juniper Junos', 'Aruba CLI'],
  'Automation & DevOps': ['Ansible Automation Platform (AAP)', 'Docker', 'Git', 'GitLab CI/CD', 'n8n', 'OpenSSL', 'REST APIs'],
  'Cloud & Infrastructure': ['Azure', 'VMware Fusion', 'HashiCorp Vault', 'Linux'],
  'Tools & Databases': ['VS Code', 'PyCharm', 'Wireshark', 'PuTTY', 'MobaXterm', 'Visio', 'MySQL', 'PostgreSQL'],
  'Platforms & Monitoring': ['Zabbix', 'NNMI', 'Elasticsearch', 'DocuSeal'],
  'Networking Protocols': ['TCP/IP', 'STP', 'ARP', 'RIP', 'BGP', 'OSPFv2/v3', 'EIGRP', 'MPLS'],
  'Security': ['Firewalls', 'VPN', 'IDPS', 'Network Hardening'],
}

const PROJECTS = [
  {
    name: 'BlackBoxNet',
    slug: 'blackboxnet',
    year: '2026',
    description:
      'Full-stack network replay platform with 12 scripted multi-vendor outage labs across Cisco, Juniper, and Nokia. Step through T1→T5, investigate live topology, correlate root cause from semantic config diffs, and replay what changed before the failure — deployed with GitHub Actions CI on Render.',
    tags: ['FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Git'],
    featured: true,
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, ease: 'easeOut' }}
    >
      {label ? <p className={styles.sectionLabel}>{label}</p> : null}
      <div className={`${styles.sectionContent} ${contentClassName}`.trim()}>{children}</div>
    </motion.section>
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

function PlaceholderLogo() {
  return (
    <span className={styles.companyLogoWrap} aria-hidden="true">
      <img src={`${BASE}images/ssc-logo.png`} alt="" className={styles.companyLogo} />
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

function ExperienceDetailPage({ job }) {
  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <div className={styles.container}>
          <div className={styles.detailNav}>
            <a href={`${BASE}#experience`} className={styles.detailBackLink}>
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
              The bullet points capture what shipped. This page goes deeper — the constraints, the team context, and what didn't fit in three lines.{' '}
              <a href={`${BASE}#experience`} className={styles.detailLeadLink}>
                Back to timeline →
              </a>
            </p>

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
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
                    className={`${styles.detailImage} ${job.imageContain ? styles.detailImageContain : ''}`}
                  />
                </div>
                <div className={styles.detailSidebarCard}>
                  <PlaceholderLogo />
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
            <a href={`${BASE}#projects`} className={styles.detailBackLink}>
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
    const onHashChange = () => setDetailRoute(getDetailRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!activeExperienceDetail && !activeProjectDetail) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeExperienceDetail, activeProjectDetail])

  if (activeExperienceDetail) {
    return (
      <LazyMotion features={domAnimation}>
        <ExperienceDetailPage job={activeExperienceDetail} />
      </LazyMotion>
    )
  }

  if (activeProjectDetail) {
    return (
      <LazyMotion features={domAnimation}>
        <ProjectDetailPage project={activeProjectDetail} />
      </LazyMotion>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
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
                      <a key={link.href} href={link.href} className={styles.mobileNavSubLink} onClick={() => setMenuOpen(false)}>
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
                    $ whoami
                  </motion.p>
                  <motion.h1
                    className={styles.heroTitle}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.05 }}
                  >
                    Abdul Rehman Baseem
                  </motion.h1>
                  <motion.p
                    className={styles.heroMeta}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.15 }}
                  >
                    Infrastructure Dev Intern · Shared Services Canada
                  </motion.p>
                  <motion.p
                    className={styles.heroLocation}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.2 }}
                  >
                    Carleton University · Ottawa, ON
                  </motion.p>
                  <motion.p
                    className={styles.heroBody}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.28 }}
                  >
                    Building infrastructure automation and network tooling at Shared Services Canada — Ansible-based provisioning, Zabbix CI/CD pipelines, and workflow orchestration deployed under federal change-control constraints.
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
              <div className={styles.statsGrid}>
                {QUICK_STATS.map((stat) => (
                  <div key={stat.label} className={styles.statCard}>
                    <strong className={styles.statValue}>{stat.value}</strong>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
              <p className={styles.aboutBio}>
                Fourth-year B.IT. Network Technology student at Carleton University (joint with Algonquin College), completing three consecutive co-op terms at Shared Services Canada across enterprise LAN operations, NetDevOps pipelines, and infrastructure automation. My work runs under federal change-control and security baseline requirements — production environments, not sandboxes. Outside of work, I built BlackBoxNet: a multi-vendor network replay platform that applies real incident-investigation methodology to lab environments.
              </p>
            </div>
            <div className={styles.credentialsRow}>
              {CREDENTIALS.map((cred) => (
                <div key={cred.name} className={styles.credentialCard}>
                  <p className={styles.credentialLabel}>{cred.label}</p>
                  <h3 className={styles.credentialName}>{cred.name}</h3>
                  <p className={styles.credentialIssuer}>{cred.issuer}</p>
                  <p className={styles.credentialDates}>Issued {cred.issued} · Valid until {cred.expires}</p>
                  <p className={styles.credentialNote}>{cred.note}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="experience" label="// 01 — EXPERIENCE">
            <div className={styles.timeline}>
              {EXPERIENCE.map((job, index) => (
                <motion.article
                  key={job.title}
                  className={styles.timelineItem}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: index * 0.08 }}
                >
                  <span className={styles.timelineDot} aria-hidden="true" />
                  <div className={styles.timelineCard}>
                    <p className={styles.timelinePeriod}>{job.period}</p>
                    <h2 className={styles.timelineTitle}>{job.title}</h2>
                    <div className={styles.timelineCompanyRow}>
                      <p className={styles.timelineCompany}>{job.company}</p>
                      <PlaceholderLogo />
                    </div>
                    {job.timelineBullets.length ? (
                      <ul className={styles.timelineBullets}>
                        {job.timelineBullets.map((bullet) => (
                          <li key={bullet}>{renderRichText(bullet)}</li>
                        ))}
                      </ul>
                    ) : null}
                    {hasExperienceDetails(job) ? (
                      <a href={`#/${EXPERIENCE_ROUTE_PREFIX}${job.slug}`} className={styles.caseStudyLink}>
                        Read more →
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div>

            <a href={RESUME_URL} className={styles.resumeLink} target="_blank" rel="noreferrer">
              View full resume →
            </a>
          </Section>

          <Section id="skills" label="// 02 — SKILLS">
            <div className={styles.skillsPanel}>
              <div className={styles.skillsGrid}>
                {Object.entries(SKILLS).map(([category, items]) => (
                  <article key={category} className={styles.skillColumn}>
                    <h2 className={styles.skillHeading}>{category}</h2>
                    <div className={styles.skillTags}>
                      {items.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.courseworkPanel}>
              <p className={styles.aboutKicker}>Selected Coursework</p>
              <div className={styles.courseworkGrid}>
                {COURSEWORK.map((course) => (
                  <span key={course} className={styles.courseworkTag}>
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          <Section id="projects" label="// 03 — PROJECTS">
            <div className={styles.projectGrid}>
              {PROJECTS.map((project) => (
                <motion.article
                  key={project.name}
                  className={styles.projectCard}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
                >
                  <div className={styles.projectMedia}>
                    <div className={styles.projectMediaHeader}>
                      {project.featured ? <span className={styles.featuredBadge}>FEATURED</span> : null}
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
                          <a href={`#/${PROJECT_ROUTE_PREFIX}${project.slug}`}>
                            Case study →
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div>
          </Section>

          <Section id="contact" label="// 04 — CONTACT">
            <div className={styles.contactInfo}>
              <p className={styles.contactIntro}>
                Open to network engineering, NetDevOps, and infrastructure roles — graduating April 2027. Email is fastest; LinkedIn for professional connection, GitHub for code.
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
                      <span>{item.value}</span>
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
    </LazyMotion>
  )
}

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
  { value: '2+', label: 'YRS EXPERIENCE' },
  { value: '50+', label: 'SWITCHES UPGRADED' },
  { value: '132', label: 'INACTIVE USERS FOUND' },
  { value: '500+', label: 'INVENTORY RECORDS AUDITED' },
]

const KEY_STRENGTHS = ['Infrastructure', 'Automation', 'NetDevOps']

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
      'Designed and led end-to-end implementation of an automated workflow that analyzes incoming requests, routes work across **10+ infrastructure service areas**, prevents duplicate ticket creation, centralizes unassigned work into a shared queue, and standardizes operational intake—validated with **25+ production-ready tickets** for the **NetOps** team.',
      'Migrated internal **n8n** automation platform to **Azure** pre-production, resolving **SSL**, **reverse-proxy**, and **container networking** issues; migrated **7 active workflows** and established deployment process reducing provisioning time from hours to **under 10 minutes**.',
      'Automated **Azure-compatible SSL/TLS** certificate request generation using **Ansible** and **OpenSSL**, creating a reusable role-based workflow that generated CSRs, private keys, and standardized OpenSSL configurations for **SSC NAI** environments, reducing manual certificate setup from **20–30 minutes** to **under 2 minutes** per request.',
    ],
    detailOnlyBullets: [
      'Engineered and validated a **multi-hop SSH/Ansible** deployment workflow across **devHost**, **jump hosts**, and **Azure GitLab infrastructure (git02)**, enabling **centralized certificate automation** and secure repository distribution for **SWLINUX** operations while standardizing **inventory**, **SSH proxy routing**, and environment configuration for future production deployments.',
    ],
    roleDetail: [
      '**Infrastructure Dev Intern** on Shared Services Canada’s platform and automation side—supporting internal teams that rely on workflow tooling, certificate services, and repeatable deployments in a federal, security-conscious environment.',
      'The role sits between operators who need self-serve automation and engineers who own **Azure** and **GitLab**. I was the person building and hardening those handoffs—not running a single product line, but keeping platforms deployable and auditable.',
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
      'Led a **GitLab** account audit using the **GitLab API**, identifying **132 inactive users** and enabling a deactivation strategy that reduced **licensing** costs while adhering to platform constraints.',
      'Developed and maintained **Ansible playbooks** that continuously polled **75+ network devices** for health metrics, triggering automated alerts for timely incident detection and resolution.',
      'Integrated **Zabbix** real-time monitoring into **CI/CD** pipelines across **dev, staging, and prod** tiers, eliminating manual health checks and reducing mean incident response time.',
      'Assessed **Ansible Forms** as a self-service automation interface for cross-team workflows, delivering a scoped implementation roadmap that was accepted by senior engineers for rollout.',
      'Audited and refactored **20+ Ansible playbooks** and automated **15 network monitoring jobs**, eliminating **30%** of redundant execution steps and improving reliability of automated network checks.',
    ],
    roleDetail: [
      '**NetDevOps Intern** embedded with SSC’s automation and network operations stakeholders—translating recurring operational pain (stale accounts, noisy monitoring, inventory drift) into scripted, reviewable pipelines.',
      'I was the intern engineers handed cross-cutting hygiene work to: identity and access on **GitLab**, health signal collection at scale, and making sure releases could trust monitoring instead of manual spot checks.',
      'The team expectation was not ticket-by-ticket device config—it was improving how the organization runs automation: cleaner playbooks, observable pipelines, trustworthy inventory, and practical self-service designs senior staff could approve.',
    ],
    sidebarNote:
      'Worked inside SSC’s NetDevOps practice with **Ansible Automation Platform**, engineering leads, and ops teams who consumed reports and pipeline gates.',
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
      'Upgraded firmware on **50+ Juniper EX-4300 P and MP** switches via **Linux scripting**, resolving multiple known vulnerabilities and aligning all devices to current **security baselines**.',
      'Designed **Visio** topology diagrams for **10+ NCR sites** documenting subnet structures and physical layouts, formally adopted as the primary reference for field technicians during incident response.',
      'Consolidated fragmented site documentation (network configurations, topologies, and switch inventory for **10+ NCR sites**) into a centralized reference system, reducing ops team lookup time by **40%**.',
    ],
    roleDetail: [
      '**LAN Operations Technician** for SSC’s National Capital Region footprint—hands-on switching work paired with documentation discipline so field techs and central ops shared the same picture during incidents.',
      'I was on the team that keeps access layers maintainable: firmware posture on **Juniper** access gear, accurate diagrams when bridges open, and one place to find configs instead of scattered folders.',
      'The role was field-adjacent operations support—executing controlled change windows, publishing references technicians actually use, and reducing friction between site knowledge and the ops center.',
    ],
    sidebarNote:
      'NCR LAN operations: coordination with field technicians, ops planners, and security baseline expectations on government-managed switching.',
  },
]

const SKILLS = {
  'Languages & Frameworks': ['Python', 'Java', 'C', 'C++', 'MATLAB', 'LC-3 Assembly', 'TypeScript', 'React', 'FastAPI'],
  'Network Operating Systems': ['Cisco IOS CLI', 'Juniper Junos', 'Aruba CLI'],
  'Automation & DevOps': ['Ansible Automation Platform (AAP)', 'Docker', 'Git', 'GitLab'],
  'Tools & Databases': ['VS Code', 'PyCharm', 'Wireshark', 'PuTTY', 'MobaXterm', 'VMware Fusion', 'Visio', 'MySQL'],
  'Platforms & Monitoring': ['Zabbix', 'NNMI', 'Elasticsearch', 'HashiCorp Vault', 'DocuSeal', 'Lighthouse'],
  'Networking Protocols': ['TCP/IP', 'STP', 'ARP', 'RIP', 'BGP', 'OSPFv2/v3', 'EIGRP', 'MPLS'],
}

const PROJECTS = [
  {
    name: 'BlackBoxNet',
    slug: 'blackboxnet',
    year: '2026',
    description:
      'A Git-backed network state replay platform with twelve scripted outage labs across Cisco, Juniper, and Nokia. Operators step through T1→T5, view live topology, correlate root cause, and compare configs—available as a public demo on Render.',
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
      'Records config snapshots, metrics, and events in a Git-backed timeline. Pick Cisco, Juniper, or Nokia, run a scripted story T1→T5, inspect JSON-driven topology, and open incidents with rules-based correlation and config diffs. Public stack: Render web/API, Neon Postgres, namespaced configs per scenario. Free-tier API may sleep—first Run T1 after idle can take 30–60s.',
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
    pillars: [
      'Twelve scripted scenarios across Cisco IOS, Juniper Junos, and Nokia SR OS with vendor tabs and per-scenario reset.',
      'React Flow topology from JSON presets (linear, OSPF areas, triangle, Junos triangle, Nokia hub).',
      'T1→T5 simulation, incident timeline, and vendor-aware semantic diff (ACL, OSPF, BGP, STP, LDP, hold-time, etc.).',
      'Git configs at configs/{scenario_id}/{device}/T{n}.txt; optional live Cisco SSH with redaction (Phase 1.5).',
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
      'React + FastAPI + PostgreSQL + GitPython; scenario_id namespacing on every API and DB row.',
      'Topology source: packages/mock-scenarios/topology-presets.json (regenerate via scripts/generate_phase2_scenarios.py).',
      'CI: 14 API pytest tests; production frontend build on push to main.',
    ],
    screenshots: [
      {
        src: `${BASE}images/blackboxnet-dashboard.png`,
        alt: 'BlackBoxNet dashboard with Nokia VPRN scenario, topology preview, and T1–T5 simulation',
        eyebrow: 'Dashboard',
        title: 'Live demo — multi-vendor dashboard',
        caption:
          'Vendor tabs (Cisco, Juniper, Nokia), scenario picker, React Flow topology, simulation controls, and per-device health on the public Render deployment.',
      },
      {
        src: `${BASE}images/blackboxnet-incident.png`,
        alt: 'BlackBoxNet incident summary and correlation analysis screen',
        eyebrow: 'Incident investigation',
        title: 'Root cause & correlation',
        caption:
          'Rules-based correlation ties symptoms to the suspicious config change, with human-readable analysis before the raw unified diff.',
      },
      {
        src: `${BASE}images/blackboxnet-outage.png`,
        alt: 'BlackBoxNet root cause and investigation timeline screen',
        eyebrow: 'Evidence layer',
        title: 'Timeline + config diff',
        caption:
          'Chronological events lead into Git-backed config comparison—the same evidence path operators would use to justify rollback or ACL reorder.',
      },
    ],
    sidebarFacts: [
      'API docs: blackboxnet-api.onrender.com/docs',
      'Three semantic extractors: Cisco IOS, Juniper Junos, Nokia SR OS',
    ],
    resourceLinks: [{ label: 'API docs', href: 'https://blackboxnet-api.onrender.com/docs' }],
  },
  {
    name: 'IPv6 EIGRP Network',
    slug: 'ipv6-eigrp-network',
    year: '2024',
    description:
      'A Cisco Packet Tracer lab building and tuning EIGRP for IPv6 on a multi-router topology—classic and named modes, passive interfaces, route summarization, authentication, and hands-on verification beyond basic adjacency setup.',
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
      'Multi-router IPv6 EIGRP lab (classic and named modes) with passive interfaces, default-route propagation, summarization, authentication (MD5 and HMAC-SHA-256), and route filtering—beyond basic adjacency bring-up.',
    humanSummary: [
      {
        label: 'Environment',
        value: 'Cisco Packet Tracer — routed links, VLAN subinterfaces, loopbacks.',
      },
      {
        label: 'Verification',
        value: 'show ipv6 eigrp neighbors, interfaces, route eigrp, topology table.',
      },
    ],
    pillars: [
      'Configured IPv6 addressing, link-local interfaces, router IDs, and EIGRP participation across routers, loopbacks, and router-on-a-stick VLAN segments.',
      'Worked with both classic and named EIGRP for IPv6 configurations to understand how adjacency formation and interface activation differ across models.',
      'Applied passive-interface tuning, default-route propagation, summary routes, authentication, and route filtering to improve routing control and reduce unnecessary protocol exposure.',
      'Verified outcomes using commands such as `show ipv6 eigrp neighbors`, `show ipv6 eigrp interfaces`, `show ipv6 route eigrp`, and topology-table inspection.',
    ],
    incidentFlow: [
      {
        title: '1. Establish adjacency',
        text: 'Configured IPv6 unicast routing, router IDs, and interface-level EIGRP activation so neighbors could form correctly across the routed topology.',
      },
      {
        title: '2. Tune route behavior',
        text: 'Adjusted passive interfaces, propagated a default route, and summarized loopback networks to control what was advertised and how efficiently routes were carried.',
      },
      {
        title: '3. Secure and verify',
        text: 'Implemented MD5 and HMAC-SHA-256 authentication, then validated neighbor state, interface participation, and learned routes with verification commands.',
      },
    ],
    deepDive: [
      'Configured passive-interface behavior both per interface and through default-passive methods, which helped reinforce the operational trade-off between reachability and routing-protocol exposure.',
      'Tested two default-route propagation approaches: redistributing a static default route and injecting a summary default route, then compared how they appeared as external versus internal EIGRP routes.',
      'Summarized multiple loopback networks into a single route advertisement to reduce routing-table noise and better understand how summarization affects the rest of the topology.',
      'Implemented interface-based authentication with both MD5 key chains and HMAC-SHA-256, then verified that adjacencies only returned once both ends of a link were configured correctly.',
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
    sidebarNarrative: 'Routing depth beyond “neighbors up”—control plane tuning with evidence from show commands.',
    sidebarFacts: ['Classic and named EIGRP for IPv6', 'MD5 and HMAC-SHA-256 on interfaces'],
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
  return Boolean(job.roleDetail?.length || job.detailOnlyBullets?.length)
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
            <p className={styles.detailLabel}>More Info</p>
            <h1 className={styles.detailTitle}>{job.title}</h1>
            <div className={styles.detailMeta}>
              <span>{job.company}</span>
              <span>{job.period}</span>
              {job.location ? <span>{job.location}</span> : null}
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                {job.roleDetail?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>Role & team</h2>
                    {job.roleDetail.map((paragraph) => (
                      <p key={paragraph} className={styles.detailText}>
                        {renderRichText(paragraph)}
                      </p>
                    ))}
                  </section>
                ) : null}

                {job.detailOnlyBullets?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>Additional work</h2>
                    <ul className={styles.detailBullets}>
                      {job.detailOnlyBullets.map((bullet) => (
                        <li key={bullet}>{renderRichText(bullet)}</li>
                      ))}
                    </ul>
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
                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>{project.overviewTitle || 'Overview'}</h2>
                  <p className={styles.detailText}>{project.summary}</p>
                </section>

                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>{project.pillarsTitle || 'Project Scope'}</h2>
                  <ul className={styles.detailBullets}>
                    {project.pillars.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

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

                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>{project.deepDiveTitle || 'Details'}</h2>
                  <ul className={styles.detailBullets}>
                    {project.deepDive.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

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
  const contactLinks = contactMethods.filter((item) => ['email', 'linkedin', 'github', 'lol'].includes(item.id))
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
                        aria-haspopup="true"
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
                    4th-year BIT (Network Technology) student at Carleton University (expected graduation: April 2027).
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

          <Section id="about" label="// 00 — SUMMARY">
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
                        More info →
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
                            More info
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
                Best reach is email or LinkedIn—links below.
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

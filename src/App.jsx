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
  { value: '500+', label: 'INVENTORY RECORDS' },
]

const KEY_STRENGTHS = ['Routing', 'Automation', 'Operational Support']

const COURSEWORK = [
  'Advanced Network Routing',
  'Network Security',
  'Wireless Networks',
  'DevOps',
  'Networking Tech & Automation',
  'Intermediate Networking',
  'Routing and Switching',
  'Database Concepts & SQL',
]

const EXPERIENCE = [
  {
    slug: 'netdevops-intern',
    period: 'APR 2025 — PRESENT',
    title: 'NetDevOps Intern',
    company: 'Shared Services Canada',
    image: `${BASE}images/aap-logo.png`,
    imageAlt: 'Ansible Automation Platform logo',
    imageContain: true,
    summary:
      'NetDevOps work at Shared Services Canada spanning GitLab identity auditing, Ansible-based device health automation, CI/CD monitoring integration, and Lighthouse-driven inventory validation across large record sets.',
    outcome:
      'Delivered measurable outcomes: 132 inactive GitLab users flagged for deactivation, 75+ devices under automated health polling, Zabbix wired into CI/CD across three tiers, and 500+ inventory records validated through an expanded Lighthouse pipeline.',
    capabilities: [
      'Ansible automation & playbooks',
      'API-driven GitLab workflows',
      'CI/CD and monitoring integration (Zabbix)',
      'Python scripting & reporting',
      'Lighthouse / inventory validation',
      'Linux administration',
    ],
    timelineBullets: [
      'Led a GitLab account audit via the API, identifying 132 inactive users and supporting a deactivation strategy aligned with licensing and platform constraints.',
      'Developed and maintained Ansible playbooks that polled 75+ network devices for health metrics with automated alerting for incident detection.',
      'Integrated Zabbix real-time monitoring into CI/CD pipelines across three environment tiers, removing manual health checks from the release path.',
      'Reworked the Lighthouse audit pipeline to validate six attributes per device (for example IP, DNS, name, model, serial, ownership), improving inventory accuracy across 500+ records.',
    ],
    detailBullets: [
      'Owned the GitLab user audit end to end: API-driven reporting, inactive-user identification (132 accounts), and recommendations that fed licensing and deactivation decisions while respecting platform constraints.',
      'Built and maintained Ansible automation that continuously polled 75+ devices for health signals and escalated anomalies, tightening the loop between infrastructure state and operator response.',
      'Partnered on monitoring strategy by integrating Zabbix into CI/CD across three tiers so deployments were gated on automated health evidence instead of manual checks.',
      'Assessed Ansible Forms and similar self-service patterns for cross-team workflows, producing a scoped roadmap senior engineers accepted for rollout.',
      'Audited and refactored 20+ Ansible playbooks and automated 15 monitoring jobs, cutting redundant steps and stabilizing recurring network checks.',
      'Expanded the Lighthouse audit pipeline to six validated attributes per asset, reducing discrepancies across 500+ inventory rows and giving teams a trustworthy device baseline.',
    ],
  },
  {
    slug: 'lan-operations-technician',
    period: 'MAY 2024 — APR 2025',
    title: 'LAN Operations Technician',
    company: 'Shared Services Canada',
    image: `${BASE}images/ssc-switch-upgrade.png`,
    imageAlt: 'Abdul Rehman Baseem upgrading switches in a network environment',
    summary:
      'Hands-on LAN operations: Juniper-focused firmware upgrades at scale, Visio topology design for NCR sites, and consolidated documentation so field and ops teams could respond faster.',
    outcome:
      'Delivered 50+ switch upgrades aligned to security baselines, formal Visio references for 10+ sites, and centralized documentation that reduced ops lookup time materially.',
    capabilities: [
      'Hands-on enterprise switching',
      'Firmware & image lifecycle',
      'Linux in network operations',
      'Field staging & hardware logistics',
      'Network diagramming & documentation',
      'Multi-site topology design',
    ],
    timelineBullets: [
      'Upgraded firmware on 50+ Juniper EX-4300 switches using Linux-based scripting, closing known gaps and aligning devices to current security baselines.',
      'Authored Visio topology diagrams for 10+ National Capital Region sites covering subnets and physical layout—adopted as the primary reference for field technicians during incidents.',
      'Consolidated fragmented site documentation (configs, topologies, switch inventory) for 10+ sites into one reference system, cutting how long ops spent hunting for answers.',
      'Prepared, packaged, and shipped refreshed hardware for rollout, pairing documentation accuracy with dependable logistics.',
    ],
    detailBullets: [
      'Executed large-scale Juniper EX-4300 firmware upgrades with Linux-assisted workflows, validating images and ensuring every device met the expected security posture before handoff.',
      'Partnered with teams across NCR sites to capture accurate Visio diagrams that engineers relied on during outages because they mirrored both logical and physical reality.',
      'Centralized previously scattered site records so incident responders and planners referenced a single source of truth instead of conflicting spreadsheets or ad hoc notes.',
      'Continued to support USB staging, packaging, and shipping workflows so hardware arrived on site ready for install without rework.',
    ],
  },
]

const SKILLS = {
  Languages: ['Python', 'Java', 'C', 'C++', 'MATLAB', 'TypeScript', 'LC-3', 'Arduino (C/C++)'],
  Networking: [
    'Routing & switching design',
    'Cisco IOS & Juniper Junos CLI',
    'IPv4 / IPv6 operations',
    'BGP route policy',
    'OSPFv2 / OSPFv3',
    'EIGRP tuning & verification',
    'MPLS fundamentals',
    'Spanning tree operations',
  ],
  'Automation & NetDevOps': [
    'Ansible Automation Platform',
    'Infrastructure automation',
    'CI/CD practices',
    'API-driven development',
    'Docker & GitLab workflows',
    'Secrets management',
  ],
  Systems: [
    'Linux administration',
    'Git workflows',
    'Zabbix / NNMI monitoring',
    'Wireshark & packet analysis',
    'PostgreSQL & MySQL',
    'Visio topology documentation',
  ],
}

const PROJECTS = [
  {
    name: 'BlackBoxNet',
    slug: 'blackboxnet',
    year: '2026',
    description: 'Built a network state replay platform that helps operators move from outage symptoms to root cause faster through Git-backed config history, event correlation, topology context, and guided diff analysis.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Git', 'Docker'],
    featured: true,
    image: `${BASE}images/blackboxnet-dashboard.png`,
    fallback: `${BASE}images/blackboxnet-dashboard.png`,
    imagePosition: 'center top',
    github: null,
    external: null,
    detailMeta: ['Product concept + full-stack build', 'Simulation-driven MVP', 'NetDevOps / observability'],
    outcome: 'Turned outage analysis into a clearer operator workflow by connecting evidence, topology, and root-cause explanation in one interface.',
    overviewTitle: 'Overview',
    pillarsTitle: 'What BlackBoxNet Is Trying To Accomplish',
    flowTitle: 'Incident Explanation Experience',
    deepDiveTitle: 'Why The Demo Works',
    learningTitle: 'What I Learned',
    screenshotsIntro:
      'These screens show the part of the product I focused on most: turning outage evidence into a clean, guided investigation flow.',
    sidebarNarrativeTitle: 'Why it feels human',
    sidebarTraitsTitle: 'Key product traits',
    sidebarNarrative:
      'Instead of stopping at "an outage happened," the product is built to explain the chain of reasoning behind that conclusion. That is what makes the demo feel more like a real operational tool and less like a backend debug screen.',
    summary:
      'BlackBoxNet is a network-state replay platform built to make outage analysis more explainable. The idea was to treat an incident like a flight recorder for infrastructure: capture configuration history, metrics, and event timing, then reconstruct what changed before service failed so an operator can move from symptoms to root cause quickly.',
    objective:
      'The product is trying to solve a common problem in network operations: teams can see that something is broken, but it is often slow and messy to prove which change caused it, how that change propagated downstream, and what the next remediation step should be. BlackBoxNet turns that investigation into a guided workflow instead of a pile of disconnected logs and device outputs.',
    humanSummary: [
      {
        label: 'What it does',
        value: 'Turns raw network state, config history, and health events into a guided outage investigation flow.',
      },
      {
        label: 'Core idea',
        value: 'Treat the network like a black box recorder so operators can replay what changed before an outage.',
      },
      {
        label: 'Why it matters',
        value: 'Makes the root cause easier to explain to engineers, interviewers, and non-specialists without losing technical depth.',
      },
      {
        label: 'Next action',
        value: 'Surface the most suspicious config change fast, then connect it to evidence and a clear remediation recommendation.',
      },
    ],
    pillars: [
      'Record configuration snapshots, metrics, and events into a Git-backed timeline so the system always has historical context.',
      'Correlate symptoms like latency spikes, packet loss, interface degradation, and outages against the exact config changes that happened before them.',
      'Explain incidents in plain language first, then let a deeper layer reveal the raw config diff, rule identifiers, and supporting evidence.',
      'Keep the demo deterministic enough for interviews and portfolio walkthroughs while still feeling like a believable NOC / NetDevOps product.',
    ],
    incidentFlow: [
      {
        title: '1. Summary before detail',
        text: 'The incident page is designed to answer what broke, where it broke, and who was affected within a few seconds, before the viewer has to parse any raw telemetry.',
      },
      {
        title: '2. Root cause with evidence',
        text: 'BlackBoxNet highlights the most suspicious config change, ties it to the affected device and subnet, and shows why that change matters in human-readable language.',
      },
      {
        title: '3. Timeline to action',
        text: 'The investigation then walks through the event chain in chronological order and ends with an explicit recommendation such as rolling back or reordering an ACL entry.',
      },
    ],
    deepDive: [
      'Phase 1 replays a deterministic ACL regression across three devices so the product can prove its UX, correlation logic, and diff experience in a controlled environment.',
      'Phase 1.5 extends the concept by allowing one device to provide a live running-config over SSH while keeping the rest of the timeline simulated, which helps bridge the gap between a pure demo and a real operational workflow.',
      'The incident explanation flow became the strongest part of the project because it turns backend signals such as config diffs, suspicion flags, and topology context into a narrative that feels understandable instead of noisy.',
    ],
    learningNotes: [
      'I got better at translating low-level technical signals into product decisions that make the investigation feel clear instead of overwhelming.',
      'The project reinforced how valuable explainability is in infrastructure tools, especially when the audience includes operators, recruiters, and non-specialist reviewers.',
      'It also sharpened my thinking around full-stack system design, where backend evidence only becomes valuable once the frontend makes the story understandable.',
    ],
    screenshots: [
      {
        src: `${BASE}images/blackboxnet-incident.png`,
        alt: 'BlackBoxNet incident summary and correlation analysis screen',
        eyebrow: 'Incident investigation',
        title: 'Guided summary and recommendation',
        caption:
          'This view condenses the outage into a recruiter-friendly story: impacted subnet, root device, correlation analysis, supporting flags, and a recommendation banner that clearly points toward the next operator action.',
      },
      {
        src: `${BASE}images/blackboxnet-outage.png`,
        alt: 'BlackBoxNet root cause mismatch and investigation timeline screen',
        eyebrow: 'Evidence layer',
        title: 'Root cause + event timeline',
        caption:
          'The deeper evidence layer connects the suspicious ACL change to the degradation sequence, showing which event is treated as the primary suspect and giving the operator a direct path into the config diff.',
      },
    ],
    sidebarFacts: [
      'React + TypeScript frontend with a FastAPI backend and PostgreSQL persistence.',
      'Git-backed config history for replayable snapshots and diff generation.',
      'Rules-based correlation engine chosen intentionally for explainability.',
      'Compact topology preview to keep the affected path and root device visible during an incident.',
    ],
  },
  {
    name: 'IPv6 EIGRP Network',
    slug: 'ipv6-eigrp-network',
    year: '2024',
    description: 'Built and tuned a multi-router IPv6 EIGRP lab with named and classic configurations, passive-interface controls, route summarization, authentication, and route filtering to strengthen end-to-end routing validation.',
    tags: ['IPv6 EIGRP', 'Routing tuning & security', 'Topology documentation'],
    image: `${BASE}images/ipv6-network.png`,
    fallback: `${BASE}images/ipv6-network-placeholder.svg`,
    imagePosition: 'center center',
    github: null,
    external: null,
    detailMeta: ['Advanced routing lab', 'IPv6 control-plane tuning', 'Cisco Packet Tracer'],
    outcome: 'Strengthened practical IPv6 routing skills by moving beyond adjacency setup into tuning, security, summarization, and verification.',
    overviewTitle: 'Overview',
    pillarsTitle: 'What The Lab Covered',
    flowTitle: 'Key Routing Tasks',
    deepDiveTitle: 'What I Validated',
    learningTitle: 'What I Learned',
    screenshotsIntro:
      'This project focused on configuring, tuning, and verifying EIGRP for IPv6 across a multi-router topology rather than building a frontend product.',
    sidebarNarrativeTitle: 'Why it matters',
    sidebarTraitsTitle: 'Key technical areas',
    summary:
      'This lab focused on implementing and tuning EIGRP for IPv6 across a routed topology with multiple interfaces, loopbacks, and VLAN segments. I used it to build stronger hands-on understanding of how IPv6 EIGRP adjacencies form, how route exchange behaves across classic and named configurations, and how control-plane choices affect convergence and visibility.',
    objective:
      'The work went beyond basic adjacency setup. I configured IPv6 unicast routing, router IDs, interface-level EIGRP participation, passive-interface controls, default-route propagation, route summarization, authentication, load-balancing behavior, and route filtering so the lab reflected a more realistic routing-engineering exercise.',
    humanSummary: [
      {
        label: 'What it does',
        value: 'Implements and tunes EIGRP for IPv6 across a multi-router topology with routed links, VLAN interfaces, and loopbacks.',
      },
      {
        label: 'Core focus',
        value: 'Move from basic adjacency formation to stronger control over propagation, summarization, authentication, and verification.',
      },
      {
        label: 'Why it matters',
        value: 'Shows practical routing depth beyond simple Packet Tracer connectivity by validating how protocol behavior changes with tuning decisions.',
      },
      {
        label: 'Outcome',
        value: 'Built confidence with IPv6 routing operations, verification commands, and optimization techniques used in larger network environments.',
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
    learningNotes: [
      'This lab helped me understand that routing work is not just about making neighbors come up, but about controlling how routes are advertised, summarized, and protected.',
      'I became more confident reading verification outputs and comparing how EIGRP behavior changes when passive interfaces, summaries, default routes, and authentication are introduced.',
      'It also gave me stronger hands-on comfort with protocol tuning choices that affect scalability, visibility, and operational security.',
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
    sidebarNarrative:
      'This project is valuable because it shows routing depth, not just configuration familiarity. It demonstrates that I can move from getting EIGRP for IPv6 working to tuning, securing, summarizing, and verifying it in a more disciplined way.',
    sidebarFacts: [
      'Classic and named EIGRP for IPv6 configuration models.',
      'Passive interfaces, summarization, default-route propagation, and filtering.',
      'MD5 and HMAC-SHA-256 authentication at the interface level.',
      'Hands-on verification of neighbors, interfaces, topology, and learned routes.',
    ],
    configLinks: [
      { label: 'Router R1 configuration', href: `${BASE}configs/eigrp/r1.txt` },
      { label: 'Router R2 configuration', href: `${BASE}configs/eigrp/r2.txt` },
      { label: 'Router R3 configuration', href: `${BASE}configs/eigrp/r3.txt` },
      { label: 'Switch D1 configuration', href: `${BASE}configs/eigrp/d1.txt` },
      { label: 'Switch D2 configuration', href: `${BASE}configs/eigrp/d2.txt` },
    ],
  },
]

const EXPERIENCE_LINKS = EXPERIENCE.map((job) => ({
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
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>Summary</h2>
                  <p className={styles.detailText}>{job.summary}</p>
                </section>

                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>Core capabilities</h2>
                  <div className={styles.detailSkills}>
                    {job.capabilities.map((item) => (
                      <span key={item} className={styles.detailSkillTag}>
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>Key Contributions</h2>
                  <ul className={styles.detailBullets}>
                    {job.detailBullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>
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
                  <p className={styles.detailSidebarText}>
                    Work completed within a federal government environment focused on secure, large-scale infrastructure operations.
                  </p>
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

            <div className={styles.projectSummaryGrid}>
              {project.humanSummary.map((item) => (
                <section key={item.label} className={styles.projectSummaryCard}>
                  <p className={styles.projectSummaryLabel}>{item.label}</p>
                  <p className={styles.projectSummaryValue}>{item.value}</p>
                </section>
              ))}
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                <section className={styles.detailSection}>
                  <h2 className={styles.detailSectionTitle}>{project.overviewTitle || 'Overview'}</h2>
                  <p className={styles.detailText}>{project.summary}</p>
                  <p className={styles.detailText}>{project.objective}</p>
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

                {project.learningNotes?.length ? (
                  <section className={styles.detailSection}>
                    <h2 className={styles.detailSectionTitle}>{project.learningTitle || 'What I Learned'}</h2>
                    <ul className={styles.detailBullets}>
                      {project.learningNotes.map((item) => (
                        <li key={item}>{item}</li>
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
                    NetDevOps Intern
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
                    3rd-year IT (Network Technology) at Carleton. Shared Services Canada: GitLab audit surfacing 132 inactive users, Ansible health polling
                    across 75+ devices, Lighthouse validation for 500+ inventory records, and 50+ Juniper switch upgrades. Open to Fall 2026 internships and
                    new grad roles in networking, NetDevOps, and infrastructure automation.
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
                    <p className={styles.timelineOutcome}>{job.outcome}</p>
                    <div className={styles.timelineRule} />
                    <ul className={styles.timelineBullets}>
                      {job.timelineBullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <a href={`#/${EXPERIENCE_ROUTE_PREFIX}${job.slug}`} className={styles.caseStudyLink}>
                      More info →
                    </a>
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
              <div className={styles.courseworkHeader}>
                <p className={styles.aboutKicker}>Selected Coursework</p>
                <p className={styles.courseworkText}>
                  Routing, security, wireless, automation, and systems foundations.
                </p>
              </div>
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
                    <div className={styles.projectMetaRow}>
                      <div className={styles.projectTags}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.projectTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className={styles.projectYear}>{project.year}</span>
                    </div>
                    <h2 className={styles.projectTitle}>{project.name}</h2>
                    <p className={styles.projectOutcome}>{project.outcome}</p>
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
                            Live link
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

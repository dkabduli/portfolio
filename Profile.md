# Candidate Profile — Abdul Rehman Baseem

## Basic Information

| Field | Value |
|---|---|
| **Phone** | +1 (343) 540-7126 |
| **Email** | abdulrehman6@cmail.carleton.ca |
| **LinkedIn** | linkedin.com/in/abdulrehmanbaseem |
| **GitHub** | github.com/dkabduli |
| **Portfolio** | dkabduli.github.io/portfolio |

---

## Education

**Bachelor of Information Technology – Network Technology (B.IT.)**
Carleton University (joint with Algonquin College)

- **Expected Graduation:** April 2027
- **Status:** Entering 4th Year
- **Location:** Ottawa, Ontario, Canada

---

## Work Authorization & Clearance

- Canadian citizen (no sponsorship required)
- **Secret Security Clearance** — Government of Canada
  - Issued: April 2025 · Expires: April 2035
  - Active federal clearance — eligible for classified roles and environments requiring GoC Secret-level screening

---

## Professional Experience

### Infrastructure Development Intern
**Shared Services Canada** · May 2026 – Present

- Designed and shipped the CWS Intake App — a production full-stack replacement (Next.js 15, React 19, Prisma, PostgreSQL 16, Docker, Zod; 22 API route files, 10 Prisma models, 16 migrations) for a legacy Excel-based Commercial Wireless Services intake process — with an 8-status request lifecycle, role-based access across 4 global and 5 request membership roles (Admin/SSC/Client/GC WiFi), protected client collaboration links validated by 48 automated tests, multi-building/campus support, Microsoft Entra SAML SSO, audit tracking across 5 categories and 8 sources, and PostgreSQL full-text/trigram search; released through 5 quality gates (TypeScript, build, Vitest, Playwright, smoke tests).
- Built a scheduled Python Mailbox-to-Taiga service (10 source modules, 25 automated tests) that reads a Microsoft 365 shared mailbox via least-privilege Microsoft Graph Mail.Read, deduplicates processed mail by Graph and internet message IDs, auto-creates and routes Taiga tickets (with shared-bin fallback and project-membership validation), and posts Teams notifications and daily open-ticket reminders — validated in safe-by-default dry-run mode before production rollout.
- Reduced ticket intake overhead across 10+ infrastructure service areas by designing and deploying an n8n automated routing workflow — validated against 25+ production-ready NetOps tickets under SSC change-control approval.
- Achieved zero-data-loss platform migration of n8n and DocuSeal from dev01 to app01 — verified across 120 templates, 251 completed documents, and 494 storage objects — cutting deployment recovery time from 20–30 min to under 10 min.

---

### NetDevOps Intern
**Shared Services Canada** · April 2025 – April 2026

- Reduced platform licensing costs by identifying 132 inactive accounts across the full organizational GitLab instance via a REST API audit script.
- Improved network health coverage across 75+ devices by building Ansible playbooks that automated continuous polling and alert triggering.
- Cut SSL/TLS certificate provisioning from 20–30 minutes to under 2 minutes per request by building Ansible automation across 5 roles — CSR generation, private key handling, and OpenSSL Jinja2 templating in the expected TLS Protect/Azure format; extended the role structure into patching validation for 14 documented Linux servers across Barrie EC63 and Borden EC04 (12 netops-managed + 2 BOKS-access, spanning primary/secondary/backup/jump/lab groups).
- Cut incident detection lag from hours to minutes by integrating Zabbix real-time monitoring into GitLab CI/CD pipeline gates across dev, staging, and prod.
- Improved automation reliability by refactoring 20+ Ansible playbooks and automating 15 monitoring jobs — eliminating 30% of redundant execution steps.

---

### LAN Operations Technician
**Shared Services Canada** · May 2024 – April 2025

- Brought 50+ Juniper EX-4300 switches into full security baseline compliance via Linux-based batch firmware scripting — remediating CVE-flagged vulnerabilities during approved maintenance windows.
- Reduced bridge call resolution time by ~40% across 10+ NCR sites by designing Visio topology diagrams formally adopted as the single source of truth for field technicians.

---

## Key Project

### BlackBoxNet
- **Stack:** FastAPI, React, TypeScript, PostgreSQL, Docker, Git, GitHub Actions CI
- **Live:** blackboxnet-web.onrender.com
- **Repo:** github.com/dkabduli/BlackBoxNet
- End-to-end network replay platform with 12 scripted multi-vendor outage labs (Cisco, Juniper, Nokia)
- Git-backed config history, semantic diff engine, and vendor-specific root-cause correlation
- Deployed on Render with Neon PostgreSQL; GitHub Actions CI on push to main
- scenario_id namespacing isolates all labs — reset or vendor switch never corrupts another lab's state

---

## Volunteering

### General Volunteer — Human Concern International
**Jan 2021 – Present (5+ years)** · Disaster & Humanitarian Relief
- Supporting disaster relief efforts including coordinating medical equipment and aid box shipments to Lebanon.
- Raising awareness for indigenous injustices in Canada.

### Volunteer — Carleton University Muslim Students' Association
**Sep 2024 – Present** · Education & Community
- Supporting educational programming, student outreach, and community events at Carleton University.

### Community Volunteer — Penny Appeal Canada
**May 2021 – 2024** · Poverty Alleviation
- Contributed to Penny Appeal's mission of supporting underserved communities through volunteer-driven outreach and fundraising.

### Fundraiser & Member — Relay For Life
**Dec 2022 – Jun 2023** · Health & Cancer Research
- Raised funds to support cancer research and provide community resources to those affected by cancer.

---

## Technical Skills

### Programming & Development
Python, Java, C, C++, TypeScript, React, FastAPI, MATLAB, LC-3 Assembly

### Networking
TCP/IP, BGP, OSPFv2/v3, EIGRP, MPLS, STP, VLANs, ARP, RIP
Cisco IOS CLI, Juniper Junos, Aruba CLI

### Automation & DevOps
Ansible Automation Platform (AAP), Docker, Git, GitLab CI/CD, n8n, OpenSSL, REST APIs, GitHub Actions

### Monitoring & Observability
Zabbix, NNMI, Elasticsearch, Wireshark

### Cloud & Infrastructure
Azure (pre-production), VMware Fusion, HashiCorp Vault, Linux

### Databases
MySQL, PostgreSQL

### Security
Firewalls, VPN, IDPS, Network Hardening

### Tools
VS Code, PyCharm, PuTTY, MobaXterm, Visio, DocuSeal

---

## Academic Technical Foundation (from Coursework)

### Networking & Infrastructure
- Enterprise routing & switching (OSPF, BGP, MPLS, VLANs, STP)
- Wireless networking (802.11, RF design)
- Network troubleshooting and performance optimization
- Software-defined networking and API-based automation

### Systems & OS
- Linux, Unix, Windows Server administration
- DNS, DHCP, SMTP, HTTP, SSH configuration
- Virtualization and server environments

### Security
- Network security architecture (firewalls, VPNs, IDPS)
- Cloud and IoT security fundamentals
- Adversarial ML and advanced threat models

### Software & Data
- Data structures (trees, graphs, recursion)
- SQL, database design, normalization
- Web development (HTML, CSS, JS, HTTP)

### Cloud & Modern Infrastructure
- Virtual machines, containers, orchestration
- Cloud provisioning and micro-segmentation

### Real-Time & Systems Programming
- Concurrency, interrupts, synchronization
- Low-level programming concepts

---

## Selected Coursework

DevOps · Real-time Systems · Network Management and ML · IP Architecture and Solutions ·
Desktop and Server Environments II · Transmission Systems · Computer Architecture ·
Wireless Networks · Data Structures · Databases

---

## Soft Skills

- Technical writing and communication
- Cross-team collaboration in enterprise environments
- Problem-solving and analytical thinking
- Project ownership and initiative
- Business and operational awareness

---

## Target Roles

**Tier 1 (Primary)**
- Network Engineer (New Grad)
- DevOps / NetDevOps Engineer
- Network Automation Engineer
- Infrastructure / Cloud Network Engineer

**Tier 2 (Secondary)**
- Software Developer (Backend / Full-Stack)
- Site Reliability Engineer (SRE)
- Cloud Engineer

**Tier 3 (Broad)**
- Junior IT Analyst
- Junior Developer (any stack)
- Systems / Operations roles

---

## Professional Summary

Fourth-year B.IT. Network Technology student at Carleton University with hands-on experience at Shared Services Canada across infrastructure automation, NetDevOps, and enterprise networking — deployed under federal change-control and security baseline requirements. Holds an active Secret Security Clearance (GoC, 2025–2035). Proven ability to build scalable automation systems using Ansible, Docker, and CI/CD pipelines, alongside strong networking fundamentals (BGP, OSPF, MPLS). Creator of BlackBoxNet, a multi-vendor network simulation platform demonstrating full-stack and DevOps capabilities. Seeking new grad roles in network engineering, DevOps, or backend development.

---

## Constraints for AI Resume Generation (CRITICAL)

- Do **NOT** invent: certifications (beyond the GoC Secret Clearance), new roles, companies, or projects
- Only reword and reorder existing experience
- Degree must always be listed as "Expected April 2027"
- Always include BlackBoxNet when relevant
- Emphasize Shared Services Canada (3 co-op terms) for credibility
- Always mention Secret Security Clearance for government/federal-facing roles
- Canadian citizen — no sponsorship required

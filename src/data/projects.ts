// ================================================================
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Source of truth: data/projects.yaml (in this repo)
// To add/edit a project, update data/projects.yaml and push.
// ================================================================

import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    "slug": "microservices-demo",
    "title": "End-to-End DevOps: Polyglot Microservices GitOps on EKS",
    "category": "platform",
    "status": "completed",
    "year": 2025,
    "shortDescription": "10-service polyglot app on Amazon EKS with DevSecOps CI, ArgoCD GitOps, full observability, and autoscaling. 6-phase runbook with 24 decisions and 9 terminal sessions.",
    "description": "Forked Google's Online Boutique (10-service polyglot monorepo), built a production-grade DevOps pipeline from scratch. CI pipeline uses GitHub Actions with monorepo change detection, Trivy security scanning, and GHCR publish. Helm chart packaged from upstream and published to GHCR as an OCI artifact. Deployed via ArgoCD with Image Updater (digest strategy) for continuous delivery. Platform includes Gateway API (single shared ALB, 5 subdomains), ExternalDNS (zero manual DNS records), kube-prometheus-stack with Slack alerting, ELK stack for log aggregation, and HPA autoscaling. Infrastructure provisioned via Terraform on KodeKloud AWS Playground. Documented across 6 runbook phases with 24 architectural decisions, 9 terminal session recordings, and 12 verification screenshots.",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Built 3 GitHub Actions workflows: monorepo change detection with matrix dispatch, Trivy FS + image scanning, Helm chart OCI publish to GHCR",
          "Deployed 10 microservices via ArgoCD from a Helm chart on GHCR, with patch-only values (5 fields) and zero upstream file modifications",
          "Configured Gateway API with a single shared ALB serving 5 subdomains behind one wildcard ACM certificate",
          "Implemented full observability: Prometheus + Grafana + AlertManager (Slack), Elasticsearch + Filebeat + Kibana",
          "Documented 24 architectural decisions, recorded 9 terminal sessions, captured 12 verification screenshots across 6 runbook phases"
        ]
      },
      {
        "title": "Key Decisions",
        "items": [
          "Evolved image tagging through 3 iterations (chart version, SHA, digest), landing on ArgoCD Image Updater after debugging BuildKit epoch timestamp incompatibility",
          "Chose Gateway API over Ingress because the Kubernetes project recommends it and the Ingress API has been frozen",
          "ArgoCD manages the app, not the platform stack. If ArgoCD breaks, Prometheus and Grafana remain operational for debugging",
          "Patch-only Helm values: only 5 fields that differ from upstream. If the default is correct, it is not listed",
          "CI has zero knowledge of the cluster for code pushes. Image Updater owns deployment, eliminating the GIT_TOKEN dependency"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "gitops",
      "observability",
      "iac",
      "kubernetes",
      "networking",
      "security",
      "autoscaling",
      "containerization"
    ],
    "tech": [
      "GitHub Actions",
      "Trivy",
      "Docker",
      "Helm",
      "Kustomize",
      "ArgoCD",
      "Terraform",
      "Amazon EKS",
      "Gateway API",
      "Prometheus",
      "Grafana",
      "Elasticsearch",
      "Kibana",
      "Route 53",
      "GHCR"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/microservices-demo"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/microservices-demo/"
      }
    ],
    "featured": true
  },
  {
    "slug": "bankingapp-java-mysql",
    "title": "BankingApp Java MySQL",
    "category": "platform",
    "status": "completed",
    "year": 2024,
    "shortDescription": "2-tier Spring Boot banking app with Jenkins CI/CD, SonarQube quality gates, Nexus artifact management, and Kubernetes deployment with HPA.",
    "description": "Production-grade deployment of a Spring Boot banking application demonstrating the complete DevOps lifecycle from source to deployment. Implemented Jenkins CI/CD pipeline with SonarQube code quality enforcement, Nexus artifact repository integration, and Kubernetes deployment with Horizontal Pod Autoscaling.",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Containerized multi-tier Java application; reduced environment setup from 2 hours to docker compose up",
          "Implemented SonarQube quality gate blocking deployment on critical vulnerabilities",
          "Automated artifact versioning via Nexus; eliminated manual JAR management",
          "Configured Jenkins pipeline with parallel stages reducing build time by 40%",
          "Deployed on Kubernetes with Horizontal Pod Autoscaling based on CPU metrics"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "containerization",
      "kubernetes",
      "security"
    ],
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "MySQL",
      "Kubernetes",
      "Spring Boot"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/BankingApp-Java-MySQL"
      }
    ],
    "featured": true
  },
  {
    "slug": "ci-cd-stack",
    "title": "Complete CI/CD Stack",
    "category": "tool",
    "status": "completed",
    "year": 2024,
    "shortDescription": "Self-hosted DevOps environment: Jenkins, SonarQube, Nexus, GitLab orchestrated via Docker Compose. Single-command provisioning.",
    "description": "Self-hosted CI/CD infrastructure stack demonstrating enterprise DevOps tool integration. Orchestrates Jenkins, SonarQube, Nexus, and GitLab via Docker Compose for rapid, reproducible environment provisioning.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Setting up a CI/CD environment from scratch took hours of manual configuration across 4 different tools",
          "Team members could not reproduce the same environment locally, causing CI drift between dev and production"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Single-command provisioning: docker compose up brings up Jenkins, SonarQube, Nexus, and GitLab in minutes",
          "Jenkins shared libraries eliminate pipeline duplication by 70%",
          "LDAP authentication centralized across all 4 services",
          "Automated backup strategy with 7-day retention for artifact repository",
          "Complete setup documentation enabling team onboarding in under 1 hour"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "containerization"
    ],
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "GitLab",
      "Nginx"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/ci-cd-stack"
      }
    ],
    "featured": true
  },
  {
    "slug": "debugbox",
    "title": "DebugBox",
    "category": "tool",
    "status": "maintained",
    "year": 2024,
    "shortDescription": "Interactive debugging container with 50+ networking and troubleshooting tools. Multi-arch (amd64/arm64). Published on Docker Hub and GHCR.",
    "description": "Purpose-built Docker image for infrastructure debugging and network troubleshooting. Designed for Kubernetes pod debugging, container networking issues, and production incident response. Available on Docker Hub and GitHub Container Registry with multi-architecture support.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Debugging Kubernetes pods required SSHing into nodes or attaching to minimal distroless containers with no tools",
          "Installing curl, dig, tcpdump one by one inside ephemeral containers wasted 15+ minutes every debugging session",
          "Existing tools like nicolaka/netshoot lacked cloud CLI tools (aws, gcloud) and infrastructure utilities (terraform, helm)"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Single container with 50+ networking, DNS, HTTP, TLS, and cloud CLI tools pre-installed",
          "kubectl debug node, ephemeral container attach, or standalone pod: works in all debugging patterns",
          "Multi-architecture (amd64/arm64) so it runs on any node type including ARM-based Graviton instances",
          "Reduced average debugging session setup from 15 minutes to under 30 seconds"
        ]
      },
      {
        "title": "Why DebugBox",
        "items": [
          "Includes cloud CLIs (aws, gcloud, az) that netshoot and busybox lack",
          "Includes infrastructure tools (terraform, helm, kubectl) for full-stack debugging from inside the cluster",
          "Version-pinned tool inventory for reproducibility across environments",
          "Published on both Docker Hub and GHCR with automated CI on tag creation"
        ]
      }
    ],
    "tags": [
      "containerization",
      "kubernetes",
      "networking"
    ],
    "tech": [
      "Docker",
      "Bash",
      "GitHub Actions",
      "Kubernetes"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/DebugBox"
      },
      {
        "type": "website",
        "url": "https://debugbox.ibtisam-iq.com"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/containers/debugbox/"
      }
    ],
    "featured": true
  },
  {
    "slug": "silverstack",
    "title": "SilverStack Dev Machine",
    "category": "tool",
    "status": "maintained",
    "year": 2025,
    "shortDescription": "Custom rootfs micro VM on iximiuz Labs with 15+ DevOps tools pre-installed. Reusable Terraform configs for EKS, VPC, and bastion hosts.",
    "description": "A custom-built cloud-native development workstation and infrastructure code repository. The dev machine is a custom rootfs micro VM on iximiuz Labs with kubectl, eksctl, terraform, helm, helmfile, aws cli, and more pre-installed. Also contains reusable, tested Terraform configurations for EKS on KodeKloud (SCP-aware), VPC, and bastion hosts.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Every new project required 30+ minutes of tool installation on fresh VMs or cloud shells",
          "Tool versions drifted between projects causing subtle compatibility issues",
          "Terraform configs were copy-pasted between repos with no single source of truth"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Custom rootfs image with 15+ DevOps tools pre-installed, tab completion configured, shell aliases ready",
          "Zero setup time: launch the playground and start working immediately",
          "Reusable Terraform modules (EKS, VPC, bastion) tested across multiple projects and KodeKloud SCP constraints",
          "Single repo (silver-stack) as infrastructure code source of truth, cloned into every project"
        ]
      }
    ],
    "tags": [
      "iac",
      "containerization"
    ],
    "tech": [
      "Docker",
      "Terraform",
      "Bash",
      "AWS",
      "Kubernetes"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/silver-stack"
      },
      {
        "type": "playground",
        "url": "https://labs.iximiuz.com/playgrounds/SilverStack-dev-machine-e672bcf7"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/containers/iximiuz/rootfs/setup-dev-machine-rootfs-image/"
      }
    ],
    "featured": false
  },
  {
    "slug": "custom-ubuntu-rootfs",
    "title": "Custom Ubuntu Rootfs",
    "category": "tool",
    "status": "completed",
    "year": 2024,
    "shortDescription": "Minimal Ubuntu base filesystem for containers. 40% smaller than official images, security-hardened, published to GHCR.",
    "description": "Custom-built Ubuntu root filesystem optimized for container workloads. Focused on minimal attack surface, optimal layer caching for CI/CD pipelines, and reproducible builds.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Official Ubuntu Docker images ship with 180MB+ of packages, most unnecessary for containerized applications",
          "Bloated base images slow CI pipelines, increase attack surface, and waste registry storage"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Built from debootstrap: 110MB, 40% smaller than the official image",
          "Removed 47 unnecessary packages while keeping essential utilities",
          "Automatic security updates via unattended-upgrades",
          "Multi-stage Docker build pattern for optimal layer caching",
          "Published to GHCR with automated versioning via GitHub Actions"
        ]
      }
    ],
    "tags": [
      "containerization",
      "security"
    ],
    "tech": [
      "Docker",
      "Ubuntu",
      "Bash",
      "GitHub Actions"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/custom-ubuntu-rootfs"
      }
    ],
    "featured": false
  },
  {
    "slug": "runbook",
    "title": "Engineering Runbook",
    "category": "reference",
    "status": "maintained",
    "year": 2025,
    "shortDescription": "Production engineering runbook documenting real deployments, troubleshooting, and architectural decisions. Engineering journal format with MkDocs Material.",
    "description": "Personal engineering runbook documenting every project deployment, bug fix, and architectural decision. Written in first-person past tense (engineering journal format) with MkDocs admonition blocks for decisions, terminal session recordings as evidence, and hyperlinked cross-references across runbooks. Covers AWS, Kubernetes, Terraform, CI/CD, GitOps, and observability.",
    "sections": [
      {
        "title": "What It Covers",
        "items": [
          "6-phase microservices-demo runbook with 24 architectural decisions and 9 terminal session recordings",
          "AWS runbooks: Route 53, ACM, EKS provisioning on KodeKloud with SCP constraints",
          "Kubernetes add-on runbooks: ALB Controller, EBS CSI, Gateway API, ExternalDNS, ArgoCD",
          "Infrastructure runbooks: Terraform for EKS, CloudFormation for self-managed nodes, client tool installation"
        ]
      },
      {
        "title": "Writing Approach",
        "items": [
          "Engineering journal format: first person, past tense, recording what was done and why",
          "Bugs documented inline where they happened, not in a separate troubleshooting appendix",
          "Architectural decisions as MkDocs admonition blocks (abstract, info, warning, danger)",
          "Cross-linked ecosystem: runbooks reference each other via hyperlinks, forming a navigable knowledge graph"
        ]
      }
    ],
    "tags": [
      "documentation"
    ],
    "tech": [
      "MkDocs",
      "GitHub Actions",
      "Cloudflare Pages",
      "Python"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/runbook"
      },
      {
        "type": "website",
        "url": "https://runbook.ibtisam-iq.com"
      }
    ],
    "featured": true
  },
  {
    "slug": "nectar",
    "title": "Nectar Documentation Hub",
    "category": "reference",
    "status": "maintained",
    "year": 2024,
    "shortDescription": "Technical knowledge base with 200+ pages covering DevOps tools, cloud platforms, and infrastructure patterns. Built with MkDocs Material.",
    "description": "Centralized documentation platform for DevOps knowledge management. Features automated deployment pipeline with version control and search indexing. Covers Docker, Kubernetes, Terraform, AWS, CI/CD, Linux, networking, and more.",
    "sections": [
      {
        "title": "What It Covers",
        "items": [
          "200+ pages across Docker, Kubernetes, Terraform, AWS, CI/CD, Linux, and networking",
          "Structured content taxonomy with search indexing across all pages",
          "Dark mode theme matching the broader portfolio site design system"
        ]
      },
      {
        "title": "How It Is Built",
        "items": [
          "MkDocs Material with GitHub Actions CI: auto-deploys on push",
          "Cloudflare Pages hosting with CDN, 95+ PageSpeed score and global edge caching",
          "Version-controlled content with full Git history for every page"
        ]
      }
    ],
    "tags": [
      "documentation"
    ],
    "tech": [
      "MkDocs",
      "GitHub Actions",
      "Cloudflare Pages",
      "Python"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/nectar"
      },
      {
        "type": "website",
        "url": "https://nectar.ibtisam-iq.com"
      }
    ],
    "featured": false
  }
]

export const getProjectsByCategory = (category: Project["category"]) =>
  projects.filter((p) => p.category === category)

export const getProjectsByStatus = (status: Project["status"]) =>
  projects.filter((p) => p.status === status)

export const getProjectsByTech = (tech: string) =>
  projects.filter((p) => p.tech.includes(tech))

export const getFeaturedProjects = () =>
  projects.filter((p) => p.featured)

export const getAllTechTags = (): string[] => {
  const techSet = new Set<string>()
  projects.forEach((p) => p.tech.forEach((t: string) => techSet.add(t)))
  return Array.from(techSet).sort()
}

export const getAllCapabilityTags = (): string[] => {
  const tagSet = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export const getAllYears = (): number[] => {
  const yearSet = new Set<number>()
  projects.forEach((p) => yearSet.add(p.year))
  return Array.from(yearSet).sort((a, b) => b - a)
}

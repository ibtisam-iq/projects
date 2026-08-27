// Single source of truth for the tech/tag taxonomy. scripts/generate-projects.js
// validates every project in data/projects.yaml against this file at build time,
// and src/utils/toolCategories.ts groups the tools popover from it. A tool or tag
// used in the YAML but missing here fails the build instead of compiling silently.

export type DomainId =
  | "cloud-iac"
  | "containers-orch"
  | "cicd-gitops"
  | "security"
  | "observability"
  | "runtimes-data"

export interface Domain {
  id: DomainId
  label: string
  icon: string
  description: string
}

export const DOMAINS: Domain[] = [
  {
    id: "cloud-iac",
    label: "Cloud & Infrastructure as Code",
    icon: "☁️",
    description: "AWS provisioning, Terraform, CloudFormation",
  },
  {
    id: "containers-orch",
    label: "Containers & Orchestration",
    icon: "🐳",
    description: "Docker, Kubernetes, Helm, Gateway API",
  },
  {
    id: "cicd-gitops",
    label: "CI/CD & GitOps",
    icon: "🔄",
    description: "Pipelines, ArgoCD, registries, build tooling",
  },
  {
    id: "security",
    label: "Security & DevSecOps",
    icon: "🛡️",
    description: "Scanning, quality gates, IAM & audit",
  },
  {
    id: "observability",
    label: "Observability & Monitoring",
    icon: "📊",
    description: "Metrics, logging, alerting",
  },
  {
    id: "runtimes-data",
    label: "Runtimes, Languages & Data",
    icon: "🧩",
    description: "Languages, frameworks, databases, edge",
  },
]

export interface TechMeta {
  /** Which of the six domains this technology belongs to. */
  domain: DomainId
  /**
   * Whether ibtisam-iq.com shows this on its visible tools page.
   *
   * false does not mean unimportant or hidden from this site. It means the entry is
   * an application-layer dependency or a convenience CLI, so listing it among the
   * tools a DevOps engineer operates would dilute that page rather than strengthen
   * it. Hidden entries are still counted, still matched against projects, and still
   * indexed in the portfolio's keyword block for recruiter tooling.
   *
   * Required rather than optional on purpose: a new technology cannot slip onto the
   * portfolio unreviewed.
   */
  showcase: boolean
}

// One entry per real tech string. Keys must match data/projects.yaml `tech:`
// entries exactly (including "Amazon X" vs "X" naming). That exactness is what
// makes the build catch a near-duplicate like "Route 53" vs "Amazon Route 53".
export const TECH_REGISTRY: Record<string, TechMeta> = {
  // Cloud & Infrastructure as Code
  "AWS EC2": { domain: "cloud-iac", showcase: true },
  "Amazon RDS": { domain: "cloud-iac", showcase: true },
  "Amazon S3": { domain: "cloud-iac", showcase: true },
  "Amazon CloudFront": { domain: "cloud-iac", showcase: true },
  "Amazon Route 53": { domain: "cloud-iac", showcase: true },
  "AWS CLI": { domain: "cloud-iac", showcase: false },
  Terraform: { domain: "cloud-iac", showcase: true },
  CloudFormation: { domain: "cloud-iac", showcase: true },
  eksctl: { domain: "cloud-iac", showcase: true },

  // Containers & Orchestration: includes Kubernetes-native traffic resources
  // (Gateway API, LB controllers, ExternalDNS) rather than filing them under
  // Observability, since they're K8s routing objects, not monitoring tools.
  Docker: { domain: "containers-orch", showcase: true },
  "Docker Compose": { domain: "containers-orch", showcase: true },
  "Docker (Buildx & QEMU)": { domain: "containers-orch", showcase: true },
  "Amazon EKS": { domain: "containers-orch", showcase: true },
  "Amazon ECS": { domain: "containers-orch", showcase: true },
  kubeadm: { domain: "containers-orch", showcase: true },
  Kubernetes: { domain: "containers-orch", showcase: true },
  Helm: { domain: "containers-orch", showcase: true },
  Helmfile: { domain: "containers-orch", showcase: true },
  Kustomize: { domain: "containers-orch", showcase: true },
  "Gateway API": { domain: "containers-orch", showcase: true },
  "AWS Load Balancer Controller": { domain: "containers-orch", showcase: true },
  "ALB Ingress Controller": { domain: "containers-orch", showcase: true },
  "AWS Application Load Balancer": { domain: "containers-orch", showcase: true },
  ExternalDNS: { domain: "containers-orch", showcase: true },
  "Amazon EBS CSI Driver": { domain: "containers-orch", showcase: true },
  "Metrics Server": { domain: "containers-orch", showcase: true },
  kubectx: { domain: "containers-orch", showcase: false },
  kubens: { domain: "containers-orch", showcase: false },
  "NGINX Gateway Fabric": { domain: "containers-orch", showcase: true },

  // CI/CD & GitOps
  Jenkins: { domain: "cicd-gitops", showcase: true },
  "GitHub Actions": { domain: "cicd-gitops", showcase: true },
  ArgoCD: { domain: "cicd-gitops", showcase: true },
  "ArgoCD Image Updater": { domain: "cicd-gitops", showcase: true },
  GHCR: { domain: "cicd-gitops", showcase: true },
  "Docker Hub": { domain: "cicd-gitops", showcase: true },
  Nexus: { domain: "cicd-gitops", showcase: true },
  "Amazon ECR": { domain: "cicd-gitops", showcase: true },
  Maven: { domain: "cicd-gitops", showcase: true },
  npm: { domain: "cicd-gitops", showcase: false },
  pytest: { domain: "cicd-gitops", showcase: false },
  Jest: { domain: "cicd-gitops", showcase: false },
  Webpack: { domain: "cicd-gitops", showcase: false },
  Make: { domain: "cicd-gitops", showcase: true },
  "GitHub Pages": { domain: "cicd-gitops", showcase: false },

  // Security & DevSecOps: IAM/KMS/CloudTrail sit here rather than Cloud & IaC
  // because their role in every project that uses them is access control and
  // audit, not provisioning.
  Trivy: { domain: "security", showcase: true },
  SonarQube: { domain: "security", showcase: true },
  Bandit: { domain: "security", showcase: true },
  "pip-audit": { domain: "security", showcase: true },
  ESLint: { domain: "security", showcase: false },
  Hadolint: { domain: "security", showcase: true },
  lychee: { domain: "security", showcase: false },
  JaCoCo: { domain: "security", showcase: false },
  Cobertura: { domain: "security", showcase: false },
  "AWS IAM": { domain: "security", showcase: true },
  "AWS KMS": { domain: "security", showcase: true },
  "AWS CloudTrail": { domain: "security", showcase: true },
  "AWS Certificate Manager": { domain: "security", showcase: true },
  "cert-manager": { domain: "security", showcase: true },

  // Observability & Monitoring
  Prometheus: { domain: "observability", showcase: true },
  Grafana: { domain: "observability", showcase: true },
  AlertManager: { domain: "observability", showcase: true },
  Elasticsearch: { domain: "observability", showcase: true },
  Filebeat: { domain: "observability", showcase: true },
  Kibana: { domain: "observability", showcase: true },
  "Fluent Bit": { domain: "observability", showcase: true },
  CloudWatch: { domain: "observability", showcase: true },

  // Runtimes, Languages & Data
  Java: { domain: "runtimes-data", showcase: false },
  "Spring Boot": { domain: "runtimes-data", showcase: false },
  Python: { domain: "runtimes-data", showcase: false },
  Flask: { domain: "runtimes-data", showcase: false },
  "Node.js": { domain: "runtimes-data", showcase: false },
  Express: { domain: "runtimes-data", showcase: false },
  React: { domain: "runtimes-data", showcase: false },
  Gunicorn: { domain: "runtimes-data", showcase: false },
  MySQL: { domain: "runtimes-data", showcase: true },
  PostgreSQL: { domain: "runtimes-data", showcase: true },
  SQLite: { domain: "runtimes-data", showcase: false },
  DynamoDB: { domain: "runtimes-data", showcase: true },
  RabbitMQ: { domain: "runtimes-data", showcase: true },
  Redis: { domain: "runtimes-data", showcase: true },
  SQS: { domain: "runtimes-data", showcase: true },
  SNS: { domain: "runtimes-data", showcase: true },
  Lambda: { domain: "runtimes-data", showcase: true },
  Bash: { domain: "runtimes-data", showcase: true },
  systemd: { domain: "runtimes-data", showcase: true },
  "Alpine Linux": { domain: "runtimes-data", showcase: true },
  Ubuntu: { domain: "runtimes-data", showcase: true },
  Nginx: { domain: "runtimes-data", showcase: true },
  Cloudflare: { domain: "runtimes-data", showcase: true },
  "Cloudflare Tunnel": { domain: "runtimes-data", showcase: true },
  MkDocs: { domain: "runtimes-data", showcase: true },
  mike: { domain: "runtimes-data", showcase: false },
  yq: { domain: "runtimes-data", showcase: false },
}


// Closed tag vocabulary. `iac`/`orchestration`/`ci-cd`/`security`/`observability`
// mirror the domains above: the discipline a project practices, not the specific
// tool. It's "orchestration" rather than "kubernetes" because Kubernetes is one
// tool in that discipline, not the discipline itself. The rest describe a
// practice or trait that doesn't map to one domain.
export const ALLOWED_TAGS = [
  "iac",
  "orchestration",
  "ci-cd",
  "gitops",
  "security",
  "devsecops",
  "observability",
  "networking",
  "containerization",
  "autoscaling",
  "microservices",
  "linux",
  "documentation",
] as const

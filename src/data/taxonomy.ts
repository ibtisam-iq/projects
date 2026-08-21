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

// One entry per real tech string. Keys must match data/projects.yaml `tech:`
// entries exactly (including "Amazon X" vs "X" naming). That exactness is what
// makes the build catch a near-duplicate like "Route 53" vs "Amazon Route 53".
export const TECH_REGISTRY: Record<string, DomainId> = {
  // Cloud & Infrastructure as Code
  "AWS EC2": "cloud-iac",
  "Amazon RDS": "cloud-iac",
  "Amazon S3": "cloud-iac",
  "Amazon CloudFront": "cloud-iac",
  "Amazon Route 53": "cloud-iac",
  "AWS CLI": "cloud-iac",
  Terraform: "cloud-iac",
  CloudFormation: "cloud-iac",
  eksctl: "cloud-iac",

  // Containers & Orchestration: includes Kubernetes-native traffic resources
  // (Gateway API, LB controllers, ExternalDNS) rather than filing them under
  // Observability, since they're K8s routing objects, not monitoring tools.
  Docker: "containers-orch",
  "Docker Compose": "containers-orch",
  "Docker (Buildx & QEMU)": "containers-orch",
  "Amazon EKS": "containers-orch",
  "Amazon ECS": "containers-orch",
  kubeadm: "containers-orch",
  Kubernetes: "containers-orch",
  Helm: "containers-orch",
  Helmfile: "containers-orch",
  Kustomize: "containers-orch",
  "Gateway API": "containers-orch",
  "AWS Load Balancer Controller": "containers-orch",
  "ALB Ingress Controller": "containers-orch",
  "AWS Application Load Balancer": "containers-orch",
  ExternalDNS: "containers-orch",
  "Amazon EBS CSI Driver": "containers-orch",
  "Metrics Server": "containers-orch",
  kubectx: "containers-orch",
  kubens: "containers-orch",
  "NGINX Gateway Fabric": "containers-orch",

  // CI/CD & GitOps
  Jenkins: "cicd-gitops",
  "GitHub Actions": "cicd-gitops",
  ArgoCD: "cicd-gitops",
  "ArgoCD Image Updater": "cicd-gitops",
  GHCR: "cicd-gitops",
  "Docker Hub": "cicd-gitops",
  Nexus: "cicd-gitops",
  "Amazon ECR": "cicd-gitops",
  Maven: "cicd-gitops",
  npm: "cicd-gitops",
  pytest: "cicd-gitops",
  Jest: "cicd-gitops",
  Webpack: "cicd-gitops",
  Make: "cicd-gitops",
  "GitHub Pages": "cicd-gitops",

  // Security & DevSecOps: IAM/KMS/CloudTrail sit here rather than Cloud & IaC
  // because their role in every project that uses them is access control and
  // audit, not provisioning.
  Trivy: "security",
  SonarQube: "security",
  Bandit: "security",
  "pip-audit": "security",
  ESLint: "security",
  Hadolint: "security",
  lychee: "security",
  JaCoCo: "security",
  Cobertura: "security",
  "AWS IAM": "security",
  "AWS KMS": "security",
  "AWS CloudTrail": "security",
  "AWS Certificate Manager": "security",
  "cert-manager": "security",

  // Observability & Monitoring
  Prometheus: "observability",
  Grafana: "observability",
  AlertManager: "observability",
  Elasticsearch: "observability",
  Filebeat: "observability",
  Kibana: "observability",
  "Fluent Bit": "observability",
  CloudWatch: "observability",

  // Runtimes, Languages & Data
  Java: "runtimes-data",
  "Java 21": "runtimes-data",
  "Spring Boot 3.4": "runtimes-data",
  "Spring Boot": "runtimes-data",
  Python: "runtimes-data",
  Flask: "runtimes-data",
  "Node.js": "runtimes-data",
  Express: "runtimes-data",
  React: "runtimes-data",
  Gunicorn: "runtimes-data",
  MySQL: "runtimes-data",
  PostgreSQL: "runtimes-data",
  SQLite: "runtimes-data",
  DynamoDB: "runtimes-data",
  RabbitMQ: "runtimes-data",
  Redis: "runtimes-data",
  SQS: "runtimes-data",
  SNS: "runtimes-data",
  Lambda: "runtimes-data",
  Bash: "runtimes-data",
  systemd: "runtimes-data",
  "Alpine Linux": "runtimes-data",
  Ubuntu: "runtimes-data",
  Nginx: "runtimes-data",
  Cloudflare: "runtimes-data",
  "Cloudflare Tunnel": "runtimes-data",
  MkDocs: "runtimes-data",
  mike: "runtimes-data",
  yq: "runtimes-data",
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

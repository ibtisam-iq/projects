import { Project } from "@/types/project"

export interface ToolDomain {
  id: string
  label: string
  icon: string
  description: string
  tools: string[]
}

const CLOUD_IAC_TOOLS = new Set([
  "Amazon EKS",
  "AWS EC2",
  "Amazon ECS",
  "Amazon RDS",
  "Amazon Route 53",
  "Amazon S3",
  "Amazon CloudFront",
  "AWS IAM",
  "AWS KMS",
  "AWS CloudTrail",
  "AWS CLI",
  "eksctl",
  "kubeadm",
  "Kubernetes",
  "Gateway API",
  "ExternalDNS",
  "AWS Load Balancer Controller",
  "ALB Ingress Controller",
  "Terraform",
  "CloudFormation",
  "Helm",
  "Helmfile",
  "Kustomize",
  "DynamoDB",
  "SQS",
  "SNS",
  "Lambda",
  "Route 53",
])

const CICD_SECURITY_TOOLS = new Set([
  "GitHub Actions",
  "Jenkins",
  "ArgoCD",
  "ArgoCD Image Updater",
  "Trivy",
  "SonarQube",
  "Nexus",
  "GHCR",
  "Docker Hub",
  "Hadolint",
  "Bandit",
  "pip-audit",
  "ESLint",
  "JaCoCo",
  "pytest",
])

const OBSERVABILITY_NET_TOOLS = new Set([
  "Prometheus",
  "Grafana",
  "AlertManager",
  "Elasticsearch",
  "Filebeat",
  "Fluent Bit",
  "Kibana",
  "CloudWatch",
  "Nginx",
  "Cloudflare",
  "Cloudflare Tunnel",
  "RabbitMQ",
  "Redis",
])

const OS_RUNTIMES_DATA_TOOLS = new Set([
  "Docker",
  "Docker Compose",
  "Docker (Buildx & QEMU)",
  "Alpine Linux",
  "Ubuntu",
  "systemd",
  "Bash",
  "Make",
  "npm",
  "Maven",
  "Java",
  "Java 21",
  "Spring Boot 3.4",
  "Python",
  "Node.js",
  "React",
  "PostgreSQL",
  "MySQL",
  "MkDocs",
])

export const categorizeTool = (tool: string): string => {
  if (CLOUD_IAC_TOOLS.has(tool)) return "cloud-iac"
  if (CICD_SECURITY_TOOLS.has(tool)) return "cicd-security"
  if (OBSERVABILITY_NET_TOOLS.has(tool)) return "observability-net"
  if (OS_RUNTIMES_DATA_TOOLS.has(tool)) return "os-runtimes-data"

  // Fallback heuristics for dynamically added future tools
  const lower = tool.toLowerCase()
  if (
    lower.includes("aws") ||
    lower.includes("cloud") ||
    lower.includes("k8s") ||
    lower.includes("kube") ||
    lower.includes("terra") ||
    lower.includes("helm") ||
    lower.includes("mesh")
  ) {
    return "cloud-iac"
  }
  if (
    lower.includes("ci") ||
    lower.includes("cd") ||
    lower.includes("git") ||
    lower.includes("scan") ||
    lower.includes("sec") ||
    lower.includes("test") ||
    lower.includes("audit") ||
    lower.includes("lint")
  ) {
    return "cicd-security"
  }
  if (
    lower.includes("metric") ||
    lower.includes("log") ||
    lower.includes("trace") ||
    lower.includes("prom") ||
    lower.includes("graf") ||
    lower.includes("net") ||
    lower.includes("proxy") ||
    lower.includes("dns") ||
    lower.includes("flare")
  ) {
    return "observability-net"
  }
  return "os-runtimes-data"
}

export const getCategorizedTools = (allTools: string[]): ToolDomain[] => {
  const domains: Record<string, string[]> = {
    "cloud-iac": [],
    "cicd-security": [],
    "observability-net": [],
    "os-runtimes-data": [],
  }

  allTools.forEach((tool) => {
    const domainId = categorizeTool(tool)
    domains[domainId].push(tool)
  })

  // Sort tools alphabetically within each domain
  Object.keys(domains).forEach((key) => {
    domains[key].sort((a, b) => a.localeCompare(b))
  })

  return [
    {
      id: "cloud-iac",
      label: "Cloud & Orchestration",
      icon: "☁️",
      description: "AWS, Kubernetes, Terraform, Helm & Gateway API",
      tools: domains["cloud-iac"],
    },
    {
      id: "cicd-security",
      label: "CI/CD & DevSecOps",
      icon: "🔄",
      description: "Pipelines, GitOps, Trivy, SonarQube & Registries",
      tools: domains["cicd-security"],
    },
    {
      id: "observability-net",
      label: "Observability & Ingress",
      icon: "📊",
      description: "Prometheus, Grafana, ELK, Nginx & Tunnels",
      tools: domains["observability-net"],
    },
    {
      id: "os-runtimes-data",
      label: "OS, Runtimes & Data",
      icon: "🐧",
      description: "Linux, Containers, systemd, Databases & Code",
      tools: domains["os-runtimes-data"],
    },
  ]
}

/**
 * Calculates how many projects match a specific tool, skill, or category
 */
export const calculateProjectCounts = (projectsList: Project[]) => {
  const toolCounts: Record<string, number> = {}
  const skillCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {
    all: projectsList.length,
    platform: 0,
    tool: 0,
  }
  const statusCounts: Record<string, number> = {}
  const yearCounts: Record<string, number> = {}

  projectsList.forEach((p) => {
    // Categories
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++
    } else {
      categoryCounts[p.category] = 1
    }

    // Status
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1

    // Year
    const yr = String(p.year)
    yearCounts[yr] = (yearCounts[yr] || 0) + 1

    // Tools
    p.tech.forEach((t) => {
      toolCounts[t] = (toolCounts[t] || 0) + 1
    })

    // Skills
    p.tags.forEach((s) => {
      skillCounts[s] = (skillCounts[s] || 0) + 1
    })
  })

  return { toolCounts, skillCounts, categoryCounts, statusCounts, yearCounts }
}

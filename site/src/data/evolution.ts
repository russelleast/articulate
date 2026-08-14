export interface EvolutionLink {
  label: string;
  href: string;
  type: "Episode" | "Decision" | "Principle";
}

export interface EvolutionMilestone {
  period: string;
  title: string;
  description: string;
  links: EvolutionLink[];
}

export const evolutionMilestones: EvolutionMilestone[] = [
  {
    period: "Episodes 0000–0002",
    title: "The problem and vision were established",
    description: "Articulate began by making fragmented architectural knowledge the problem to solve and architectural intelligence the long-term ambition. The journal and reference implementation became equal ways of testing that ambition in public.",
    links: [
      { type: "Episode", label: "Preface", href: "/episodes/preface/" },
      { type: "Episode", label: "Why Articulate Exists", href: "/episodes/0001-why-articulate-exists/" },
      { type: "Episode", label: "What is Articulate?", href: "/episodes/0002-what-is-articulate/" }
    ]
  },
  {
    period: "Episodes 0003–0006",
    title: "AI-native architecture became the design frame",
    description: "Intelligence moved from isolated feature to runtime concern. System characteristics, architectural method, and structured human–AI collaboration established how the project would reason before choosing technology.",
    links: [
      { type: "Episode", label: "Why AI-Native Systems?", href: "/episodes/0003-why-ai-native-systems/" },
      { type: "Episode", label: "System Characteristics", href: "/episodes/0004-system-characteristics-the-properties-every-system-needs/" },
      { type: "Episode", label: "Solution Design and Evolving Architecture", href: "/episodes/0005-designing-an-ai-native-architecture/" },
      { type: "Principle", label: "Coherence Before Size", href: "/principles/coherence-before-size/" }
    ]
  },
  {
    period: "Episodes 0007–0009",
    title: "Architectural knowledge became a connected model",
    description: "The Knowledge Model was introduced, knowledge reasoning moved beyond document retrieval, and DCL connected architectural intent to capabilities, behaviour, rules, and policies.",
    links: [
      { type: "Episode", label: "The Knowledge Model", href: "/episodes/0007-the-knowledge-model/" },
      { type: "Episode", label: "Knowledge Reasoning: Beyond RAG", href: "/episodes/0008-agentic-rag-and-knowledge-reasoning/" },
      { type: "Episode", label: "Defining Architectural Behaviour with DCL", href: "/episodes/0009-defining-architectural-behaviour-with-dcl/" }
    ]
  },
  {
    period: "Episodes 0010–0013",
    title: "Runtime responsibilities were separated and made durable",
    description: "The runtime investigation separated execution from authoritative knowledge, conversation, retrieval, and application state. Dapr Agents and Dapr Workflows were selected to coordinate long-running, recoverable work.",
    links: [
      { type: "Episode", label: "Defining the Runtime Requirements", href: "/episodes/0010-selecting-an-agent-runtime/" },
      { type: "Episode", label: "Durable Execution", href: "/episodes/0012-durable-execution/" },
      { type: "Decision", label: "ADR-0001 — AI Runtime", href: "/decisions/adr-0001/" }
    ]
  },
  {
    period: "Episode 0014 / ADRs 0002–0004",
    title: "Architectural knowledge gained an explicit evolution model",
    description: "Claims became the fundamental unit of knowledge, accepted history became immutable, and proposed changes gained a staged path through reconciliation, validation, and acceptance.",
    links: [
      { type: "Episode", label: "Knowledge Evolution", href: "/episodes/0014-knowledge-evolution/" },
      { type: "Decision", label: "ADR-0002 — Accepted history is immutable", href: "/decisions/adr-0002/" },
      { type: "Decision", label: "ADR-0003 — Claims are fundamental", href: "/decisions/adr-0003/" },
      { type: "Decision", label: "ADR-0004 — Staged proposals", href: "/decisions/adr-0004/" }
    ]
  },
  {
    period: "Episode 0015",
    title: "Derived knowledge introduced continuous architectural assurance",
    description: "The architecture expanded from preserving knowledge to evaluating it. Derived findings connect principles, characteristics, maturity, decisions, and obligations without becoming a second source of truth.",
    links: [
      { type: "Episode", label: "Architectural Assurance", href: "/episodes/0015-architectural-assurance/" }
    ]
  }
];

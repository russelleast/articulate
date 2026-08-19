#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const logos = path.resolve(here, "../assets/logos");
const output = path.resolve(repoRoot, "site/public/diagrams");
const image = (name) => `data:image/svg+xml;base64,${fs.readFileSync(path.join(logos, name)).toString("base64")}`;
const marks = {
  maf: image("microsoft-agent-framework.svg"),
  temporal: image("temporal.svg"),
  langgraph: image("langgraph.svg"),
  dapr: image("dapr.svg")
};

fs.mkdirSync(output, { recursive: true });
write("candidates", candidates());
write("maf-temporal", pair("maf", "Microsoft Agent Framework", "Agent programming model", "temporal", "Temporal", "Durable execution"));
write("maf-durable", mafDurable());
write("langgraph-temporal", pair("langgraph", "LangGraph", "Reasoning orchestration", "temporal", "Temporal", "Durable execution", ["Who owns orchestration?", "retries?", "state?", "lifecycle?"]));
write("compositions", compositions());
write("dapr-platform", daprPlatform());
write("dapr-decision", daprDecision());

function write(id, body) {
  fs.writeFileSync(path.join(output, `episode-0013-${id}.svg`), svg(body));
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="560" viewBox="0 0 1320 560"><style>text{font-family:Inter,Arial,sans-serif}.title{font-size:25px;font-weight:750;fill:#eef2f1}.label{font-size:18px;font-weight:650;fill:#dce6e8}.detail{font-size:15px;font-weight:500;fill:#91afbc}.small{font-size:14px;font-weight:600;fill:#adc1c9}.plus{font-size:42px;font-weight:500;fill:#c77a58}</style>${body}</svg>`;
}

function card({ x, y, width = 280, height = 170, logo, title, detail, accent = "#55798b" }) {
  return `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="#12232c" stroke="${accent}" stroke-width="2"/><image href="${marks[logo]}" x="${x + 24}" y="${y + 22}" width="${width - 48}" height="70" preserveAspectRatio="xMidYMid meet"/><text class="label" x="${x + width / 2}" y="${y + 120}" text-anchor="middle">${title}</text>${detail ? `<text class="detail" x="${x + width / 2}" y="${y + 146}" text-anchor="middle">${detail}</text>` : ""}</g>`;
}

function candidates() {
  return [
    card({ x: 30, y: 175, logo: "maf", title: "Microsoft Agent Framework" }),
    card({ x: 350, y: 175, logo: "temporal", title: "Temporal" }),
    card({ x: 670, y: 175, logo: "langgraph", title: "LangGraph" }),
    card({ x: 990, y: 175, logo: "dapr", title: "Dapr Agents" }),
    `<text class="title" x="660" y="90" text-anchor="middle">Candidate technologies</text><text class="detail" x="660" y="125" text-anchor="middle">The investigation now compares how responsibilities compose.</text>`
  ].join("");
}

function pair(leftLogo, leftTitle, leftDetail, rightLogo, rightTitle, rightDetail, questions = []) {
  const q = questions.length ? `<g transform="translate(250 420)">${questions.map((text, index) => `<rect x="${index * 210}" width="195" height="58" rx="29" fill="#172b34" stroke="#526f7c"/><text class="small" x="${index * 210 + 97}" y="35" text-anchor="middle">${text}</text>`).join("")}</g>` : `<text class="detail" x="660" y="450" text-anchor="middle">A credible architecture that satisfies the requirements</text>`;
  return `${card({ x: 245, y: 155, width: 330, logo: leftLogo, title: leftTitle, detail: leftDetail })}<text class="plus" x="660" y="260" text-anchor="middle">+</text>${card({ x: 745, y: 155, width: 330, logo: rightLogo, title: rightTitle, detail: rightDetail })}${q}`;
}

function mafDurable() {
  return `${card({ x: 90, y: 165, width: 350, logo: "maf", title: "Microsoft Agent Framework", detail: "Agent programming model" })}<text class="plus" x="495" y="270">+</text><g><rect x="565" y="165" width="310" height="170" rx="22" fill="#12232c" stroke="#55798b" stroke-width="2"/><text class="title" x="720" y="240" text-anchor="middle">Durable Task</text><text class="detail" x="720" y="278" text-anchor="middle">Durable execution</text></g><g><rect x="940" y="165" width="285" height="170" rx="22" fill="#18342f" stroke="#4f8c82" stroke-width="2"/><text class="label" x="1082" y="225" text-anchor="middle">C# ecosystem</text><text class="detail" x="1082" y="263" text-anchor="middle">Fewer runtime technologies</text><text class="detail" x="1082" y="291" text-anchor="middle">Familiar environment</text></g><text class="detail" x="660" y="430" text-anchor="middle">Trade-off: how much responsibility should the agent framework own?</text>`;
}

function compositions() {
  const rows = [
    ["maf", "MAF + Temporal", "Agent model + durable execution"],
    ["maf", "MAF + Durable Task", "Integrated Microsoft stack"],
    ["langgraph", "LangGraph + Temporal", "Reasoning + durable execution"],
    ["dapr", "Dapr Agents + Workflows", "Agent + distributed platform"]
  ];
  return `<text class="title" x="660" y="55" text-anchor="middle">All can satisfy the requirements</text>${rows.map(([logo, title, detail], index) => { const x = 40 + (index % 2) * 640; const y = 92 + Math.floor(index / 2) * 205; return card({ x, y, width: 600, height: 170, logo, title, detail, accent: index === 3 ? "#4f8c82" : "#55798b" }); }).join("")}<text class="detail" x="660" y="535" text-anchor="middle">Compare boundaries · responsibilities · runtime abstractions · platform fit</text>`;
}

function daprPlatform() {
  const top = [["Agents", 140], ["Services", 500], ["Workflows", 860]];
  const bottom = [["State", 45], ["Pub/Sub", 290], ["Invoke", 535], ["Secrets", 780], ["OTel", 1025]];
  return `<text class="title" x="660" y="42" text-anchor="middle">ARTICULATE</text>${top.map(([t,x]) => `<rect x="${x}" y="75" width="320" height="75" rx="18" fill="#172d36" stroke="#55798b"/><text class="label" x="${x+160}" y="121" text-anchor="middle">${t}</text>`).join("")}<path d="M300 150V190H1020V150M660 150V190" fill="none" stroke="#7695a3" stroke-width="3"/><rect x="470" y="190" width="380" height="105" rx="24" fill="#183b38" stroke="#4f8c82" stroke-width="3"/><image href="${marks.dapr}" x="520" y="207" width="280" height="70" preserveAspectRatio="xMidYMid meet"/><path d="M660 295V340M165 340H1145M165 340V380M410 340V380M655 340V380M900 340V380M1145 340V380" fill="none" stroke="#7695a3" stroke-width="3"/>${bottom.map(([t,x]) => `<rect x="${x}" y="380" width="230" height="78" rx="18" fill="#12232c" stroke="#55798b"/><text class="label" x="${x+115}" y="427" text-anchor="middle">${t}</text>`).join("")}<text class="detail" x="660" y="520" text-anchor="middle">One runtime boundary across already-emerging platform responsibilities</text>`;
}

function daprDecision() {
  return `<g transform="translate(220 80)"><rect width="880" height="380" rx="34" fill="#142832" stroke="#4f8c82" stroke-width="3"/><image href="${marks.dapr}" x="300" y="30" width="280" height="105" preserveAspectRatio="xMidYMid meet"/><rect x="85" y="185" width="310" height="110" rx="22" fill="#183b38" stroke="#4f8c82" stroke-width="2"/><text class="title" x="240" y="235" text-anchor="middle">Dapr Agents</text><text class="detail" x="240" y="268" text-anchor="middle">Initial agent runtime</text><text class="plus" x="440" y="255" text-anchor="middle">+</text><rect x="485" y="185" width="310" height="110" rx="22" fill="#183b38" stroke="#4f8c82" stroke-width="2"/><text class="title" x="640" y="235" text-anchor="middle">Dapr Workflows</text><text class="detail" x="640" y="268" text-anchor="middle">Durable execution</text><text class="detail" x="440" y="345" text-anchor="middle">Best current architectural fit—not a universal winner</text></g>`;
}

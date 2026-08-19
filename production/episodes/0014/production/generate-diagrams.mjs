#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const output = path.join(repoRoot, "site/public/diagrams");
fs.mkdirSync(output, { recursive: true });

write("living-knowledge", livingKnowledge());
write("competing-claims", competingClaims());
write("proposed-knowledge", proposedKnowledge());
write("evolution-through-time", evolutionThroughTime());
write("baselines", baselines());
write("approval-timeline", approvalTimeline());
write("claims-to-architecture", claimsToArchitecture());

function write(id, body) {
  fs.writeFileSync(path.join(output, `episode-0014-${id}.svg`), svg(body));
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="560" viewBox="0 0 1320 560"><defs><marker id="arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1 1L11 6L1 11Z" fill="#7695a3"/></marker></defs><style>text{font-family:Inter,Arial,sans-serif}.title{font-size:25px;font-weight:780;fill:#eef2f1}.label{font-size:19px;font-weight:680;fill:#e6ecec}.detail{font-size:15px;font-weight:560;fill:#91afbc}.eyebrow{font-size:13px;font-weight:760;letter-spacing:2px;fill:#c77a58}.edge{fill:none;stroke:#7695a3;stroke-width:3;marker-end:url(#arrow)}.history{stroke:#779b91}.proposed{stroke:#c77a58;stroke-dasharray:9 7}</style>${body}</svg>`;
}

function box(x, y, width, height, title, detail = "", options = {}) {
  const fill = options.fill ?? "#12232c";
  const stroke = options.stroke ?? "#55798b";
  const dash = options.dash ? ` stroke-dasharray="9 7"` : "";
  const titleLines = title.split("|");
  const titleY = y + height / 2 - (detail ? 10 : 0) - (titleLines.length - 1) * 12;
  const titleText = `<text class="label" x="${x + width / 2}" y="${titleY}" text-anchor="middle">${titleLines.map((line, index) => `<tspan x="${x + width / 2}" dy="${index ? 25 : 0}">${line}</tspan>`).join("")}</text>`;
  return `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="2"${dash}/>${titleText}${detail ? `<text class="detail" x="${x + width / 2}" y="${y + height / 2 + 28}" text-anchor="middle">${detail}</text>` : ""}</g>`;
}

function livingKnowledge() {
  const sources = [["Discovery",90,90],["ADR",90,215],["Solution Design",90,340],["Source Code",930,215]];
  return `<text class="eyebrow" x="660" y="42" text-anchor="middle">CONTINUOUS INPUT</text>${sources.map(([title,x,y]) => box(x,y,300,86,title)).join("")}${box(500,190,320,140,"Knowledge Model","Living architectural understanding",{fill:"#18342f",stroke:"#4f8c82"})}<path class="edge" d="M390 133C450 133 455 220 500 235"/><path class="edge" d="M390 258H500"/><path class="edge" d="M390 383C450 383 455 315 500 285"/><path class="edge" d="M930 258H820"/><text class="detail" x="1080" y="325" text-anchor="middle">Infrastructure · architects · agents</text>`;
}

function competingClaims() {
  return `${box(80,190,310,140,"Order Service","accepted architectural entity",{fill:"#172d36"})}${box(505,90,320,125,"PostgreSQL","accepted claim",{fill:"#18342f",stroke:"#4f8c82"})}${box(505,330,320,125,"MongoDB","new assertion",{fill:"#2b211e",stroke:"#c77a58",dash:true})}<path class="edge history" d="M390 235C445 235 445 152 505 152"/><path class="edge proposed" d="M390 285C445 285 445 392 505 392"/><g transform="translate(905 105)"><text class="eyebrow">WHAT DOES IT MEAN?</text><text class="detail" y="58">Future migration?</text><text class="detail" y="103">Both databases?</text><text class="detail" y="148">Incorrect information?</text><text class="detail" y="193">Architectural change?</text></g>`;
}

function proposedKnowledge() {
  const stages = [[35,"Incoming|Information",false],[300,"Proposed|Knowledge",true],[565,"Interpretation",false],[830,"Reconciliation",false],[1095,"Accepted|Knowledge",false]];
  return `<text class="eyebrow" x="660" y="92" text-anchor="middle">CONCEPTUAL RESPONSIBILITIES</text>${stages.map(([x,title,proposed]) => box(x,205,190,115,title,"",proposed?{fill:"#2b211e",stroke:"#c77a58",dash:true}:title==="Accepted Knowledge"?{fill:"#18342f",stroke:"#4f8c82"}:{})).join("")}${stages.slice(0,-1).map(([x],i)=>`<path class="edge" d="M${x+190} 262H${stages[i+1][0]}"/>`).join("")}<text class="detail" x="660" y="390" text-anchor="middle">New information never jumps directly to accepted truth.</text>`;
}

function evolutionThroughTime() {
  const states = [[55,"ONCE WAS","PostgreSQL","Previous baseline"],[495,"AS IS","MongoDB","Current baseline"],[935,"TO BE","DynamoDB","Target baseline"]];
  return `${states.map(([x,heading,db,detail],i)=>`<g><text class="eyebrow" x="${x+165}" y="90" text-anchor="middle">${heading}</text>${box(x,140,330,95,"Order Service")}${box(x,340,330,95,db,detail,{fill:i===1?"#18342f":"#172d36",stroke:i===1?"#4f8c82":"#55798b"})}<path class="edge" d="M${x+165} 235V340"/></g>`).join("")}<path d="M385 287H495M825 287H935" fill="none" stroke="#7695a3" stroke-width="3" stroke-dasharray="7 8"/><text class="detail" x="660" y="510" text-anchor="middle">Architectural history remains connected and meaningful.</text>`;
}

function baselines() {
  return `${box(430,55,460,110,"Connected Knowledge Model","Claims · evidence · decisions",{fill:"#18342f",stroke:"#4f8c82"})}${box(40,345,360,120,"Once Was","Previous baseline")}${box(480,345,360,120,"As Is","Current baseline",{fill:"#172f38",stroke:"#4f8c82"})}${box(920,345,360,120,"To Be","Target baseline")}<path class="edge" d="M530 165C530 235 220 235 220 345"/><path class="edge" d="M660 165V345"/><path class="edge" d="M790 165C790 235 1100 235 1100 345"/><text class="detail" x="660" y="525" text-anchor="middle">Three viewpoints over one evolving body of knowledge—not three disconnected models.</text>`;
}

function approvalTimeline() {
  const stages=[[35,"Proposal"],[285,"Reconciled"],[535,"Human Approval"],[785,"Reconcile Again"],[1035,"Accept"]];
  return `<text class="eyebrow" x="660" y="85" text-anchor="middle">TIME PASSES · THE ARCHITECTURE CHANGES</text>${stages.map(([x,title],i)=>box(x,215,200,110,title,i===2?"two weeks later":"",i===3?{fill:"#2b211e",stroke:"#c77a58"}:i===4?{fill:"#18342f",stroke:"#4f8c82"}:{})).join("")}${stages.slice(0,-1).map(([x],i)=>`<path class="edge" d="M${x+200} 270H${stages[i+1][0]}"/>`).join("")}<text class="detail" x="660" y="420" text-anchor="middle">Approval authorises the next step. Reconciliation tests the latest baseline.</text>`;
}

function claimsToArchitecture() {
  return `${box(70,175,300,120,"Order Service","AWS ECS",{fill:"#172f38"})}${box(505,175,310,120,"Order Database","PostgreSQL",{fill:"#18342f",stroke:"#4f8c82"})}${box(950,175,300,120,"AWS RDS","deployment")}`+
    `<path class="edge" d="M370 235H505"/><text class="detail" x="437" y="218" text-anchor="middle">reads / writes</text><path class="edge" d="M815 235H950"/><text class="detail" x="882" y="218" text-anchor="middle">runs in</text>`+
    `<g transform="translate(140 390)"><rect width="1040" height="88" rx="22" fill="#111f26" stroke="#3f5965"/><text class="label" x="520" y="39" text-anchor="middle">Individual claims → relationships → architectural understanding</text><text class="detail" x="520" y="66" text-anchor="middle">The claims remain as evidence beneath the connected model.</text></g>`;
}

import type { CSSProperties } from "react";
import { Building2, Cpu, Database, Lightbulb, Sprout, Users, type LucideIcon } from "lucide-react";
import { contourPaths } from "@/lib/contours";

type PlotNode = {
  label: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  labelDy: number;
  focus?: boolean;
};

const HUB = { x: 300, y: 330 };

// Six things Ntinginya Tech connects, placed like survey points on a terrain map.
const NODES: PlotNode[] = [
  { label: "Technology", Icon: Cpu, x: 118, y: 172, labelDy: 44 },
  { label: "Data", Icon: Database, x: 418, y: 112, labelDy: -34 },
  { label: "Innovation", Icon: Lightbulb, x: 516, y: 312, labelDy: 44 },
  { label: "Business", Icon: Building2, x: 452, y: 520, labelDy: 44 },
  { label: "Agriculture", Icon: Sprout, x: 262, y: 566, labelDy: 44, focus: true },
  { label: "People", Icon: Users, x: 86, y: 404, labelDy: 44 },
];

const contours = contourPaths({ cx: HUB.x, cy: HUB.y, rings: 13, start: 60, step: 24, seed: 2.1 });

export function HeroVisual() {
  const ringPoints = NODES.map((n) => `${n.x},${n.y}`).join(" ");

  return (
    <figure>
      <div className="overflow-hidden rounded-3xl border border-deep/15 bg-paper">
        <svg
          viewBox="0 0 600 640"
          role="img"
          aria-label="A topographic map of farmland with six connected points: technology, data, innovation, business, agriculture and people, all linked to Ntinginya Tech at the centre."
          className="block h-auto w-full"
        >
          {/* Terrain */}
          <g fill="none" stroke="#0A2A30">
            {contours.map((d, i) => (
              <path
                key={i}
                d={d}
                pathLength={1}
                className="contour"
                style={{ "--i": i } as CSSProperties}
                strokeOpacity={i % 4 === 0 ? 0.35 : 0.16}
                strokeWidth={i % 4 === 0 ? 1.6 : 1}
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Connections between the six points */}
          <polygon points={ringPoints} fill="none" stroke="#1F5F3A" strokeOpacity={0.45} strokeWidth={1.25} strokeDasharray="3 6" />
          <g stroke="#1F5F3A" strokeWidth={1.75} strokeLinecap="round">
            {NODES.map((n, i) => (
              <line
                key={n.label}
                x1={HUB.x}
                y1={HUB.y}
                x2={n.x}
                y2={n.y}
                pathLength={1}
                className="edge"
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </g>

          {/* Centre: Ntinginya Tech */}
          <g>
            <circle cx={HUB.x} cy={HUB.y} r={40} fill="#0A2A30" />
            <g transform={`translate(${HUB.x - 20} ${HUB.y - 20})`}>
              <path d="M11 29V11l18 18V11" fill="none" stroke="#FFFFFF" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={29} cy={11} r={3.2} fill="#F5B700" />
            </g>
            <text
              x={HUB.x}
              y={HUB.y + 66}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill="#0A2A30"
              stroke="#F8FAF6"
              strokeWidth={5}
              strokeLinejoin="round"
              style={{ paintOrder: "stroke", letterSpacing: "0.08em" }}
            >
              NTINGINYA TECH
            </text>
          </g>

          {/* Survey points */}
          {NODES.map((n, i) => (
            <g key={n.label} className="plot" style={{ "--i": i } as CSSProperties}>
              <circle
                cx={n.x}
                cy={n.y}
                r={25}
                fill={n.focus ? "#F5B700" : "#FFFFFF"}
                stroke="#0A2A30"
                strokeWidth={1.5}
              />
              <n.Icon x={n.x - 11} y={n.y - 11} width={22} height={22} strokeWidth={1.8} color={n.focus ? "#0A2A30" : "#1F5F3A"} />
              <text
                x={n.x}
                y={n.y + n.labelDy}
                textAnchor="middle"
                fontSize={15}
                fontWeight={600}
                fill="#0A2A30"
                stroke="#F8FAF6"
                strokeWidth={5}
                strokeLinejoin="round"
                style={{ paintOrder: "stroke" }}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 text-sm leading-snug text-deep/70">
        Technology, people, business, agriculture, innovation and data, drawn as one connected landscape.
      </figcaption>
    </figure>
  );
}

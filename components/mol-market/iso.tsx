/** Tiny isometric helpers for SVG scenes. */
const C = Math.cos(Math.PI / 6);

export type Pt = [number, number];
export type Proj = (x: number, y: number, z?: number) => Pt;

/** Returns a projector: world (x,y,z) -> screen. +x goes right-down, +y goes left-down, +z goes up. */
export const makeIso =
  (ox: number, oy: number, s: number): Proj =>
  (x, y, z = 0) => [ox + (x - y) * C * s, oy + (x + y) * 0.5 * s - z * s];

export const pts = (arr: Pt[]) => arr.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

export const INK = "#4a4063";

interface BoxProps {
  P: Proj;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  top: string;
  left: string;
  right: string;
  sw?: number;
}

/** Solid isometric box with three visible faces. */
export function IsoBox({ P, x, y, z, dx, dy, dz, top, left, right, sw = 2.5 }: BoxProps) {
  const t = [P(x, y, z + dz), P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)];
  const l = [P(x, y + dy, z + dz), P(x + dx, y + dy, z + dz), P(x + dx, y + dy, z), P(x, y + dy, z)];
  const r = [P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x + dx, y + dy, z), P(x + dx, y, z)];
  return (
    <g stroke={INK} strokeWidth={sw} strokeLinejoin="round">
      <polygon points={pts(l)} fill={left} />
      <polygon points={pts(r)} fill={right} />
      <polygon points={pts(t)} fill={top} />
    </g>
  );
}

/** Polygon on a wall/plane from a list of world points. */
export function Face({ P, p, fill, sw = 2.5, opacity }: { P: Proj; p: [number, number, number][]; fill: string; sw?: number; opacity?: number }) {
  return <polygon points={pts(p.map(([x, y, z]) => P(x, y, z)))} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" opacity={opacity} />;
}

/** SVG matrix to write on a plane y = const (faces left-down), text running along +x. */
export const onPlaneY = ([tx, ty]: Pt) => `matrix(${C},0.5,0,1,${tx},${ty})`;
/** SVG matrix to write on a plane x = const (faces right-down), text running along -y. */
export const onPlaneX = ([tx, ty]: Pt) => `matrix(${C},-0.5,0,1,${tx},${ty})`;

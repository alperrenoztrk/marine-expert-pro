import * as THREE from 'three';

export interface CylinderCollider {
  center: THREE.Vector3; // cylinder axis center (x,z) and y at midpoint
  radius: number; // cylinder radius
  halfHeight: number; // half height along +Y/-Y from center
}

export interface RopeSimulationOptions {
  segmentCount: number;
  segmentLength: number;
  ropeRadius?: number;
  gravity?: THREE.Vector3;
  damping?: number; // 0..1, applied to Verlet velocity
  constraintIterations?: number; // how many times to enforce constraints per step
  bendingStiffness?: number; // 0..1 smoothing along rope
  cylinderCollider?: CylinderCollider | null;
  friction?: number; // 0..1 tangential damping when colliding with cylinder
}

// Lightweight rope simulation using position-based dynamics / Verlet integration.
// Designed for clarity and robustness rather than perfect physical fidelity.
export class RopeSimulation {
  public readonly segmentCount: number;
  public readonly segmentLength: number;
  public readonly ropeRadius: number;

  private gravity: THREE.Vector3;
  private damping: number;
  private constraintIterations: number;
  private bendingStiffness: number;
  private cylinder: CylinderCollider | null;
  private friction: number;

  private positions: THREE.Vector3[];
  private prevPositions: THREE.Vector3[];
  private pinnedIndices: Set<number> = new Set();

  private headTarget: THREE.Vector3 | null = null;
  private headFollowStrength = 1.0; // 0..1, how strongly head snaps to target

  constructor(opts: RopeSimulationOptions) {
    this.segmentCount = Math.max(2, opts.segmentCount);
    this.segmentLength = Math.max(1e-3, opts.segmentLength);
    this.ropeRadius = opts.ropeRadius ?? 0.2;
    this.gravity = opts.gravity ? opts.gravity.clone() : new THREE.Vector3(0, -9.81, 0);
    this.damping = opts.damping ?? 0.995;
    this.constraintIterations = Math.max(1, opts.constraintIterations ?? 6);
    this.bendingStiffness = THREE.MathUtils.clamp(opts.bendingStiffness ?? 0.1, 0, 1);
    this.cylinder = opts.cylinderCollider ?? null;
    this.friction = THREE.MathUtils.clamp(opts.friction ?? 0.2, 0, 1);

    this.positions = new Array(this.segmentCount);
    this.prevPositions = new Array(this.segmentCount);

    // Initialize as a straight horizontal line along -X to +X near origin
    const start = new THREE.Vector3(-6, 0, 0);
    const dir = new THREE.Vector3(1, 0, 0);
    for (let i = 0; i < this.segmentCount; i++) {
      const p = start.clone().addScaledVector(dir, i * this.segmentLength);
      this.positions[i] = p.clone();
      this.prevPositions[i] = p.clone();
    }

    // Pin the first few points by default to emulate standing part anchored
    for (let i = 0; i < Math.min(10, this.segmentCount); i++) this.pinnedIndices.add(i);
  }

  public setPinnedRange(startIndex: number, endIndexInclusive: number) {
    this.pinnedIndices.clear();
    const a = Math.max(0, Math.min(startIndex, endIndexInclusive));
    const b = Math.min(this.segmentCount - 1, Math.max(startIndex, endIndexInclusive));
    for (let i = a; i <= b; i++) this.pinnedIndices.add(i);
  }

  public setCylinderCollider(cyl: CylinderCollider | null) {
    this.cylinder = cyl;
  }

  public setHeadFollowStrength(strength: number) {
    this.headFollowStrength = THREE.MathUtils.clamp(strength, 0, 1);
  }

  public initializeFromPolyline(polyline: THREE.Vector3[], slackRatio = 1.1) {
    // Resample the provided polyline to an arc length, compute desired total length
    const sampled = resamplePolyline(polyline, this.segmentCount);
    const totalLen = computePolylineLength(sampled);
    const desiredLen = totalLen * slackRatio;
    const segLen = desiredLen / (this.segmentCount - 1);

    // Place rope along the first segment of the polyline direction to avoid large initial projection jumps
    const positions = new Array<THREE.Vector3>(this.segmentCount);
    const prev = new Array<THREE.Vector3>(this.segmentCount);
    const start = sampled[0].clone();

    // Build a straight line roughly following the initial direction
    const next = sampled[1] ?? sampled[0].clone().add(new THREE.Vector3(1, 0, 0));
    const dir = next.clone().sub(start).normalize();

    for (let i = 0; i < this.segmentCount; i++) {
      const p = start.clone().addScaledVector(dir, segLen * i);
      positions[i] = p;
      prev[i] = p.clone();
    }

    this.positions = positions;
    this.prevPositions = prev;
    (this as any).segmentLength = segLen; // keep internal in sync
  }

  public setHeadTarget(target: THREE.Vector3 | null) {
    this.headTarget = target ? target.clone() : null;
  }

  public getPositions(): readonly THREE.Vector3[] {
    return this.positions;
  }

  public step(dt: number) {
    // Clamp dt for stability
    const clampedDt = Math.min(1 / 30, Math.max(1 / 240, dt));

    // Verlet integration
    const accel = this.gravity.clone().multiplyScalar(clampedDt * clampedDt);
    for (let i = 0; i < this.segmentCount; i++) {
      if (this.pinnedIndices.has(i)) continue;
      const p = this.positions[i];
      const prev = this.prevPositions[i];
      const vx = (p.x - prev.x) * this.damping;
      const vy = (p.y - prev.y) * this.damping;
      const vz = (p.z - prev.z) * this.damping;
      this.prevPositions[i].copy(p);
      p.x += vx + accel.x;
      p.y += vy + accel.y;
      p.z += vz + accel.z;
    }

    // Hard set head to follow target (simulates pulling the working end)
    if (this.headTarget) {
      const headIndex = this.segmentCount - 1;
      const head = this.positions[headIndex];
      head.lerp(this.headTarget, this.headFollowStrength);
    }

    // Constraint iterations: segment lengths, bending smoothing, and colliders
    for (let iter = 0; iter < this.constraintIterations; iter++) {
      this.enforceSegmentLengths();
      this.enforceCylinderCollider();
      this.enforceBending();
      this.enforcePins();
    }
  }

  private enforcePins() {
    // Reset pinned points to previous positions (keeps them locked)
    for (const idx of this.pinnedIndices) {
      const prev = this.prevPositions[idx];
      this.positions[idx].copy(prev);
    }
  }

  private enforceSegmentLengths() {
    // Keep distance between consecutive points equal to segmentLength
    for (let i = 0; i < this.segmentCount - 1; i++) {
      const p1 = this.positions[i];
      const p2 = this.positions[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const diff = (dist - this.segmentLength) / dist;
      // Determine move shares; pinned points should not move
      let w1 = this.pinnedIndices.has(i) ? 0 : 0.5;
      let w2 = this.pinnedIndices.has(i + 1) ? 0 : 0.5;
      const sum = w1 + w2 || 1;
      w1 /= sum; w2 /= sum;
      p1.x += dx * diff * w1;
      p1.y += dy * diff * w1;
      p1.z += dz * diff * w1;
      p2.x -= dx * diff * w2;
      p2.y -= dy * diff * w2;
      p2.z -= dz * diff * w2;
    }
  }

  private enforceBending() {
    if (this.bendingStiffness <= 0) return;
    // Laplacian smoothing like: p_i = p_i + k * (0.5*(p_{i-1}+p_{i+1}) - p_i)
    const k = this.bendingStiffness * 0.5;
    for (let i = 1; i < this.segmentCount - 1; i++) {
      if (this.pinnedIndices.has(i)) continue;
      const prev = this.positions[i - 1];
      const next = this.positions[i + 1];
      const pi = this.positions[i];
      pi.x += k * ((prev.x + next.x) * 0.5 - pi.x);
      pi.y += k * ((prev.y + next.y) * 0.5 - pi.y);
      pi.z += k * ((prev.z + next.z) * 0.5 - pi.z);
    }
  }

  private enforceCylinderCollider() {
    if (!this.cylinder) return;
    const { center, radius, halfHeight } = this.cylinder;
    const r = radius + this.ropeRadius * 0.98; // keep a hair away to avoid z-fighting

    for (let i = 0; i < this.segmentCount; i++) {
      const p = this.positions[i];
      // Only collide within Y bounds
      if (p.y < center.y - halfHeight || p.y > center.y + halfHeight) continue;

      // Compute xz vector to axis
      const dx = p.x - center.x;
      const dz = p.z - center.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < r * r) {
        const dist = Math.sqrt(distSq) || 1e-6;
        const nx = dx / dist;
        const nz = dz / dist;
        // Project out to the surface
        p.x = center.x + nx * r;
        p.z = center.z + nz * r;

        // Apply simple friction by damping tangential motion (prev->current) component
        const prev = this.prevPositions[i];
        const vx = p.x - prev.x;
        const vz = p.z - prev.z;
        // Tangent is perpendicular to normal in xz plane: t = (-nz, nx)
        const tx = -nz;
        const tz = nx;
        const vTan = vx * tx + vz * tz; // scalar projection onto tangent
        const dampedVTan = vTan * (1 - this.friction);
        // Recompose velocity: v' = v - vTan*t + dampedVTan*t
        const newVx = vx - vTan * tx + dampedVTan * tx;
        const newVz = vz - vTan * tz + dampedVTan * tz;
        // Update prev so that new velocity takes effect next step
        prev.x = p.x - newVx;
        prev.z = p.z - newVz;
      }
    }
  }
}

export function computePolylineLength(points: readonly THREE.Vector3[]): number {
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    len += points[i].distanceTo(points[i + 1]);
  }
  return len;
}

export function resamplePolyline(points: readonly THREE.Vector3[], samples: number): THREE.Vector3[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [points[0].clone()];

  const totalLen = computePolylineLength(points);
  if (totalLen <= 1e-6) return points.map((p) => p.clone());

  const result: THREE.Vector3[] = [];
  let segIndex = 0;
  let segStart = points[0].clone();
  let segEnd = points[1].clone();
  let segLen = segStart.distanceTo(segEnd);
  let acc = 0;

  result.push(segStart.clone());
  const step = totalLen / (samples - 1);

  for (let s = 1; s < samples - 1; s++) {
    const target = step * s;
    while (acc + segLen < target && segIndex < points.length - 2) {
      acc += segLen;
      segIndex++;
      segStart = points[segIndex].clone();
      segEnd = points[segIndex + 1].clone();
      segLen = segStart.distanceTo(segEnd);
    }
    const t = segLen > 0 ? (target - acc) / segLen : 0;
    const p = new THREE.Vector3().lerpVectors(segStart, segEnd, t);
    result.push(p);
  }
  result.push(points[points.length - 1].clone());
  return result;
}

export function pointOnPolylineAt(points: readonly THREE.Vector3[], t01: number): THREE.Vector3 {
  const t = THREE.MathUtils.clamp(t01, 0, 1);
  const totalLen = computePolylineLength(points);
  if (totalLen <= 1e-6) return points[0]?.clone() ?? new THREE.Vector3();
  const target = totalLen * t;
  let acc = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const seg = a.distanceTo(b);
    if (acc + seg >= target) {
      const localT = (target - acc) / seg;
      return new THREE.Vector3().lerpVectors(a, b, localT);
    }
    acc += seg;
  }
  return points[points.length - 1].clone();
}

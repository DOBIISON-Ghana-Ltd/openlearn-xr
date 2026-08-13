---
name: 3d-simulation-modeling
description: Standardized rules and step-by-step workflow for building high-quality, physically proportional 3D WebGL physics and chemistry lab simulations in React Three Fiber (R3F). Triggers when building or editing 3D experiment models, creating model.v0.tsx, or converting prompts, images, or PDFs into 3D simulations.
---

# 3D Simulation Modeling Guidelines

This skill enforces strict spatial, visual, and architectural standards when creating interactive 3D WebGL simulation models for OpenLearnXR.

---

## 📋 Step-by-Step Modeling Workflow

Whenever the user provides a prompt, topic, image, or PDF describing a 3D simulation to build:

### Step 1: Verification Table (MANDATORY BEFORE WRITING CODE)
Before writing or editing code in `model.v0.tsx`, you **MUST** present a **Model & Dimension Verification Table** to the user containing:
1. **Item Name**: Every 3D apparatus or component to be modeled.
2. **Real-World Size**: Metric dimensions (cm/metres).
3. **3D Scale Dimensions**: `[Width, Height, Depth]` in 3D units ($1.0\text{ unit} = 1.0\text{ metre}$).
4. **Material Finish**: Material type (`LabGlass`, `LabMetal`, `LabPlastic`, `LabFluid`, etc.).
5. **Initial Position**: $(X, Y, Z)$ position relative to Center Origin $(0, 0, 0)$.

> ⚠️ **DO NOT write code in `model.v0.tsx` until the user confirms or adjusts this verification table!**

### Step 2: Implementation
Once approved, write the code inside `src/local/simulations/library/<slug>/model.v0.tsx` following the spatial and visual rules below.

---

## 🎭 Renderer Stage & Aesthetic Environment

1. **Clean Light Mode Studio Stage**:
   - The stage container MUST use clean, professional academic light-mode styling (`bg-surface-white`), matching the application's clean educational interface.
2. **Hero Camera Framing & Limits**:
   - Camera position MUST start centered and heroically sized (`position: [0, 0.4, 2.6]`, `fov: 45`) so models fill the central viewing area cleanly.
   - `OrbitControls` MUST restrict zoom (`minDistance={1.2}`, `maxDistance={4.8}`) and prevent camera dipping under the horizon (`maxPolarAngle={Math.PI / 2 + 0.05}`).
3. **Floating Models (No Stands/Bases for Abstract Chemistry)**:
   - Subatomic/molecular models (atoms, orbitals, molecules) MUST float cleanly in mid-air at origin $(0, 0, 0)$, NEVER on heavy mechanical metal stands or workbenches!

---

## 📐 Spatial & Unit Standards

1. **World Unit Scale**:
   - $\mathbf{1.0\text{ World Unit} = 1.0\text{ Metre (1.0m)}}$
   - $1\text{ cm} = 0.01\text{ units}$
   - $10\text{ cm} = 0.1\text{ units}$
   - $50\text{ cm} = 0.5\text{ units}$
   - $100\text{ cm} = 1.0\text{ unit}$

2. **Workspace Bounding Volume**:
   - Total Volume: $\mathbf{6.0 \times 4.0 \times 6.0\text{ units}}$ ($6\text{m} \times 4\text{m} \times 6\text{m}$).
   - Bounds: $X: -3.0 \text{ to } +3.0$, $Y: -2.0 \text{ to } +2.0$, $Z: -3.0 \text{ to } +3.0$.

3. **Center Origin $(0, 0, 0)$**:
   - The origin $(0, 0, 0)$ is the exact center of the workspace volume.
   - All meshes start naturally centered at $(0, 0, 0)$ with zero manual group offsets.

---

## 🎨 Geometry & Material Rules

### 1. SVG Path Lathe Geometries (`SvgLathe`)
For complex turned shapes (beakers, flasks, lenses, pulleys, balloon orbital lobes):
- **NEVER** hardcode raw arrays of 50 manual `Vector2` points!
- **ALWAYS** use the standard `SvgLathe` component pattern using `SVGLoader`:

```tsx
import { SVGLoader } from 'three-stdlib';

export function SvgLathe({
  pathData,
  segments = 48,
  subdivisions = 40,
  children,
}: {
  pathData: string;
  segments?: number;
  subdivisions?: number;
  children?: React.ReactNode;
}) {
  const points = useMemo(() => {
    const loader = new SVGLoader();
    const strokeData = loader.parse(`<svg><path d="${pathData}" /></svg>`);
    if (!strokeData.paths.length) return [];
    const shapes = SVGLoader.createShapes(strokeData.paths[0]);
    if (!shapes.length) return [];
    const rawPoints = shapes[0].getPoints(subdivisions);
    return rawPoints.map((p) => new THREE.Vector2(p.x, -p.y));
  }, [pathData, subdivisions]);

  if (!points.length) return null;

  return (
    <mesh>
      <latheGeometry args={[points, segments]} />
      {children}
    </mesh>
  );
}
```

### 2. Crisp 3D Vector Text & Graduations
- **Troika SDF Text**: Always use `@react-three/drei` `<Text>` for labels, meter displays, and tick numbers. Never use low-resolution 2D canvas textures.
- **Procedural 3D Line Ticks**: Render ruler ticks and graduation marks using procedural 3D box meshes (`<boxGeometry args={[0.002, 0.015, 0.001]} />`) for 100% crisp vector lines.

### 3. Motion & Animation Standards
- All `useFrame` animations **MUST** use frame `delta` time (`useFrame((state, delta) => ...)`).
- Use `THREE.MathUtils.damp` for smooth spring-like control transitions.

---

## 🛠️ R3F Skills Reference

Always consult the standard R3F skills to ensure zero syntax or prop errors:
- `r3f-fundamentals` (Canvas, hooks, refs)
- `r3f-geometry` (Geometries, buffer geometries)
- `r3f-materials` (Standard, physical, shader materials)
- `r3f-lighting` (Lights, shadows, environment)
- `r3f-animation` (`useFrame`, spring physics)
- `r3f-interaction` (Pointer events, controls)
- `r3f-loaders` (`useGLTF`, loaders)

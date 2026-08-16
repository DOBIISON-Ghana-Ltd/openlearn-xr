'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';

export interface SvgLatheProps extends React.ComponentPropsWithoutRef<'mesh'> {
  pathData: string;
  segments?: number;
  subdivisions?: number;
  children?: React.ReactNode;
}

/**
 * Reusable SVG Lathe Component
 * Converts SVG path data into smooth turned 3D lathe geometries
 */
export function SvgLathe({
  pathData,
  segments = 48,
  subdivisions = 40,
  children,
  ...props
}: SvgLatheProps) {
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
    <mesh {...props}>
      <latheGeometry args={[points, segments]} />
      {children}
    </mesh>
  );
}

export default SvgLathe;

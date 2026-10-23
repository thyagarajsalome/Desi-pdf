"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import JSZip from "jszip";

// Comprehensive CAD & App Icon Definitions (24x24 grid, 1.8px default stroke)
export const ICON_LIBRARY = [
  // --- A. CAD ARCHITECTURE (From iconsPlan.md) ---
  {
    id: "tool-wall",
    name: "Wall Tool",
    category: "cad-arch",
    desc: "Parallel wall edges with structural core",
    tags: ["wall", "cad", "architecture", "building", "plan"],
    render: (sw, lc, lj) => (
      <>
        <path d="M3 6h18v12H3z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M3 10h18M3 14h18" strokeWidth={sw * 0.75} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M3 6h18v12H3z"/><path d="M3 10h18M3 14h18" stroke-width="${sw * 0.75}"/></svg>`
  },
  {
    id: "tool-door",
    name: "Door (Swing Arc)",
    category: "cad-arch",
    desc: "Floor-plan 90° door leaf and swing arc",
    tags: ["door", "swing", "arc", "room", "plan"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 19V5M4 19h16" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M4 19L4 7" strokeWidth={sw * 1.1} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M4 7A12 12 0 0 1 16 19" strokeWidth={sw * 0.85} strokeLinecap={lc} strokeLinejoin={lj} strokeDasharray="2.5 2" fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 19V5M4 19h16"/><path d="M4 19L4 7" stroke-width="${sw * 1.1}"/><path d="M4 7A12 12 0 0 1 16 19" stroke-width="${sw * 0.85}" stroke-dasharray="2.5 2"/></svg>`
  },
  {
    id: "tool-window",
    name: "Window Glazing",
    category: "cad-arch",
    desc: "Parallel glazing lines in wall opening",
    tags: ["window", "glazing", "glass", "opening"],
    render: (sw, lc, lj) => (
      <>
        <path d="M3 7v10M21 7v10" strokeWidth={sw * 1.2} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M3 7h18M3 17h18" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M3 10.5h18M3 13.5h18" strokeWidth={sw * 0.75} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M3 7v10M21 7v10" stroke-width="${sw * 1.2}"/><path d="M3 7h18M3 17h18"/><path d="M3 10.5h18M3 13.5h18" stroke-width="${sw * 0.75}"/></svg>`
  },
  {
    id: "tool-column",
    name: "Structural Column",
    category: "cad-arch",
    desc: "Plan-view square column with cross-bracing",
    tags: ["column", "pillar", "structural", "concrete"],
    render: (sw, lc, lj) => (
      <>
        <rect x="5" y="5" width="14" height="14" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M5 5l14 14M5 19l14-14" strokeWidth={sw * 0.8} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><rect x="5" y="5" width="14" height="14"/><path d="M5 5l14 14M5 19l14-14" stroke-width="${sw * 0.8}"/></svg>`
  },
  {
    id: "tool-staircase",
    name: "Staircase Treads",
    category: "cad-arch",
    desc: "Plan treads with walk direction arrow",
    tags: ["stairs", "staircase", "steps", "levels"],
    render: (sw, lc, lj) => (
      <>
        <rect x="4" y="4" width="16" height="16" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M4 8h16M4 12h16M4 16h16" strokeWidth={sw * 0.8} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M12 18V6m0 0l-2.5 2.5M12 6l2.5 2.5" strokeWidth={sw * 1.1} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><rect x="4" y="4" width="16" height="16"/><path d="M4 8h16M4 12h16M4 16h16" stroke-width="${sw * 0.8}"/><path d="M12 18V6m0 0l-2.5 2.5M12 6l2.5 2.5" stroke-width="${sw * 1.1}"/></svg>`
  },
  {
    id: "tool-dimension",
    name: "Dimension Line",
    category: "cad-arch",
    desc: "Dimension line with 45° architectural ticks",
    tags: ["dimension", "measure", "distance", "annotation"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 5v14M20 5v14" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M4 12h16" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M2.5 13.5l3-3M18.5 13.5l3-3" strokeWidth={sw * 1.25} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 5v14M20 5v14"/><path d="M4 12h16"/><path d="M2.5 13.5l3-3M18.5 13.5l3-3" stroke-width="${sw * 1.25}"/></svg>`
  },
  {
    id: "tool-room",
    name: "Room Boundary",
    category: "cad-arch",
    desc: "Boundary area outline with center tag",
    tags: ["room", "area", "boundary", "zone"],
    render: (sw, lc, lj) => (
      <>
        <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} strokeDasharray="3 2" fill="none" />
        <path d="M9 12h6M12 9v6" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="3 2"/><path d="M9 12h6M12 9v6"/></svg>`
  },

  // --- B. CAD DRAWING TOOLS ---
  {
    id: "tool-line",
    name: "Line Tool",
    category: "cad-draw",
    desc: "Single segment with visible precision endpoints",
    tags: ["line", "draw", "vector", "segment"],
    render: (sw, lc, lj) => (
      <>
        <path d="M5 19L19 5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M5 19L19 5"/><circle cx="5" cy="19" r="1.5" fill="${col}" stroke="none"/><circle cx="19" cy="5" r="1.5" fill="${col}" stroke="none"/></svg>`
  },
  {
    id: "tool-polyline",
    name: "Polyline",
    category: "cad-draw",
    desc: "Multi-segment connected path with vertices",
    tags: ["polyline", "path", "nodes", "points"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 18L9 8L15 14L20 5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <circle cx="4" cy="18" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="9" cy="8" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="20" cy="5" r="1.3" fill="currentColor" stroke="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 18L9 8L15 14L20 5"/><circle cx="4" cy="18" r="1.3" fill="${col}" stroke="none"/><circle cx="9" cy="8" r="1.3" fill="${col}" stroke="none"/><circle cx="15" cy="14" r="1.3" fill="${col}" stroke="none"/><circle cx="20" cy="5" r="1.3" fill="${col}" stroke="none"/></svg>`
  },
  {
    id: "tool-rectangle",
    name: "Rectangle",
    category: "cad-draw",
    desc: "Geometric orthogonal box",
    tags: ["rectangle", "box", "square", "shape"],
    render: (sw, lc, lj) => (
      <rect x="4" y="5" width="16" height="14" rx="0.5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><rect x="4" y="5" width="16" height="14" rx="0.5"/></svg>`
  },
  {
    id: "tool-circle",
    name: "Circle (Center Mark)",
    category: "cad-draw",
    desc: "Circle with technical center crosshair",
    tags: ["circle", "round", "radius", "diameter"],
    render: (sw, lc, lj) => (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M12 9.5v5M9.5 12h5" strokeWidth={sw * 0.8} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><circle cx="12" cy="12" r="8"/><path d="M12 9.5v5M9.5 12h5" stroke-width="${sw * 0.8}"/></svg>`
  },
  {
    id: "tool-arc",
    name: "3-Point Arc",
    category: "cad-draw",
    desc: "Curved arc with radial endpoints",
    tags: ["arc", "curve", "radius"],
    render: (sw, lc, lj) => (
      <>
        <path d="M5 19A13 13 0 0 1 19 5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <circle cx="5" cy="19" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="19" cy="5" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M5 19A13 13 0 0 1 19 5"/><circle cx="5" cy="19" r="1.4" fill="${col}" stroke="none"/><circle cx="19" cy="5" r="1.4" fill="${col}" stroke="none"/></svg>`
  },
  {
    id: "tool-polygon",
    name: "Polygon (Hexagon)",
    category: "cad-draw",
    desc: "Regular multi-sided polygon",
    tags: ["polygon", "hexagon", "mesh"],
    render: (sw, lc, lj) => (
      <polygon points="12,3.5 20,8 20,16 12,20.5 4,16 4,8" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><polygon points="12,3.5 20,8 20,16 12,20.5 4,16 4,8"/></svg>`
  },

  // --- C. CAD EDITING & TRANSFORMS ---
  {
    id: "tool-move",
    name: "Move Tool",
    category: "cad-edit",
    desc: "4-way orthogonal displacement arrows",
    tags: ["move", "translate", "arrows", "position"],
    render: (sw, lc, lj) => (
      <>
        <path d="M12 3v18M3 12h18" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M9.5 5.5L12 3l2.5 2.5M9.5 18.5L12 21l2.5-2.5M5.5 9.5L3 12l2.5 2.5M18.5 9.5L21 12l-2.5 2.5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M12 3v18M3 12h18"/><path d="M9.5 5.5L12 3l2.5 2.5M9.5 18.5L12 21l2.5-2.5M5.5 9.5L3 12l2.5 2.5M18.5 9.5L21 12l-2.5 2.5"/></svg>`
  },
  {
    id: "tool-copy",
    name: "Copy Geometry",
    category: "cad-edit",
    desc: "Duplicated offset CAD elements",
    tags: ["copy", "duplicate", "clone"],
    render: (sw, lc, lj) => (
      <>
        <rect x="8" y="8" width="12" height="12" rx="1" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M4 16V5a1 1 0 0 1 1-1h11" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><rect x="8" y="8" width="12" height="12" rx="1"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/></svg>`
  },
  {
    id: "tool-rotate",
    name: "Rotate Tool",
    category: "cad-edit",
    desc: "Curved rotation arrow around center pivot",
    tags: ["rotate", "spin", "turn", "angle"],
    render: (sw, lc, lj) => (
      <>
        <path d="M20 12A8 8 0 1 1 12 4v4" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M9 4.5l3 3.5 3-3.5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M20 12A8 8 0 1 1 12 4v4"/><path d="M9 4.5l3 3.5 3-3.5"/><circle cx="12" cy="12" r="1.5" fill="${col}" stroke="none"/></svg>`
  },
  {
    id: "tool-mirror",
    name: "Mirror Tool",
    category: "cad-edit",
    desc: "Symmetric triangles across reflection axis",
    tags: ["mirror", "symmetry", "reflect", "flip"],
    render: (sw, lc, lj) => (
      <>
        <path d="M12 2v20" strokeWidth={sw * 0.9} strokeLinecap={lc} strokeLinejoin={lj} strokeDasharray="2.5 2" />
        <path d="M8 7L3 17h5z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M16 7l5 10h-5z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M12 2v20" stroke-width="${sw * 0.9}" stroke-dasharray="2.5 2"/><path d="M8 7L3 17h5z"/><path d="M16 7l5 10h-5z"/></svg>`
  },
  {
    id: "tool-trim",
    name: "Trim Tool",
    category: "cad-edit",
    desc: "Boundary cutter intersecting geometry",
    tags: ["trim", "cut", "scissors", "clip"],
    render: (sw, lc, lj) => (
      <>
        <path d="M3 12h18" strokeWidth={sw * 1.1} strokeLinecap={lc} strokeLinejoin={lj} />
        <path d="M8 7l8 10M8 17l8-10" strokeWidth={sw * 0.85} strokeLinecap={lc} strokeLinejoin={lj} strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M3 12h18" stroke-width="${sw * 1.1}"/><path d="M8 7l8 10M8 17l8-10" stroke-width="${sw * 0.85}" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="1.8" fill="${col}" stroke="none"/></svg>`
  },
  {
    id: "tool-offset",
    name: "Offset Parallel",
    category: "cad-edit",
    desc: "Equidistant parallel shifted line",
    tags: ["offset", "parallel", "shift", "inset"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 19V5h15" strokeWidth={sw * 1.1} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M9 19V10h10" strokeWidth={sw * 0.85} strokeLinecap={lc} strokeLinejoin={lj} strokeDasharray="2.5 2" fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 19V5h15" stroke-width="${sw * 1.1}"/><path d="M9 19V10h10" stroke-width="${sw * 0.85}" stroke-dasharray="2.5 2"/></svg>`
  },

  // --- D. CAD NAVIGATION & SYSTEM ---
  {
    id: "tool-select",
    name: "Select (Pickbox)",
    category: "cad-nav",
    desc: "Precision CAD crosshair cursor",
    tags: ["select", "pointer", "cursor", "pick"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 4l6.5 15.5 2.5-6 6-2.5L4 4z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <rect x="13" y="13" width="5" height="5" strokeWidth={sw * 0.8} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 4l6.5 15.5 2.5-6 6-2.5L4 4z"/><rect x="13" y="13" width="5" height="5" stroke-width="${sw * 0.8}"/></svg>`
  },
  {
    id: "tool-pan",
    name: "Pan Hand",
    category: "cad-nav",
    desc: "Viewport canvas drag hand",
    tags: ["pan", "hand", "drag", "viewport"],
    render: (sw, lc, lj) => (
      <path d="M18 11V6a2 2 0 0 0-4 0v4m-4-2V4a2 2 0 0 0-4 0v10l-2.5-2.5a2 2 0 0 0-2.8 2.8L8 21h8a4 4 0 0 0 4-4v-6a2 2 0 0 0-4 0" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M18 11V6a2 2 0 0 0-4 0v4m-4-2V4a2 2 0 0 0-4 0v10l-2.5-2.5a2 2 0 0 0-2.8 2.8L8 21h8a4 4 0 0 0 4-4v-6a2 2 0 0 0-4 0"/></svg>`
  },
  {
    id: "tool-fit-view",
    name: "Fit View",
    category: "cad-nav",
    desc: "Fit drawing geometry to canvas",
    tags: ["fit", "zoom", "extents", "view"],
    render: (sw, lc, lj) => (
      <>
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
        <rect x="8" y="8" width="8" height="8" strokeWidth={sw * 0.8} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><rect x="8" y="8" width="8" height="8" stroke-width="${sw * 0.8}"/></svg>`
  },
  {
    id: "tool-layers",
    name: "Layers Manager",
    category: "cad-nav",
    desc: "Stacked isometric CAD drafting layers",
    tags: ["layers", "levels", "sheets", "overlay"],
    render: (sw, lc, lj) => (
      <>
        <polygon points="12,3 21,7.5 12,12 3,7.5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M3 11.5l9 4.5 9-4.5M3 16l9 4.5 9-4.5" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><polygon points="12,3 21,7.5 12,12 3,7.5"/><path d="M3 11.5l9 4.5 9-4.5M3 16l9 4.5 9-4.5"/></svg>`
  },

  // --- E. MOBILE & APP ESSENTIALS ---
  {
    id: "app-home",
    name: "Home",
    category: "app-ui",
    desc: "Application home dashboard",
    tags: ["home", "main", "dashboard"],
    render: (sw, lc, lj) => (
      <>
        <path d="M3 9.5l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M3 9.5l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>`
  },
  {
    id: "app-search",
    name: "Search",
    category: "app-ui",
    desc: "Search bar & query magnifying glass",
    tags: ["search", "find", "lookup"],
    render: (sw, lc, lj) => (
      <>
        <circle cx="11" cy="11" r="7" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M21 21l-4.35-4.35" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`
  },
  {
    id: "app-bell",
    name: "Notification Bell",
    category: "app-ui",
    desc: "Push notification alert bell",
    tags: ["bell", "notification", "alert"],
    render: (sw, lc, lj) => (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  },
  {
    id: "app-user",
    name: "User Profile",
    category: "app-ui",
    desc: "Account avatar / profile icon",
    tags: ["user", "avatar", "account", "profile"],
    render: (sw, lc, lj) => (
      <>
        <circle cx="12" cy="7" r="4" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>`
  },
  {
    id: "app-settings",
    name: "Settings Gear",
    category: "app-ui",
    desc: "System preferences cog",
    tags: ["settings", "gear", "config", "preferences"],
    render: (sw, lc, lj) => (
      <>
        <circle cx="12" cy="12" r="3" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
  {
    id: "app-save",
    name: "Save Disk",
    category: "app-ui",
    desc: "Floppy disk data save",
    tags: ["save", "disk", "store", "write"],
    render: (sw, lc, lj) => (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <polyline points="17 21 17 13 7 13 7 21" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <polyline points="7 3 7 8 15 8" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`
  },
  {
    id: "app-download",
    name: "Download",
    category: "app-ui",
    desc: "Download export arrow",
    tags: ["download", "save", "export", "file"],
    render: (sw, lc, lj) => (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`
  },
  {
    id: "app-cloud",
    name: "Cloud Sync",
    category: "app-ui",
    desc: "Cloud storage status",
    tags: ["cloud", "sync", "server", "upload"],
    render: (sw, lc, lj) => (
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`
  },
  {
    id: "app-code",
    name: "Code Brackets",
    category: "app-ui",
    desc: "Developer source tags",
    tags: ["code", "developer", "brackets", "html"],
    render: (sw, lc, lj) => (
      <>
        <polyline points="16 18 22 12 16 6" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
        <polyline points="8 6 2 12 8 18" strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} fill="none" />
      </>
    ),
    rawSvg: (sw, lc, lj, col) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  }
];

// Helper: Generate a standard multi-resolution Windows / Web ICO binary blob in pure JavaScript
async function createIcoBlob(canvases) {
  // canvases is an array of { width, height, canvas }
  const pngBlobs = await Promise.all(
    canvases.map(
      (item) =>
        new Promise((resolve) => {
          item.canvas.toBlob(async (blob) => {
            const buffer = await blob.arrayBuffer();
            resolve({
              width: item.width >= 256 ? 0 : item.width,
              height: item.height >= 256 ? 0 : item.height,
              data: new Uint8Array(buffer),
            });
          }, "image/png");
        })
    )
  );

  const count = pngBlobs.length;
  const headerSize = 6 + 16 * count;
  let totalSize = headerSize;
  pngBlobs.forEach((b) => {
    totalSize += b.data.length;
  });

  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  // 1. ICONDIR Header (6 bytes)
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // 1 = ICO icon type
  view.setUint16(4, count, true); // Number of images

  // 2. ICONDIRENTRY (16 bytes each)
  let offset = headerSize;
  pngBlobs.forEach((b, i) => {
    const entryOffset = 6 + i * 16;
    view.setUint8(entryOffset + 0, b.width); // Width (0 for 256)
    view.setUint8(entryOffset + 1, b.height); // Height (0 for 256)
    view.setUint8(entryOffset + 2, 0); // Palette colors
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, b.data.length, true); // Size of image data
    view.setUint32(entryOffset + 12, offset, true); // Offset of image data

    out.set(b.data, offset);
    offset += b.data.length;
  });

  return new Blob([out], { type: "image/x-icon" });
}

export default function IconGenerator() {
  // Mode & Tabs
  const [activeTab, setActiveTab] = useState("library"); // 'library' | 'custom'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_LIBRARY[0]);

  // Visual Customizer State
  const [strokeWidth, setStrokeWidth] = useState(1.8);
  const [lineCap, setLineCap] = useState("round"); // 'round' | 'square'
  const [iconColor, setIconColor] = useState("#2563eb");
  const [containerShape, setContainerShape] = useState("transparent"); // 'transparent' | 'circle' | 'square' | 'squircle'
  const [containerBg, setContainerBg] = useState("#ffffff");
  const [iconPadding, setIconPadding] = useState(0); // 0 to 40%

  // Status & Progress
  const [copiedStatus, setCopiedStatus] = useState("");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingIco, setIsDownloadingIco] = useState(false);
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Custom Upload State
  const [customUploadedIcon, setCustomUploadedIcon] = useState(null);
  const [customSvgCode, setCustomSvgCode] = useState("");
  const fileInputRef = useRef(null);

  // Filtered Icons for CAD library
  const filteredIcons = useMemo(() => {
    return ICON_LIBRARY.filter((icon) => {
      const matchesCat =
        selectedCategory === "all" ||
        (selectedCategory === "cad" && icon.category.startsWith("cad")) ||
        icon.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Color Presets
  const colorPresets = [
    { label: "Blueprint Blue", hex: "#2563eb" },
    { label: "Slate Dark", hex: "#0f172a" },
    { label: "Emerald Green", hex: "#059669" },
    { label: "Engineering Amber", hex: "#d97706" },
    { label: "Crimson Red", hex: "#dc2626" },
    { label: "Purple Accent", hex: "#7c3aed" },
    { label: "Neutral White", hex: "#ffffff" }
  ];

  // Container Background Presets
  const bgPresets = [
    { label: "White", hex: "#ffffff" },
    { label: "Dark Slate", hex: "#0f172a" },
    { label: "Light Blue", hex: "#eff6ff" },
    { label: "Blueprint Blue", hex: "#2563eb" },
    { label: "Emerald Tint", hex: "#ecfdf5" },
    { label: "Amber Warm", hex: "#fffbeb" },
    { label: "Pitch Black", hex: "#000000" }
  ];

  // Universal Canvas Rasterizer (handles both SVG vector and raster PNG/JPG/WEBP)
  const renderIconToCanvas = (size) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Draw container background if enabled
      if (containerShape === "circle") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = containerBg;
        ctx.fill();
        ctx.clip();
      } else if (containerShape === "squircle" || containerShape === "square") {
        const r = containerShape === "squircle" ? size * 0.225 : 0;
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(0, 0, size, size, r);
        } else {
          ctx.rect(0, 0, size, size);
        }
        ctx.fillStyle = containerBg;
        ctx.fill();
        ctx.clip();
      }

      // Calculate inner area based on iconPadding (0 to 40%)
      const paddingPx = (size * (iconPadding || 0)) / 100;
      const innerX = paddingPx;
      const innerY = paddingPx;
      const innerW = Math.max(1, size - paddingPx * 2);
      const innerH = Math.max(1, size - paddingPx * 2);

      const restoreAndResolve = () => {
        if (containerShape === "circle" || containerShape === "squircle" || containerShape === "square") {
          ctx.restore();
        }
        resolve(canvas);
      };

      if (selectedIcon.isRaster && selectedIcon.dataUrl) {
        // Draw uploaded raster image (PNG, JPG, WEBP)
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(innerW / img.naturalWidth, innerH / img.naturalHeight);
          const dw = img.naturalWidth * scale;
          const dh = img.naturalHeight * scale;
          const dx = innerX + (innerW - dw) / 2;
          const dy = innerY + (innerH - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
          restoreAndResolve();
        };
        img.onerror = (err) => {
          if (containerShape === "circle" || containerShape === "squircle" || containerShape === "square") {
            ctx.restore();
          }
          reject(err);
        };
        img.src = selectedIcon.dataUrl;
      } else {
        // Draw SVG (built-in CAD or uploaded SVG)
        const rawSvg = selectedIcon.rawSvg
          ? selectedIcon.rawSvg(strokeWidth, lineCap, lineCap === "round" ? "round" : "miter", iconColor)
          : customSvgCode;

        const img = new Image();
        const blob = new Blob([rawSvg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          ctx.drawImage(img, innerX, innerY, innerW, innerH);
          URL.revokeObjectURL(url);
          restoreAndResolve();
        };
        img.onerror = (err) => {
          URL.revokeObjectURL(url);
          if (containerShape === "circle" || containerShape === "squircle" || containerShape === "square") {
            ctx.restore();
          }
          reject(err);
        };
        img.src = url;
      }
    });
  };

  // Download Single PNG
  const handleDownloadPng = async (size) => {
    try {
      const canvas = await renderIconToCanvas(size);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedIcon.id || "icon"}-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("PNG export error:", err);
      alert("Failed to export PNG");
    }
  };

  // Download Standard Windows & Web Favicon (.ico)
  const handleDownloadIco = async () => {
    setIsDownloadingIco(true);
    try {
      const sizes = [16, 32, 48];
      const canvases = [];
      for (const s of sizes) {
        const c = await renderIconToCanvas(s);
        canvases.push({ width: s, height: s, canvas: c });
      }
      const icoBlob = await createIcoBlob(canvases);
      const url = URL.createObjectURL(icoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedIcon.id || "favicon"}.ico`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ICO export error:", err);
      alert("Failed to export .ico favicon");
    } finally {
      setIsDownloadingIco(false);
    }
  };

  // Copy SVG Code
  const handleCopySvg = () => {
    if (selectedIcon.isRaster) return;
    const raw = selectedIcon.rawSvg
      ? selectedIcon.rawSvg(
          strokeWidth,
          lineCap,
          lineCap === "round" ? "round" : "miter",
          iconColor
        )
      : customSvgCode;
    navigator.clipboard.writeText(raw);
    setCopiedStatus("svg");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Copy React (JSX) Code
  const handleCopyJsx = () => {
    if (selectedIcon.isRaster) return;
    const componentName = (selectedIcon.id || "AppIcon")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Icon";
    const raw = selectedIcon.rawSvg
      ? selectedIcon.rawSvg(
          strokeWidth,
          lineCap,
          lineCap === "round" ? "round" : "miter",
          "currentColor"
        )
      : customSvgCode;
    const jsx = `export function ${componentName}({ size = 24, color = "currentColor", className = "", ...props }) {
  return (
    ${raw.replace('width="24"', 'width={size}').replace('height="24"', 'height={size}').replace('stroke="currentColor"', 'stroke={color} className={className}')}
  );
}`;
    navigator.clipboard.writeText(jsx);
    setCopiedStatus("jsx");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Download Complete CAD Icon Package (.ZIP)
  const handleDownloadCadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Folder structure based on Section 12 of iconsPlan.md
      const navFolder = zip.folder("icons/navigation");
      const drawFolder = zip.folder("icons/drawing");
      const archFolder = zip.folder("icons/architecture");
      const editFolder = zip.folder("icons/editing");
      const appFolder = zip.folder("icons/application");

      ICON_LIBRARY.forEach((icon) => {
        const svgContent = icon.rawSvg(1.8, "round", "round", "currentColor");
        if (icon.category === "cad-arch") {
          archFolder.file(`${icon.id}.svg`, svgContent);
        } else if (icon.category === "cad-draw") {
          drawFolder.file(`${icon.id}.svg`, svgContent);
        } else if (icon.category === "cad-edit") {
          editFolder.file(`${icon.id}.svg`, svgContent);
        } else if (icon.category === "cad-nav") {
          navFolder.file(`${icon.id}.svg`, svgContent);
        } else {
          appFolder.file(`${icon.id}.svg`, svgContent);
        }
      });

      const componentTemplate = `// Reusable CAD Desktop Application Icon Component (AutoCAD / Desktop Standard)
// Generated by DesiPDF Icon Studio (https://www.convertpdftojpg.in/icon-generator)

import React from "react";

export function CADIcon({ name, size = 24, color = "currentColor", className = "", ...props }) {
  return (
    <span 
      className={\`inline-flex items-center justify-center shrink-0 \${className}\`} 
      style={{ width: size, height: size, color }}
      {...props}
    >
      <img 
        src={\`/assets/icons/\${name}.svg\`} 
        alt={name}
        width={size} 
        height={size}
        style={{ pointerEvents: 'none' }}
      />
    </span>
  );
}
`;
      zip.file("CADIcon.jsx", componentTemplate);

      const readme = `# CAD Desktop Application Icon Pack
Conforms to technical CAD standards:
- 24x24 viewBox base grid
- 1.8px default technical stroke
- Theme-aware currentColor support
- Cleanly readable at 16px, 20px, 24px, and 32px sizes.

Unpack the 'icons/' folder into your desktop application's asset directory.
`;
      zip.file("README.md", readme);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CAD-Desktop-Icon-System-24x24.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("Error generating icon pack ZIP");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Download Complete Multi-Platform App Icon Pack (.ZIP)
  const handleDownloadAppPackZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // 1. Web Favicon Suite
      const webFolder = zip.folder("web");
      const webSizes = [16, 32, 180, 192, 512];
      for (const s of webSizes) {
        const c = await renderIconToCanvas(s);
        const dataUrl = c.toDataURL("image/png");
        const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        if (s === 16) webFolder.file("favicon-16x16.png", b64, { base64: true });
        else if (s === 32) webFolder.file("favicon-32x32.png", b64, { base64: true });
        else if (s === 180) webFolder.file("apple-touch-icon.png", b64, { base64: true });
        else if (s === 192) webFolder.file("android-chrome-192x192.png", b64, { base64: true });
        else if (s === 512) webFolder.file("android-chrome-512x512.png", b64, { base64: true });
      }

      // Generate and put favicon.ico in root and web/
      const icoSizes = [16, 32, 48];
      const icoCanvases = [];
      for (const s of icoSizes) {
        const c = await renderIconToCanvas(s);
        icoCanvases.push({ width: s, height: s, canvas: c });
      }
      const icoBlob = await createIcoBlob(icoCanvases);
      const icoArrayBuffer = await icoBlob.arrayBuffer();
      zip.file("favicon.ico", icoArrayBuffer);
      webFolder.file("favicon.ico", icoArrayBuffer);

      // site.webmanifest
      const manifest = {
        name: selectedIcon.name || "App Icon",
        short_name: selectedIcon.name || "App",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        theme_color: containerBg || "#ffffff",
        background_color: containerBg || "#ffffff",
        display: "standalone"
      };
      webFolder.file("site.webmanifest", JSON.stringify(manifest, null, 2));

      // 2. Android App Icons (Mipmap folders)
      const androidFolder = zip.folder("android");
      const androidMipmaps = [
        { folder: "mipmap-mdpi", size: 48 },
        { folder: "mipmap-hdpi", size: 72 },
        { folder: "mipmap-xhdpi", size: 96 },
        { folder: "mipmap-xxhdpi", size: 144 },
        { folder: "mipmap-xxxhdpi", size: 192 },
      ];
      for (const item of androidMipmaps) {
        const c = await renderIconToCanvas(item.size);
        const dataUrl = c.toDataURL("image/png");
        const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        androidFolder.folder(item.folder).file("ic_launcher.png", b64, { base64: true });
        androidFolder.folder(item.folder).file("ic_launcher_round.png", b64, { base64: true });
      }
      const playStoreCanvas = await renderIconToCanvas(512);
      const playStoreB64 = playStoreCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
      androidFolder.file("playstore-icon-512x512.png", playStoreB64, { base64: true });

      // 3. iOS App Icons
      const iosFolder = zip.folder("ios");
      const iosSizes = [
        { name: "AppIcon-20x20@2x.png", size: 40 },
        { name: "AppIcon-20x20@3x.png", size: 60 },
        { name: "AppIcon-29x29@2x.png", size: 58 },
        { name: "AppIcon-29x29@3x.png", size: 87 },
        { name: "AppIcon-40x40@2x.png", size: 80 },
        { name: "AppIcon-40x40@3x.png", size: 120 },
        { name: "AppIcon-60x60@2x.png", size: 120 },
        { name: "AppIcon-60x60@3x.png", size: 180 },
        { name: "AppStore-1024x1024.png", size: 1024 },
      ];
      for (const item of iosSizes) {
        const c = await renderIconToCanvas(item.size);
        const dataUrl = c.toDataURL("image/png");
        const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        iosFolder.file(item.name, b64, { base64: true });
      }

      // 4. Windows Desktop / CAD App Icons
      const winFolder = zip.folder("windows");
      const winSizes = [16, 20, 24, 32, 48, 64, 128, 256];
      for (const s of winSizes) {
        const c = await renderIconToCanvas(s);
        const dataUrl = c.toDataURL("image/png");
        const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        winFolder.file(`app-icon-${s}x${s}.png`, b64, { base64: true });
      }
      winFolder.file("app-icon.ico", icoArrayBuffer);

      // 5. If vector SVG is available, save pure SVG
      if (!selectedIcon.isRaster && selectedIcon.rawSvg) {
        const raw = selectedIcon.rawSvg(strokeWidth, lineCap, lineCap === "round" ? "round" : "miter", iconColor);
        zip.file(`${selectedIcon.id || "icon"}.svg`, raw);
      }

      // 6. Documentation README
      const readme = `# Multi-Platform App Icon Pack
Generated by DesiPDF Icon Studio (https://www.convertpdftojpg.in/icon-generator)

## Folder Contents:
1. /web
   - favicon.ico (16x16, 32x32, 48x48)
   - favicon-16x16.png & favicon-32x32.png
   - apple-touch-icon.png (180x180)
   - android-chrome-192x192.png & 512x512.png
   - site.webmanifest

2. /android
   - mipmap-mdpi (48x48)
   - mipmap-hdpi (72x72)
   - mipmap-xhdpi (96x96)
   - mipmap-xxhdpi (144x144)
   - mipmap-xxxhdpi (192x192)
   - playstore-icon-512x512.png

3. /ios
   - iPhone & iPad AppIcon assets (40px, 58px, 60px, 80px, 87px, 120px, 180px)
   - AppStore-1024x1024.png for App Store Connect

4. /windows
   - Desktop & CAD application toolbar icons (16, 20, 24, 32, 48, 64, 128, 256px)
   - app-icon.ico

Drop these files into your mobile app or desktop CAD solution!
`;
      zip.file("README.md", readme);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedIcon.id || "app-icon"}-complete-icon-pack.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("App pack export error:", err);
      alert("Error generating app icon pack");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Process any uploaded file (SVG, PNG, JPG, JPEG, WEBP)
  const processImageFile = (file) => {
    if (!file) return;

    const fileNameClean = file.name.replace(/\.[^/.]+$/, "");
    const safeId = "uploaded-" + fileNameClean.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    // 1. Vector SVG upload
    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        setCustomSvgCode(content);
        const newIcon = {
          id: safeId,
          name: fileNameClean,
          category: "custom",
          desc: "User uploaded SVG vector",
          tags: ["custom", "uploaded", "svg"],
          isRaster: false,
          render: () => (
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full flex items-center justify-center"
            />
          ),
          rawSvg: () => content
        };
        setCustomUploadedIcon(newIcon);
        setSelectedIcon(newIcon);
        setActiveTab("custom");
      };
      reader.readAsText(file);
    }
    // 2. Raster Image Upload (PNG, JPG, JPEG, WEBP, GIF, BMP)
    else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        const newIcon = {
          id: safeId,
          name: fileNameClean,
          category: "custom",
          desc: `Uploaded image (${file.type.replace("image/", "").toUpperCase() || "Raster"})`,
          tags: ["custom", "uploaded", "image"],
          isRaster: true,
          dataUrl: dataUrl,
          render: () => (
            <img
              src={dataUrl}
              alt={fileNameClean}
              className="w-full h-full object-contain pointer-events-none"
            />
          ),
          rawSvg: null
        };
        setCustomUploadedIcon(newIcon);
        setSelectedIcon(newIcon);
        // Default to a squircle with pleasant padding so logos look ready for app stores
        if (containerShape === "transparent") {
          setContainerShape("squircle");
          setContainerBg("#ffffff");
          setIconPadding(12);
        }
        setActiveTab("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  // File Input Handler
  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Vectorize active raster image into SVG curves
  const handleVectorizeActive = async () => {
    if (!selectedIcon.isRaster || !selectedIcon.dataUrl) return;
    setIsVectorizing(true);
    try {
      const { vectorizeImage } = await import("@/lib/vectorizer");
      const result = await vectorizeImage(selectedIcon.dataUrl, {
        mode: "monochrome",
        threshold: 128,
        pathOmit: 4,
      });

      const vectorized = {
        ...selectedIcon,
        isRaster: false,
        rawSvg: () => result.svgString,
        render: () => (
          <div
            dangerouslySetInnerHTML={{ __html: result.svgString }}
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full flex items-center justify-center"
          />
        ),
        desc: "Vectorized SVG curves (traced from image)",
      };
      setSelectedIcon(vectorized);
      setCustomSvgCode(result.svgString);
    } catch (err) {
      console.error("Vectorization failed:", err);
      alert("Failed to vectorize image.");
    } finally {
      setIsVectorizing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Banner / Hero Info - Clean Standard Dark Card */}
      <div className="bg-white dark:bg-[#09090b] text-gray-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 text-xs font-semibold tracking-wide">
              <i className="fa-solid fa-shapes text-gray-500 dark:text-gray-400"></i> Technical CAD &amp; App Icon Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Design, Convert &amp; Export Precision Icons &amp; Favicons
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Upload any image (<strong className="text-gray-900 dark:text-gray-200 font-semibold">PNG, JPG, WEBP, SVG</strong>) to convert into multi-resolution app icons and favicons, or explore 35+ standardized 24×24 CAD architectural and UI vectors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setActiveTab("custom");
                fileInputRef.current?.click();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs sm:text-sm border border-transparent transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-cloud-arrow-up text-sm"></i>
              <span>Upload Image / Logo</span>
            </button>
            <Link
              href="/image-to-svg"
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-bezier-curve text-sm"></i>
              <span>Vectorize (SVG)</span>
            </Link>
            <button
              onClick={handleDownloadCadZip}
              disabled={isDownloadingZip}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <i className="fa-solid fa-file-zipper text-sm"></i>
              <span>{isDownloadingZip ? "Packaging..." : "CAD Pack (.zip)"}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomUpload}
              accept="image/png, image/jpeg, image/webp, image/svg+xml, .svg, .png, .jpg, .jpeg, .webp"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Icon Library Browser or Image Converter Uploader (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Top Mode Tabs: CAD Library vs Image to Icon Converter */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/60 rounded-2xl">
            <button
              onClick={() => setActiveTab("library")}
              className={`py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "library"
                  ? "bg-white dark:bg-black text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-compass-drafting"></i>
              <span>CAD &amp; App Vector Library</span>
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "custom"
                  ? "bg-white dark:bg-black text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-image"></i>
              <span>Convert Image / Logo</span>
              <span className="hidden sm:inline-block text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-black uppercase">
                Any Format
              </span>
            </button>
          </div>

          {/* TAB 1: CAD & App Vector Library */}
          {activeTab === "library" && (
            <div className="space-y-6">
              {/* Search & Category Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search CAD tools (wall, line, door, rotate, measure)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  {[
                    { id: "all", label: "All Icons" },
                    { id: "cad-arch", label: "Architecture 🏛️" },
                    { id: "cad-draw", label: "Drawing ✏️" },
                    { id: "cad-edit", label: "Editing / Transform ✂️" },
                    { id: "cad-nav", label: "Navigation 🧭" },
                    { id: "app-ui", label: "Mobile & App UI 📱" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredIcons.map((icon) => {
                  const isSelected = selectedIcon.id === icon.id;
                  return (
                    <button
                      key={icon.id}
                      onClick={() => setSelectedIcon(icon)}
                      className={`group relative p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/30"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-[#121217]"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 group-hover:scale-110 transition-transform">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                        >
                          {icon.render(1.8, "round", "round")}
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate w-full px-1" title={icon.name}>
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-xs text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                <span>Showing {filteredIcons.length} technical vector symbols</span>
                <span>24×24 ViewBox • Pure SVG</span>
              </div>
            </div>
          )}

          {/* TAB 2: Image / Logo to Icon Converter */}
          {activeTab === "custom" && (
            <div className="space-y-6">
              {/* Drag and Drop Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-3xl text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/40"
                    : "border-gray-300 dark:border-gray-700 hover:border-blue-500 bg-gray-50/50 dark:bg-[#121217]/50"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shadow-inner">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Drag &amp; Drop your Image or Logo here
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports <strong className="text-gray-700 dark:text-gray-300">PNG, JPG, JPEG, WEBP, and SVG</strong> (any resolution)
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {["PNG", "JPG", "WEBP", "SVG"].map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-200/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      .{fmt.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Uploaded Image Active Status Card */}
              {customUploadedIcon && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-black border border-blue-200 dark:border-blue-800 flex items-center justify-center overflow-hidden p-1 shrink-0">
                      {customUploadedIcon.isRaster ? (
                        <img
                          src={customUploadedIcon.dataUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: customSvgCode }}
                          className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-extrabold text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                          {customUploadedIcon.name}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {customUploadedIcon.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 transition cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIcon(ICON_LIBRARY[0]);
                        setActiveTab("library");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-200/80 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 transition cursor-pointer"
                    >
                      Switch to CAD
                    </button>
                  </div>
                </div>
              )}

              {/* Conversion Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-200/60 dark:border-gray-800/80 space-y-1">
                  <div className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-shapes text-blue-500"></i> Shape Fitting
                  </div>
                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    Automatic framing for Squircles (iOS/Android), Circles (Favicons/Avatars), or Transparent icons.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-200/60 dark:border-gray-800/80 space-y-1">
                  <div className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-sliders text-emerald-500"></i> Breathing Padding
                  </div>
                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    Adjust padding scale from 0% to 40% so logos sit comfortably within app launcher borders.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-200/60 dark:border-gray-800/80 space-y-1">
                  <div className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-download text-amber-500"></i> 1-Click All Exports
                  </div>
                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    Download single PNGs, multi-resolution Favicon (.ico), or complete multi-platform App Packs (.zip).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Customizer & Multi-Size Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Icon Inspector Card */}
          <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  {selectedIcon.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {selectedIcon.desc}
                </p>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${
                selectedIcon.isRaster
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                  : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900"
              }`}>
                {selectedIcon.isRaster ? "Image (Raster)" : "Vector (SVG)"}
              </span>
            </div>

            {/* In-Studio Vectorizer Banner for Uploaded Raster Images */}
            {selectedIcon.isRaster && (
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-200/80 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Vectorize Bitmap to SVG
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Trace image pixels into crisp vector paths
                    </span>
                  </div>
                  <button
                    onClick={handleVectorizeActive}
                    disabled={isVectorizing}
                    className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
                  >
                    <i className={`fa-solid ${isVectorizing ? "fa-circle-notch fa-spin" : "fa-bezier-curve"} text-[10px]`}></i>
                    <span>{isVectorizing ? "Tracing..." : "Vectorize"}</span>
                  </button>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-800">
                  <span>Need color layers or fine threshold?</span>
                  <Link href="/image-to-svg" className="text-blue-500 hover:underline font-bold">
                    Open Full Vectorizer &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Main Interactive Stage */}
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-[#121217] rounded-2xl border border-gray-200/80 dark:border-gray-800 relative group">
              <div 
                className="w-36 h-36 flex items-center justify-center transition-all duration-300 overflow-hidden shadow-inner"
                style={{
                  backgroundColor: containerShape !== "transparent" ? containerBg : "transparent",
                  borderRadius: containerShape === "circle" ? "9999px" : containerShape === "squircle" ? "30px" : containerShape === "square" ? "10px" : "0",
                  padding: `${iconPadding}%`
                }}
              >
                {selectedIcon.isRaster ? (
                  <img
                    src={selectedIcon.dataUrl}
                    alt={selectedIcon.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full transition-all"
                    fill="none"
                    stroke={iconColor}
                    style={{ color: iconColor }}
                  >
                    {selectedIcon.render(strokeWidth, lineCap, lineCap === "round" ? "round" : "miter")}
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-wider">
                Live Preview Stage
              </span>
            </div>

            {/* Multi-Size CAD Toolbar & App Inspection Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Multi-Size Inspection (Favicon &amp; App Launcher)
              </span>
              <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-[#121217] rounded-2xl border border-gray-200/80 dark:border-gray-800 text-center">
                {[
                  { px: 16, label: "16px (Dense CAD / Favicon)" },
                  { px: 20, label: "20px (Toolbar)" },
                  { px: 24, label: "24px (Standard)" },
                  { px: 32, label: "32px (Ribbon)" },
                  { px: 48, label: "48px (App Icon)" },
                ].map((s) => (
                  <div key={s.px} className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-black/50 border border-gray-200/50 dark:border-gray-800/80">
                    <div 
                      style={{ 
                        width: s.px, 
                        height: s.px,
                        backgroundColor: containerShape !== "transparent" ? containerBg : "transparent",
                        borderRadius: containerShape === "circle" ? "9999px" : containerShape === "squircle" ? `${s.px * 0.22}px` : "0",
                        padding: containerShape !== "transparent" ? `${(s.px * iconPadding) / 100}px` : "0"
                      }} 
                      className="flex items-center justify-center overflow-hidden"
                    >
                      {selectedIcon.isRaster ? (
                        <img
                          src={selectedIcon.dataUrl}
                          alt={selectedIcon.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          width={s.px}
                          height={s.px}
                          fill="none"
                          stroke={iconColor}
                          style={{ color: iconColor }}
                        >
                          {selectedIcon.render(strokeWidth, lineCap, lineCap === "round" ? "round" : "miter")}
                        </svg>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-2">{s.px}px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customizer Controls */}
            <div className="space-y-4 pt-2">
              
              {/* Padding / Scale Slider (Especially essential for uploaded logos) */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  <span>Icon Padding / Fit: {iconPadding}%</span>
                  <span className="text-blue-500 font-semibold">{iconPadding === 0 ? "Full Bleed (0%)" : `${iconPadding}% Margin`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={iconPadding}
                  onChange={(e) => setIconPadding(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <button onClick={() => setIconPadding(0)} className="hover:underline">0% (Fill)</button>
                  <button onClick={() => setIconPadding(12)} className="font-bold text-blue-600 hover:underline">12% (Recommended)</button>
                  <button onClick={() => setIconPadding(24)} className="hover:underline">24% (Spacious)</button>
                </div>
              </div>

              {/* Container Shape & Background */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Container Shape
                  </label>
                  <select
                    value={containerShape}
                    onChange={(e) => setContainerShape(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="transparent">Transparent (None)</option>
                    <option value="squircle">Squircle (iOS / Android)</option>
                    <option value="circle">Circle (Round Icon / Favicon)</option>
                    <option value="square">Square (Desktop Tile)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Background Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      disabled={containerShape === "transparent"}
                      value={containerBg.startsWith("#") ? containerBg : "#ffffff"}
                      onChange={(e) => setContainerBg(e.target.value)}
                      className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border-0 p-0 shrink-0 disabled:opacity-40"
                    />
                    <select
                      disabled={containerShape === "transparent"}
                      value={containerBg}
                      onChange={(e) => setContainerBg(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-2 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none disabled:opacity-40"
                    >
                      {bgPresets.map((bg) => (
                        <option key={bg.hex} value={bg.hex}>{bg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vector Only Controls (Stroke Width, Caps, Stroke Color) */}
              {!selectedIcon.isRaster && (
                <>
                  {/* Stroke Width Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      <span>Stroke Width: {strokeWidth}px</span>
                      <span className="text-blue-500 font-semibold">{strokeWidth === 1.8 ? "1.8px (CAD Standard)" : ""}</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="3.0"
                      step="0.1"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <button onClick={() => setStrokeWidth(1.2)} className="hover:underline">1.2px (Thin)</button>
                      <button onClick={() => setStrokeWidth(1.8)} className="font-bold text-blue-600 hover:underline">1.8px (CAD)</button>
                      <button onClick={() => setStrokeWidth(2.2)} className="hover:underline">2.2px (Bold)</button>
                    </div>
                  </div>

                  {/* Line Cap & Corners */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Line Caps &amp; Joins
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setLineCap("round")}
                        className={`py-1.5 rounded-lg transition cursor-pointer ${
                          lineCap === "round"
                            ? "bg-white dark:bg-black text-blue-600 shadow-xs"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Round
                      </button>
                      <button
                        onClick={() => setLineCap("square")}
                        className={`py-1.5 rounded-lg transition cursor-pointer ${
                          lineCap === "square"
                            ? "bg-white dark:bg-black text-blue-600 shadow-xs"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Technical
                      </button>
                    </div>
                  </div>

                  {/* Stroke Color Customizer */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Stroke Color
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {colorPresets.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setIconColor(c.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                            iconColor === c.hex ? "border-blue-500 scale-110 ring-2 ring-blue-500/20" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                      <input
                        type="color"
                        value={iconColor.startsWith("#") ? iconColor : "#2563eb"}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-7 h-7 rounded-full overflow-hidden cursor-pointer border-0 p-0"
                        title="Custom stroke color"
                      />
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Export & Action Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              
              {/* Vector Code Copy (If SVG) */}
              {!selectedIcon.isRaster && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopySvg}
                    className="py-3 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <i className={`fa-solid ${copiedStatus === "svg" ? "fa-check text-emerald-400" : "fa-copy"}`}></i>
                    <span>{copiedStatus === "svg" ? "SVG Copied!" : "Copy SVG Code"}</span>
                  </button>
                  <button
                    onClick={handleCopyJsx}
                    className="py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className={`fa-solid ${copiedStatus === "jsx" ? "fa-check text-emerald-500" : "fa-code"}`}></i>
                    <span>{copiedStatus === "jsx" ? "React JSX Copied!" : "Copy React (JSX)"}</span>
                  </button>
                </div>
              )}

              {/* PNG Download Sizes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-gray-50 dark:bg-[#121217] p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-800 text-xs font-bold">
                <span className="text-gray-500 text-[11px] pl-1">Export PNG:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[24, 32, 48, 64, 128, 256, 512, 1024].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleDownloadPng(sz)}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-[11px] text-gray-700 dark:text-gray-300 transition cursor-pointer"
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Primary Export Buttons: Favicon (.ico) & App Pack (.zip) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleDownloadIco}
                  disabled={isDownloadingIco}
                  className="w-full py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <i className="fa-solid fa-star text-sm"></i>
                  <span>{isDownloadingIco ? "Building..." : "Download Favicon (.ico)"}</span>
                </button>

                <button
                  onClick={handleDownloadAppPackZip}
                  disabled={isDownloadingZip}
                  className="w-full py-3.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold text-xs border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <i className="fa-solid fa-file-zipper text-sm"></i>
                  <span>{isDownloadingZip ? "Packaging..." : "App Icon Pack (.zip)"}</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400">
                🔒 100% Client-Side. Your images are converted instantly in your browser and never sent to a server.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* SEO & Technical Guidelines Section (Organic Traffic Booster) */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Free Image to Icon Converter &amp; Technical CAD Icon Studio
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Convert any picture or logo (PNG, JPG, WEBP, SVG) into multi-platform app icon packages and Windows/browser favicons (.ico). Designed for developers, architectural draftsmen, and mobile app creators who need pixel-perfect precision on 24×24 integer grids without blurry edges.
          </p>
        </div>

        {/* 3 Step Walkthrough */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              1
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Upload Any Image Format</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload your company logo, custom vector, or illustration in PNG, JPG, WEBP, or SVG format. Everything loads privately inside your browser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Customize Frame &amp; Padding</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Choose Squircle for iOS &amp; Android, Circle for web favicons, or Transparent. Use the padding slider so your logo breathes and never clips.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              3
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Export .ICO &amp; App Pack (.ZIP)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Download standard multi-resolution .ico favicons (16, 32, 48px) or a complete ZIP package containing Android mipmaps, iOS App Icons, and web manifests.
            </p>
          </div>
        </div>

        {/* FAQs for Rich Snippets */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Can I convert PNG or JPG images into favicon .ico files?
              </span>
              <span className="text-gray-500 leading-relaxed">
                Yes! Upload any PNG, JPG, or WEBP image, select your desired background and padding, and click "Download Favicon (.ico)". The tool creates a compliant multi-resolution Windows and Web .ico file containing 16x16, 32x32, and 48x48 icon streams.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                How do I use these icons in a Desktop CAD application?
              </span>
              <span className="text-gray-500 leading-relaxed">
                Click "Download CAD Pack (.zip)". It downloads an organized folder structure (<code className="text-blue-500 font-mono">architecture/</code>, <code className="text-blue-500 font-mono">drawing/</code>, etc.) with a reusable <code className="text-blue-500 font-mono">CADIcon.jsx</code> component you can drop directly into your Electron, Tauri, or Qt project.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                What sizes are included in the Multi-Platform App Icon Pack?
              </span>
              <span className="text-gray-500 leading-relaxed">
                The App Icon Pack ZIP includes all official Android mipmap sizes (mdpi to xxxhdpi + 512px Play Store icon), iOS app icons (40px up to 1024px App Store graphic), Windows desktop resolutions (16px to 256px + .ico), and web favicons with a ready-to-use <code className="text-blue-500 font-mono">site.webmanifest</code>.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Are my uploaded images or logos kept private?
              </span>
              <span className="text-gray-500 leading-relaxed">
                Yes, 100%. All rasterization, scaling, ICO generation, and ZIP compression occur directly inside your browser using HTML5 Canvas and Web APIs. No images are ever uploaded to any external server.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

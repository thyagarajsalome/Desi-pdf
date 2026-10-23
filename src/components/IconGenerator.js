"use client";

import React, { useState, useRef, useMemo } from "react";
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

export default function IconGenerator() {
  // State
  const [activeTab, setActiveTab] = useState("library"); // 'library' | 'custom'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_LIBRARY[0]);

  // Visual Customizer State
  const [strokeWidth, setStrokeWidth] = useState(1.8);
  const [lineCap, setLineCap] = useState("round"); // 'round' | 'square'
  const [iconColor, setIconColor] = useState("#2563eb");
  const [containerShape, setContainerShape] = useState("transparent"); // 'transparent' | 'circle' | 'square' | 'squircle'
  const [containerBg, setContainerBg] = useState("#eff6ff");
  const [copiedStatus, setCopiedStatus] = useState("");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Custom Upload State
  const [customSvgCode, setCustomSvgCode] = useState("");
  const fileInputRef = useRef(null);

  // Filtered Icons
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

  // Copy SVG Code
  const handleCopySvg = () => {
    const raw = selectedIcon.rawSvg(
      strokeWidth,
      lineCap,
      lineCap === "round" ? "round" : "miter",
      iconColor
    );
    navigator.clipboard.writeText(raw);
    setCopiedStatus("svg");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Copy React (JSX) Code
  const handleCopyJsx = () => {
    const componentName = selectedIcon.id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Icon";
    const raw = selectedIcon.rawSvg(
      strokeWidth,
      lineCap,
      lineCap === "round" ? "round" : "miter",
      "currentColor"
    );
    const jsx = `export function ${componentName}({ size = 24, color = "currentColor", className = "", ...props }) {
  return (
    ${raw.replace('width="24"', 'width={size}').replace('height="24"', 'height={size}').replace('stroke="currentColor"', 'stroke={color} className={className}')}
  );
}`;
    navigator.clipboard.writeText(jsx);
    setCopiedStatus("jsx");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Rasterize SVG onto an in-memory Canvas
  const rasterizeToCanvas = (svgString, size) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        
        // Draw background container if enabled
        if (containerShape === "circle") {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = containerBg;
          ctx.fill();
        } else if (containerShape === "squircle" || containerShape === "square") {
          const r = containerShape === "squircle" ? size * 0.22 : 0;
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, r);
          ctx.fillStyle = containerBg;
          ctx.fill();
        }

        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Download Single PNG
  const handleDownloadPng = async (size) => {
    try {
      const raw = selectedIcon.rawSvg(
        strokeWidth,
        lineCap,
        lineCap === "round" ? "round" : "miter",
        iconColor
      );
      const canvas = await rasterizeToCanvas(raw, size);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedIcon.id}-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("PNG export error:", err);
      alert("Failed to export PNG");
    }
  };

  // Download Complete CAD Icon Package (.ZIP) as specified in iconsPlan.md
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

      // Include a ready-to-use Desktop CAD Icon Component template
      const componentTemplate = `// Reusable CAD Desktop Application Icon Component (AutoCAD / Desktop Standard)
// Generated by DesiPDF Icon Studio (https://www.convertpdftojpg.in/icon-generator)

import React from "react";

export function CADIcon({ name, size = 24, color = "currentColor", className = "", ...props }) {
  // Grid size: 24x24 default, supports 16px, 20px, 24px, 32px display
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

      // Include README instructions
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

  // Download Multi-Size Mobile App Icon Pack (.ZIP)
  const handleDownloadAppPackZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();
      const raw = selectedIcon.rawSvg(
        strokeWidth,
        lineCap,
        lineCap === "round" ? "round" : "miter",
        iconColor
      );

      // Sizes for Android (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) and Windows ICO
      const sizes = [16, 24, 32, 48, 64, 128, 256, 512];
      for (const s of sizes) {
        const canvas = await rasterizeToCanvas(raw, s);
        const dataUrl = canvas.toDataURL("image/png");
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`icon-${s}x${s}.png`, base64Data, { base64: true });
      }

      // Also save the pure SVG
      zip.file(`${selectedIcon.id}.svg`, raw);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedIcon.id}-app-icon-pack.zip`;
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

  // Custom File Upload Handler
  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        setCustomSvgCode(content);
        setSelectedIcon({
          id: "custom-uploaded-icon",
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "custom",
          desc: "User uploaded SVG icon",
          tags: ["custom", "uploaded"],
          render: () => (
            <div dangerouslySetInnerHTML={{ __html: content }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
          ),
          rawSvg: () => content
        });
      };
      reader.readAsText(file);
    } else {
      alert("Please upload an SVG file for vector customization, or pick from our built-in CAD library.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Banner / Hero Info */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-700/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <i className="fa-solid fa-shapes"></i> Technical CAD &amp; App Icon Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Design, Customize &amp; Export Precision SVG Icons
            </h2>
            <p className="text-blue-200/80 text-sm sm:text-base leading-relaxed">
              Standardized on a 24×24 grid with crisp 1.8px CAD strokes. Perfectly scalable at 16, 20, 24, 32, and 48px for Windows CAD desktop software, mobile apps, and modern web apps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleDownloadCadZip}
              disabled={isDownloadingZip}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <i className="fa-solid fa-file-zipper text-base"></i>
              <span>{isDownloadingZip ? "Packaging..." : "Download CAD Pack (.zip)"}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>Upload Custom SVG</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomUpload}
              accept=".svg,image/svg+xml"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Icon Library Browser (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
          
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
                  className={`px-3 py-1.5 rounded-xl transition ${
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-1">
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
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {selectedIcon.id}
              </span>
            </div>

            {/* Main Interactive Stage */}
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-[#121217] rounded-2xl border border-gray-200/80 dark:border-gray-800 relative group">
              <div 
                className="w-32 h-32 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: containerShape !== "transparent" ? containerBg : "transparent",
                  borderRadius: containerShape === "circle" ? "9999px" : containerShape === "squircle" ? "24px" : containerShape === "square" ? "8px" : "0",
                  padding: containerShape !== "transparent" ? "20px" : "0"
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full transition-all"
                  fill="none"
                  stroke={iconColor}
                  style={{ color: iconColor }}
                >
                  {selectedIcon.render(strokeWidth, lineCap, lineCap === "round" ? "round" : "miter")}
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-wider">
                Active Preview (Stage)
              </span>
            </div>

            {/* Multi-Size CAD Toolbar & App Inspection Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Multi-Size Legibility Test (Desktop &amp; Mobile)
              </span>
              <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-[#121217] rounded-2xl border border-gray-200/80 dark:border-gray-800 text-center">
                {[
                  { px: 16, label: "16px (Dense CAD)" },
                  { px: 20, label: "20px (Toolbar)" },
                  { px: 24, label: "24px (Standard)" },
                  { px: 32, label: "32px (Ribbon)" },
                  { px: 48, label: "48px (App Icon)" },
                ].map((s) => (
                  <div key={s.px} className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-black/50 border border-gray-200/50 dark:border-gray-800/80">
                    <div style={{ width: s.px, height: s.px }} className="flex items-center justify-center text-gray-900 dark:text-gray-100">
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
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-2">{s.px}px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geometry & Stroke Controls */}
            <div className="space-y-4 pt-2">
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
                  <button onClick={() => setStrokeWidth(1.8)} className="font-bold text-blue-600 hover:underline">1.8px (AutoCAD)</button>
                  <button onClick={() => setStrokeWidth(2.2)} className="hover:underline">2.2px (Bold)</button>
                </div>
              </div>

              {/* Line Cap & Corners */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Line Caps &amp; Joins
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setLineCap("round")}
                      className={`py-1.5 rounded-lg transition ${
                        lineCap === "round"
                          ? "bg-white dark:bg-black text-blue-600 shadow-xs"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Round
                    </button>
                    <button
                      onClick={() => setLineCap("square")}
                      className={`py-1.5 rounded-lg transition ${
                        lineCap === "square"
                          ? "bg-white dark:bg-black text-blue-600 shadow-xs"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Technical
                    </button>
                  </div>
                </div>

                {/* Container Shape for App Icons */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    App Icon Backdrop
                  </label>
                  <select
                    value={containerShape}
                    onChange={(e) => setContainerShape(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="transparent">None (Transparent)</option>
                    <option value="squircle">Squircle (iOS / Android)</option>
                    <option value="circle">Circle (Round Icon)</option>
                    <option value="square">Square (Desktop Tile)</option>
                  </select>
                </div>
              </div>

              {/* Color Customizer */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Stroke Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setIconColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
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
                    title="Custom color picker"
                  />
                </div>
              </div>
            </div>

            {/* Export & Code Copy Action Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
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

              {/* PNG Download Sizes */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-[#121217] p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-800 text-xs font-bold">
                <span className="text-gray-500 text-[11px] pl-1">Quick PNG Export:</span>
                <div className="flex gap-1.5">
                  {[24, 32, 64, 128, 512].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleDownloadPng(sz)}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-[11px] text-gray-700 dark:text-gray-300 transition"
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              {/* App Icon Pack ZIP */}
              <button
                onClick={handleDownloadAppPackZip}
                disabled={isDownloadingZip}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <i className="fa-solid fa-file-zipper"></i>
                <span>Download Multi-Resolution App Pack (.zip)</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* SEO & Technical Guidelines Section (Meat for Google Ranking & Users) */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Why Use Technical CAD &amp; Vector App Icons?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            In architectural drafting software (like AutoCAD, Revit, and LibreCAD) as well as modern mobile applications, icons must convey exact technical operations rather than generic artwork. A Line tool must be visibly distinct from a Wall; an architectural Door must show its 90-degree swing arc; and icons must remain razor-sharp at high-DPI scaling down to 16px.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
              <i className="fa-solid fa-ruler-combined"></i>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">24×24 Pixel Grid</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed on an integer coordinate grid so strokes avoid sub-pixel blurring when rendered at 16px, 20px, 24px, or 32px display sizes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
              <i className="fa-solid fa-moon"></i>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Auto Dark/Light Theme</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Exported with <code className="text-blue-500 font-mono">currentColor</code> so your UI buttons and toolbars automatically adapt to dark mode and light mode without duplicate files.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
              <i className="fa-solid fa-laptop-code"></i>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Cross-Platform Ready</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Export pure SVG code, React JSX, high-res PNGs, and structured ZIP folders ready for Electron, Tauri, Qt, Flutter, React Native, and web apps.
            </p>
          </div>
        </div>

        {/* FAQs for Rich Snippets */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
                Why is stroke width set to 1.8px by default?
              </span>
              <span className="text-gray-500 leading-relaxed">
                A 1.8px stroke width provides optimal contrast and clarity when rendered on both 96 DPI standard desktop displays and modern 4K high-DPI screens without overwhelming small 16px buttons.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

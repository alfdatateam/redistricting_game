import './style.css';

// --- Constants ---

const GRID_SIZE = 5;
const TOTAL_DOTS = GRID_SIZE * GRID_SIZE;
const NUM_DISTRICTS = 5;
const DOTS_PER_DISTRICT = 5;
const DOT_RADIUS = 18;
const CELL_SIZE = 60;
const PADDING = 40;
const SVG_SIZE = GRID_SIZE * CELL_SIZE + PADDING * 2;

const DISTRICT_COLORS = [
  '#e6194b', // red
  '#3cb44b', // green
  '#4363d8', // blue
  '#f58231', // orange
  '#911eb4', // purple
];

const DOT_ORANGE = '#f5a623';
const DOT_GREEN = '#8ecb8e';

// --- Types ---

interface Dot {
  index: number;
  row: number;
  col: number;
  color: string;
  districtId: number | null;
}

// --- State ---

let dots: Dot[] = [];
let activeDistrict = 0;

function initDots(): void {
  const orangeIndices = new Set([0, 1, 5, 6, 10, 12, 15, 19, 20, 24]);
  dots = [];
  for (let i = 0; i < TOTAL_DOTS; i++) {
    dots.push({
      index: i,
      row: Math.floor(i / GRID_SIZE),
      col: i % GRID_SIZE,
      color: orangeIndices.has(i) ? DOT_ORANGE : DOT_GREEN,
      districtId: null,
    });
  }
}

// --- Boundary computation ---
// Traces the outer edges of a group of grid cells and returns an SVG path.
// Grid corner (col, row) maps to SVG position (PADDING + col * CELL_SIZE, PADDING + row * CELL_SIZE).
// This puts the boundary lines halfway between dot centers — around the cells, not through the dots.

function computeBoundary(districtDots: Dot[]): string {
  if (districtDots.length === 0) return '';

  const cellSet = new Set(districtDots.map(d => `${d.row},${d.col}`));

  interface Segment { x1: number; y1: number; x2: number; y2: number }
  const segments: Segment[] = [];

  for (const dot of districtDots) {
    const { row, col } = dot;
    if (!cellSet.has(`${row - 1},${col}`)) {
      segments.push({ x1: col, y1: row, x2: col + 1, y2: row });
    }
    if (!cellSet.has(`${row + 1},${col}`)) {
      segments.push({ x1: col + 1, y1: row + 1, x2: col, y2: row + 1 });
    }
    if (!cellSet.has(`${row},${col - 1}`)) {
      segments.push({ x1: col, y1: row + 1, x2: col, y2: row });
    }
    if (!cellSet.has(`${row},${col + 1}`)) {
      segments.push({ x1: col + 1, y1: row, x2: col + 1, y2: row + 1 });
    }
  }

  if (segments.length === 0) return '';

  // Chain segments into ordered polygon(s)
  const used = new Array(segments.length).fill(false);
  const paths: string[] = [];

  for (let start = 0; start < segments.length; start++) {
    if (used[start]) continue;

    const chain: { x: number; y: number }[] = [];
    used[start] = true;
    chain.push({ x: segments[start].x1, y: segments[start].y1 });
    chain.push({ x: segments[start].x2, y: segments[start].y2 });

    // Keep finding the next connected segment
    let searching = true;
    while (searching) {
      searching = false;
      const last = chain[chain.length - 1];
      for (let i = 0; i < segments.length; i++) {
        if (used[i]) continue;
        const s = segments[i];
        if (s.x1 === last.x && s.y1 === last.y) {
          chain.push({ x: s.x2, y: s.y2 });
          used[i] = true;
          searching = true;
          break;
        }
        if (s.x2 === last.x && s.y2 === last.y) {
          chain.push({ x: s.x1, y: s.y1 });
          used[i] = true;
          searching = true;
          break;
        }
      }
    }

    // Convert grid corners to SVG coordinates
    const points = chain.map(p => {
      const sx = PADDING + p.x * CELL_SIZE;
      const sy = PADDING + p.y * CELL_SIZE;
      return `${sx},${sy}`;
    });

    paths.push(`M${points.join('L')}Z`);
  }

  return paths.join(' ');
}

// --- DOM Setup (once) ---

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Redistricting &amp; Gerrymandering</h1>
  <p class="instructions">Draw 5 districts of 5 dots. Pick a district, then tap dots to assign them.</p>
  <div class="district-picker"></div>
  <div class="grid-container">
    <svg viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <g id="boundaries"></g>
      <g id="dots"></g>
    </svg>
  </div>
  <div class="feedback"></div>
  <button class="reset-btn">Reset</button>
`;

const pickerEl = app.querySelector<HTMLDivElement>('.district-picker')!;
const boundariesEl = app.querySelector<SVGGElement>('#boundaries')!;
const dotsEl = app.querySelector<SVGGElement>('#dots')!;
const feedbackEl = app.querySelector<HTMLDivElement>('.feedback')!;
const resetBtn = app.querySelector<HTMLButtonElement>('.reset-btn')!;

// Build district picker buttons (once)
DISTRICT_COLORS.forEach((color, i) => {
  const btn = document.createElement('button');
  btn.className = 'district-btn';
  btn.style.background = color;
  btn.dataset.district = String(i);
  btn.textContent = String(i + 1);
  btn.addEventListener('click', () => {
    activeDistrict = i;
    updatePickerHighlight();
  });
  pickerEl.appendChild(btn);
});

function updatePickerHighlight(): void {
  pickerEl.querySelectorAll<HTMLButtonElement>('.district-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === activeDistrict);
  });
}

// Build dot circles (once) — we update their attributes on state change
function buildDotElements(): void {
  dotsEl.innerHTML = '';
  for (const dot of dots) {
    const cx = PADDING + dot.col * CELL_SIZE + CELL_SIZE / 2;
    const cy = PADDING + dot.row * CELL_SIZE + CELL_SIZE / 2;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('dot');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', String(DOT_RADIUS));
    circle.setAttribute('fill', dot.color);
    circle.setAttribute('stroke', 'transparent');
    circle.setAttribute('stroke-width', '0');
    circle.dataset.index = String(dot.index);

    circle.addEventListener('click', () => handleDotClick(dot.index));
    dotsEl.appendChild(circle);
  }
}

function handleDotClick(index: number): void {
  const dot = dots[index];

  // Toggle off if already in active district
  if (dot.districtId === activeDistrict) {
    dot.districtId = null;
    updateVisuals();
    return;
  }

  // Don't exceed district size
  const currentCount = dots.filter(d => d.districtId === activeDistrict).length;
  if (currentCount >= DOTS_PER_DISTRICT) return;

  dot.districtId = activeDistrict;
  updateVisuals();
}

// Update dot strokes and boundaries without rebuilding the DOM
function updateVisuals(): void {
  // Update dot strokes
  const circles = dotsEl.querySelectorAll<SVGCircleElement>('.dot');
  circles.forEach(circle => {
    const idx = Number(circle.dataset.index);
    const dot = dots[idx];
    if (dot.districtId !== null) {
      circle.setAttribute('stroke', DISTRICT_COLORS[dot.districtId]);
      circle.setAttribute('stroke-width', '4');
    } else {
      circle.setAttribute('stroke', 'transparent');
      circle.setAttribute('stroke-width', '0');
    }
  });

  // Update boundaries
  boundariesEl.innerHTML = '';
  for (let d = 0; d < NUM_DISTRICTS; d++) {
    const dDots = dots.filter(dot => dot.districtId === d);
    const pathData = computeBoundary(dDots);
    if (pathData) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('district-boundary');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', DISTRICT_COLORS[d]);
      boundariesEl.appendChild(path);
    }
  }

  // Update feedback
  const counts = new Array(NUM_DISTRICTS).fill(0);
  for (const d of dots) {
    if (d.districtId !== null) counts[d.districtId]++;
  }
  const feedbackLines = counts.map((c: number, i: number) =>
    `<span class="count" style="color:${DISTRICT_COLORS[i]}">District ${i + 1}: ${c}/${DOTS_PER_DISTRICT}</span>`
  ).join(' &middot; ');

  const allFull = counts.every((c: number) => c === DOTS_PER_DISTRICT);
  const statusMsg = allFull
    ? '<br><strong style="color:#cb0034">All districts complete!</strong>'
    : '';

  feedbackEl.innerHTML = feedbackLines + statusMsg;
}

// Reset
resetBtn.addEventListener('click', () => {
  initDots();
  activeDistrict = 0;
  updatePickerHighlight();
  buildDotElements();
  updateVisuals();
});

// --- Init ---

initDots();
updatePickerHighlight();
buildDotElements();
updateVisuals();

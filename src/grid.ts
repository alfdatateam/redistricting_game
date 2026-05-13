import type { LevelConfig } from './levels';
import { GameState } from './game';
import { computeBoundary } from './boundary';

const DOT_ORANGE = '#f5a623';
const DOT_GREEN = '#8ecb8e';

const DISTRICT_COLORS = [
  '#e6194b', // red
  '#3cb44b', // green
  '#4363d8', // blue
  '#f58231', // orange
  '#911eb4', // purple
  '#42d4f4', // cyan
  '#f032e6', // magenta
];

export interface GridController {
  destroy(): void;
}

export function createGrid(container: HTMLElement, config: LevelConfig): GridController {
  const state = new GameState(config);

  // Compute viewBox from dot positions
  const rows = config.dots.map(d => d.row);
  const cols = config.dots.map(d => d.col);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  const padding = config.cellSize * 0.6;
  const vbX = minCol * config.cellSize - padding;
  const vbY = minRow * config.cellSize - padding;
  const vbW = (maxCol - minCol + 1) * config.cellSize + padding * 2;
  const vbH = (maxRow - minRow + 1) * config.cellSize + padding * 2;

  // Build DOM
  const card = document.createElement('div');
  card.className = 'grid-card';

  // Goal label
  const goalEl = document.createElement('p');
  goalEl.className = 'goal-label';
  goalEl.textContent = config.goal;
  card.appendChild(goalEl);

  // District picker
  const pickerEl = document.createElement('div');
  pickerEl.className = 'district-picker';
  const districtBtns: HTMLButtonElement[] = [];
  for (let i = 0; i < config.numDistricts; i++) {
    const btn = document.createElement('button');
    btn.className = 'district-btn';
    btn.style.background = DISTRICT_COLORS[i % DISTRICT_COLORS.length];
    btn.textContent = String(i + 1);
    btn.addEventListener('click', () => {
      state.activeDistrict = i;
      updatePickerHighlight();
    });
    pickerEl.appendChild(btn);
    districtBtns.push(btn);
  }
  card.appendChild(pickerEl);

  // SVG
  const svgContainer = document.createElement('div');
  svgContainer.className = 'grid-container';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const boundariesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const dotsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(boundariesG);
  svg.appendChild(dotsG);
  svgContainer.appendChild(svg);
  card.appendChild(svgContainer);

  // Build dot circles
  const circles: SVGCircleElement[] = [];
  for (const dot of config.dots) {
    const cx = dot.col * config.cellSize + config.cellSize / 2;
    const cy = dot.row * config.cellSize + config.cellSize / 2;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('dot');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', String(config.dotRadius));
    circle.setAttribute('fill', dot.color === 'orange' ? DOT_ORANGE : DOT_GREEN);
    circle.setAttribute('stroke', 'transparent');
    circle.setAttribute('stroke-width', '0');

    const idx = config.dots.indexOf(dot);
    circle.addEventListener('click', () => {
      if (state.assignDot(idx)) {
        updateVisuals();
      }
    });

    dotsG.appendChild(circle);
    circles.push(circle);
  }

  // Feedback
  const feedbackEl = document.createElement('div');
  feedbackEl.className = 'feedback';
  card.appendChild(feedbackEl);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    state.reset();
    updatePickerHighlight();
    updateVisuals();
  });
  card.appendChild(resetBtn);

  container.appendChild(card);

  function showPopup(message: string, title?: string): void {
    // Prevent duplicate popups
    if (card.querySelector('.popup-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup-card';

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'popup-title';
      titleEl.textContent = title;
      popup.appendChild(titleEl);
    }

    const msg = document.createElement('p');
    msg.className = 'popup-message';
    msg.textContent = message;
    popup.appendChild(msg);

    const btn = document.createElement('button');
    btn.className = 'popup-close-btn';
    btn.textContent = 'Got it';
    btn.addEventListener('click', () => overlay.remove());
    popup.appendChild(btn);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.appendChild(popup);
    card.appendChild(overlay);
  }

  function updatePickerHighlight(): void {
    districtBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === state.activeDistrict);
    });
  }

  function updateVisuals(): void {
    // Update dot strokes
    circles.forEach((circle, idx) => {
      const dot = state.dots[idx];
      if (dot.districtId !== null) {
        circle.setAttribute('stroke', DISTRICT_COLORS[dot.districtId % DISTRICT_COLORS.length]);
        circle.setAttribute('stroke-width', '4');
      } else {
        circle.setAttribute('stroke', 'transparent');
        circle.setAttribute('stroke-width', '0');
      }
    });

    // Update boundaries
    boundariesG.innerHTML = '';
    for (let d = 0; d < state.numDistricts; d++) {
      const dDots = state.getDistrictDots(d);
      const pathData = computeBoundary(dDots, config.cellSize, 0, 0);
      if (pathData) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('district-boundary');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', DISTRICT_COLORS[d % DISTRICT_COLORS.length]);
        boundariesG.appendChild(path);
      }
    }

    // Update feedback
    const counts = state.getCounts();
    const feedbackLines = counts.map((c: number, i: number) => {
      const maj = state.getDistrictMajority(i);
      const majLabel = maj === 'orange' ? ' 🟠' : maj === 'green' ? ' 🟢' : maj === 'tie' ? ' =' : '';
      return `<span class="count" style="color:${DISTRICT_COLORS[i % DISTRICT_COLORS.length]}">D${i + 1}: ${c}/${config.dotsPerDistrict}${majLabel}</span>`;
    }).join(' ');

    let statusMsg = '';
    if (state.isComplete()) {
      const majorities = state.getMajorityCounts();
      const criteria = config.goalCriteria;
      const passed = majorities.orange >= criteria.minOrangeMajority
        && majorities.green >= criteria.minGreenMajority;

      const summary = `Orange majority: ${majorities.orange} · Green majority: ${majorities.green}`;
      if (passed) {
        statusMsg = `<br><span class="result-summary">${summary}</span>`
          + `<br><strong class="result-pass">Goal achieved!</strong>`;
        if (config.successMessage) {
          showPopup(config.successMessage, config.successTitle);
        }
      } else {
        statusMsg = `<br><span class="result-summary">${summary}</span>`
          + `<br><strong class="result-fail">Goal not met — try again!</strong>`;
      }
    }

    feedbackEl.innerHTML = feedbackLines + statusMsg;
  }

  // Init
  updatePickerHighlight();
  updateVisuals();

  return {
    destroy() {
      card.remove();
    },
  };
}

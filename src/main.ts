import './style.css';
import { SECTION1_LEVELS, SECTION2_LEVELS } from './levels';
import { createGrid } from './grid';
import { createSwiper } from './swiper';
import stfLogo from './assets/stf-logo.png';

const app = document.querySelector<HTMLDivElement>('#app')!;

// --- Banner ---
const banner = document.createElement('a');
banner.href = 'https://alforward.branch.vote';
banner.target = '_blank';
banner.rel = 'noopener noreferrer';
banner.className = 'top-banner';
banner.textContent = 'See what\u2019s on your ballot at alforward.branch.vote';
app.appendChild(banner);

// --- Logo ---
const logo = document.createElement('img');
logo.src = stfLogo;
logo.alt = 'STF Logo';
logo.className = 'stf-logo';
app.appendChild(logo);

// --- Section 1: Redistricting & Gerrymandering ---
const section1 = document.createElement('section');
section1.className = 'game-section';

const h1 = document.createElement('h1');
h1.textContent = 'Redistricting & Gerrymandering';
section1.appendChild(h1);

const instr1 = document.createElement('p');
instr1.className = 'instructions';
instr1.textContent = 'For each set, draw 5 districts of 5 dots to reach the stated goal.';
section1.appendChild(instr1);

const swiper1 = createSwiper(section1, SECTION1_LEVELS.length);
for (const level of SECTION1_LEVELS) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  createGrid(slide, level);
  swiper1.slidesContainer.appendChild(slide);
}

app.appendChild(section1);

// --- Section 2: Redistricting Alabama ---
const section2 = document.createElement('section');
section2.className = 'game-section';

const h2 = document.createElement('h1');
h2.textContent = 'Redistricting Alabama';
section2.appendChild(h2);

const instr2 = document.createElement('p');
instr2.className = 'instructions';
instr2.textContent = 'For each set, draw 7 districts of 16 dots to reach the stated goal.';
section2.appendChild(instr2);

const swiper2 = createSwiper(section2, SECTION2_LEVELS.length);
for (const level of SECTION2_LEVELS) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  createGrid(slide, level);
  swiper2.slidesContainer.appendChild(slide);
}

app.appendChild(section2);

// --- Footer ---
const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.textContent = 'Created by Shake the Field';
app.appendChild(footer);

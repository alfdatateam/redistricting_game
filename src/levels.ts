export interface DotConfig {
  row: number;
  col: number;
  color: 'orange' | 'green';
}

export interface GoalCriteria {
  minOrangeMajority: number;
  minGreenMajority: number;
  label: string; // short label for the result, e.g. "Maximize Orange"
}

export interface LevelConfig {
  id: string;
  dots: DotConfig[];
  numDistricts: number;
  dotsPerDistrict: number;
  goal: string;
  goalCriteria: GoalCriteria;
  dotRadius: number;
  cellSize: number;
}

// --- 5×5 Grid ---
// Columns 0–1 are orange, columns 2–4 are green (from Figma)

function make5x5Dots(): DotConfig[] {
  const dots: DotConfig[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push({ row, col, color: col < 2 ? 'orange' : 'green' });
    }
  }
  return dots;
}

const GRID_5X5_DOTS = make5x5Dots();

// --- Alabama Grid ---
// Dot positions and colors extracted from Figma metadata.
// x positions map to columns: 83→0, 130→1, 177→2, 224→3, 271→4, 318→5, 365→6, 412→7, 459→8
// y positions map to rows (spacing 46px starting at y=1219):
//   1219→0, 1265→1, 1311→2, 1357→3, 1403→4, 1449→5, 1495→6, 1541→7, 1587→8,
//   1633→9, 1679→10, 1725→11, 1771→12, 1817→13

const X_TO_COL: Record<number, number> = {
  83: 0, 130: 1, 177: 2, 224: 3, 271: 4, 318: 5, 365: 6, 412: 7, 459: 8,
};
const Y_TO_ROW: Record<number, number> = {
  1219: 0, 1265: 1, 1311: 2, 1357: 3, 1403: 4, 1449: 5,
  1495: 6, 1541: 7, 1587: 8, 1633: 9, 1679: 10, 1725: 11, 1771: 12, 1817: 13,
};

// Raw Figma data: [x, y, isOrange]
const AL_RAW: [number, number, boolean][] = [
  // Row 0 (y=1219) — 8 dots, all green
  [130,1219,false],[177,1219,false],[224,1219,false],[271,1219,false],
  [318,1219,false],[365,1219,false],[412,1219,false],[459,1219,false],
  // Row 1 (y=1265) — 8 dots, orange at x=318,365
  [130,1265,false],[177,1265,false],[224,1265,false],[271,1265,false],
  [318,1265,true],[365,1265,true],[412,1265,false],[459,1265,false],
  // Row 2 (y=1311) — 8 dots, orange at x=318,365
  [130,1311,false],[177,1311,false],[224,1311,false],[271,1311,false],
  [318,1311,true],[365,1311,true],[412,1311,false],[459,1311,false],
  // Row 3 (y=1357) — 8 dots, all green
  [130,1357,false],[177,1357,false],[224,1357,false],[271,1357,false],
  [318,1357,false],[365,1357,false],[412,1357,false],[459,1357,false],
  // Row 4 (y=1403) — 8 dots, orange at x=318,365
  [130,1403,false],[177,1403,false],[224,1403,false],[271,1403,false],
  [318,1403,true],[365,1403,true],[412,1403,false],[459,1403,false],
  // Row 5 (y=1449) — 8 dots, orange at x=177,224,271,318,365
  [130,1449,false],[177,1449,true],[224,1449,true],[271,1449,true],
  [318,1449,true],[365,1449,true],[412,1449,false],[459,1449,false],
  // Row 6 (y=1495) — 8 dots, all green
  [130,1495,false],[177,1495,false],[224,1495,false],[271,1495,false],
  [318,1495,false],[365,1495,false],[412,1495,false],[459,1495,false],
  // Row 7 (y=1541) — 8 dots, orange at x=318
  [130,1541,false],[177,1541,false],[224,1541,false],[271,1541,false],
  [318,1541,true],[365,1541,false],[412,1541,false],[459,1541,false],
  // Row 8 (y=1587) — 8 dots, orange at x=271,318,365
  [130,1587,false],[177,1587,false],[224,1587,false],[271,1587,true],
  [318,1587,true],[365,1587,true],[412,1587,false],[459,1587,false],
  // Row 9 (y=1633) — 9 dots, all green
  [83,1633,false],[130,1633,false],[177,1633,false],[224,1633,false],[271,1633,false],
  [318,1633,false],[365,1633,false],[412,1633,false],[459,1633,false],
  // Row 10 (y=1679) — 9 dots, orange at x=177,224,271,318,365
  [83,1679,false],[130,1679,false],[177,1679,true],[224,1679,true],[271,1679,true],
  [318,1679,true],[365,1679,true],[412,1679,false],[459,1679,false],
  // Row 11 (y=1725) — 9 dots, orange at x=224,271,318,365,412
  [83,1725,false],[130,1725,false],[177,1725,false],[224,1725,true],[271,1725,true],
  [318,1725,true],[365,1725,true],[412,1725,true],[459,1725,false],
  // Row 12 (y=1771) — 9 dots, orange at x=130
  [83,1771,false],[130,1771,true],[177,1771,false],[224,1771,false],[271,1771,false],
  [318,1771,false],[365,1771,false],[412,1771,false],[459,1771,false],
  // Row 13 (y=1817) — 4 dots, orange at x=83,130
  [83,1817,true],[130,1817,true],[224,1817,false],[271,1817,false],
];

function makeAlabamaDots(): DotConfig[] {
  return AL_RAW.map(([x, y, isOrange]) => ({
    row: Y_TO_ROW[y],
    col: X_TO_COL[x],
    color: isOrange ? 'orange' as const : 'green' as const,
  }));
}

const ALABAMA_DOTS = makeAlabamaDots();

// --- Level Configs ---

// 5×5 grid: 10 orange, 15 green (40%/60%)
// Majority in a 5-dot district = 3+ of one color
// Max orange majorities: 3 (using 9 of 10 orange dots, 3 per district)
// Max green majorities: 5 (15 green dots, 3 per district covers all 5)
// Fair: proportional to 40/60 split → 2 orange, 3 green

export const SECTION1_LEVELS: LevelConfig[] = [
  {
    id: 'gerry-1',
    dots: GRID_5X5_DOTS,
    numDistricts: 5,
    dotsPerDistrict: 5,
    goal: 'Goal: Maximize number of\nOrange Majority Districts',
    goalCriteria: { minOrangeMajority: 3, minGreenMajority: 0, label: 'Maximize Orange' },
    dotRadius: 18,
    cellSize: 60,
  },
  {
    id: 'gerry-2',
    dots: GRID_5X5_DOTS,
    numDistricts: 5,
    dotsPerDistrict: 5,
    goal: 'Goal: Maximize Number of\nGreen Majority Districts',
    goalCriteria: { minOrangeMajority: 0, minGreenMajority: 5, label: 'Maximize Green' },
    dotRadius: 18,
    cellSize: 60,
  },
  {
    id: 'gerry-3',
    dots: GRID_5X5_DOTS,
    numDistricts: 5,
    dotsPerDistrict: 5,
    goal: 'Goal: Fair Representation',
    goalCriteria: { minOrangeMajority: 2, minGreenMajority: 3, label: 'Fair' },
    dotRadius: 18,
    cellSize: 60,
  },
];

// Alabama grid: 28 orange, 84 green (25%/75%)
// Majority in a 16-dot district = 9+ of one color
// Max green majorities: 7 (84 green / 9 per majority = all 7 possible)
// Six green + one orange: explicit target
// Fair: proportional to 25/75 split → 2 orange, 5 green

export const SECTION2_LEVELS: LevelConfig[] = [
  {
    id: 'alabama-1',
    dots: ALABAMA_DOTS,
    numDistricts: 7,
    dotsPerDistrict: 16,
    goal: 'Goal: Maximize number of\nGreen Majority Districts',
    goalCriteria: { minOrangeMajority: 0, minGreenMajority: 7, label: 'Maximize Green' },
    dotRadius: 12,
    cellSize: 36,
  },
  {
    id: 'alabama-2',
    dots: ALABAMA_DOTS,
    numDistricts: 7,
    dotsPerDistrict: 16,
    goal: 'Goal: Six Majority Green Districts\nand One Majority Orange',
    goalCriteria: { minOrangeMajority: 1, minGreenMajority: 6, label: 'Six Green + One Orange' },
    dotRadius: 12,
    cellSize: 36,
  },
  {
    id: 'alabama-3',
    dots: ALABAMA_DOTS,
    numDistricts: 7,
    dotsPerDistrict: 16,
    goal: 'Goal: Fair Representation',
    goalCriteria: { minOrangeMajority: 2, minGreenMajority: 5, label: 'Fair' },
    dotRadius: 12,
    cellSize: 36,
  },
];

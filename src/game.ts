import type { LevelConfig } from './levels';

export interface Dot {
  index: number;
  row: number;
  col: number;
  color: 'orange' | 'green';
  districtId: number | null;
}

export class GameState {
  dots: Dot[];
  activeDistrict: number;
  readonly numDistricts: number;
  readonly dotsPerDistrict: number;

  constructor(config: LevelConfig) {
    this.numDistricts = config.numDistricts;
    this.dotsPerDistrict = config.dotsPerDistrict;
    this.activeDistrict = 0;
    this.dots = config.dots.map((d, i) => ({
      index: i,
      row: d.row,
      col: d.col,
      color: d.color,
      districtId: null,
    }));
  }

  assignDot(index: number): boolean {
    const dot = this.dots[index];
    // Toggle off if already in active district
    if (dot.districtId === this.activeDistrict) {
      dot.districtId = null;
      return true;
    }
    // Don't exceed district size
    const currentCount = this.dots.filter(d => d.districtId === this.activeDistrict).length;
    if (currentCount >= this.dotsPerDistrict) return false;

    dot.districtId = this.activeDistrict;
    return true;
  }

  getDistrictDots(districtId: number): Dot[] {
    return this.dots.filter(d => d.districtId === districtId);
  }

  getCounts(): number[] {
    const counts = new Array(this.numDistricts).fill(0);
    for (const d of this.dots) {
      if (d.districtId !== null) counts[d.districtId]++;
    }
    return counts;
  }

  isComplete(): boolean {
    return this.getCounts().every(c => c === this.dotsPerDistrict);
  }

  /** For a completed district, returns which color has majority (or 'tie'). */
  getDistrictMajority(districtId: number): 'orange' | 'green' | 'tie' | null {
    const dDots = this.getDistrictDots(districtId);
    if (dDots.length !== this.dotsPerDistrict) return null; // not full yet
    const orange = dDots.filter(d => d.color === 'orange').length;
    const green = dDots.length - orange;
    if (orange > green) return 'orange';
    if (green > orange) return 'green';
    return 'tie';
  }

  /** Returns { orange, green, tie } counts across all completed districts. */
  getMajorityCounts(): { orange: number; green: number; tie: number } {
    let orange = 0, green = 0, tie = 0;
    for (let d = 0; d < this.numDistricts; d++) {
      const m = this.getDistrictMajority(d);
      if (m === 'orange') orange++;
      else if (m === 'green') green++;
      else if (m === 'tie') tie++;
    }
    return { orange, green, tie };
  }

  reset(): void {
    for (const dot of this.dots) {
      dot.districtId = null;
    }
    this.activeDistrict = 0;
  }
}

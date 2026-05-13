// Traces the outer edges of a group of grid cells and returns an SVG path.
// Works for both rectangular and irregular shapes — only checks neighbor
// existence in the provided cell set.

export interface CellPosition {
  row: number;
  col: number;
}

export function computeBoundary(
  cells: CellPosition[],
  cellSize: number,
  offsetX: number,
  offsetY: number,
): string {
  if (cells.length === 0) return '';

  const cellSet = new Set(cells.map(d => `${d.row},${d.col}`));

  interface Segment { x1: number; y1: number; x2: number; y2: number }
  const segments: Segment[] = [];

  for (const cell of cells) {
    const { row, col } = cell;
    // Top edge
    if (!cellSet.has(`${row - 1},${col}`)) {
      segments.push({ x1: col, y1: row, x2: col + 1, y2: row });
    }
    // Bottom edge
    if (!cellSet.has(`${row + 1},${col}`)) {
      segments.push({ x1: col + 1, y1: row + 1, x2: col, y2: row + 1 });
    }
    // Left edge
    if (!cellSet.has(`${row},${col - 1}`)) {
      segments.push({ x1: col, y1: row + 1, x2: col, y2: row });
    }
    // Right edge
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
      const sx = offsetX + p.x * cellSize;
      const sy = offsetY + p.y * cellSize;
      return `${sx},${sy}`;
    });

    paths.push(`M${points.join('L')}Z`);
  }

  return paths.join(' ');
}

// Types for the Sabaki packages the Go tests use as second implementations (dev only).
declare module '@sabaki/sgf' {
  export interface SgfNode {
    id: number;
    data: Record<string, string[]>;
    parentId: number | null;
    children: SgfNode[];
  }
  const sgf: { parse(contents: string): SgfNode[] };
  export default sgf;
}

declare module '@sabaki/deadstones' {
  type Sign = -1 | 0 | 1;
  const deadstones: {
    guess(data: Sign[][], options?: { finished?: boolean; iterations?: number }): Promise<[number, number][]>;
    getProbabilityMap(data: Sign[][], iterations: number): Promise<number[][]>;
  };
  export default deadstones;
}

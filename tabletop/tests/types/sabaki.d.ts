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

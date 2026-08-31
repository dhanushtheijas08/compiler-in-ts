import { file } from "bun";

type Token = {
  token: string;
  col: number;
  line: number;
};

export class Lexer {
  private line: number;
  private col: number;
  private indexPointer: number;
  private source: string | null;
  private tokens: Token[];
  private start: number;
  private curr: number;

  constructor() {
    this.line = 1;
    this.col = 1;
    this.indexPointer = 0;
    this.source = null;
    this.tokens = [];
    this.start = 0;
    this.curr = 0;
  }
  private peek() {
    if (!this.source) throw new Error("source file not found");

    const ch = this.source[this.curr];
    return ch;
  }
  private advance() {
    if (!this.source) throw new Error("source file not found");

    const char = this.source[this.curr];
    this.curr++;
    return char;
  }
  async tokenize(filePath: string) {
    if (!filePath) throw new Error("source path not found");

    this.source = await file(filePath).text();

    while (this.indexPointer < this.source.length) {
      console.log(this.source[this.indexPointer]);
      this.indexPointer++;
    }
  }
}

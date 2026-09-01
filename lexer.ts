import { file } from "bun";
import { token, type TokenType as TokenKind } from "./token";
type Token = {
  type: TokenKind;
  line: number;
  column: number;
};
export class Lexer {
  private source: string = "";
  private tokens: Token[] = [];

  private start: number = 0;
  private current: number = 0;

  private line: number = 1;
  private col: number = 1;

  private peek() {
    if (this.current >= this.source.length) {
      return "\0";
    }

    return this.source[this.current];
  }
  private advance() {
    if (!this.source) throw new Error("source file not found");

    const char = this.source[this.current];
    this.current++;
    this.col++;
    return char;
  }
  private pushToken(type: TokenKind, line: number, column: number) {
    this.tokens.push({
      type,
      line,
      column,
    });
  }
  async tokenize(filePath: string) {
    if (!filePath) throw new Error("source path not found");

    this.source = await file(filePath).text();

    while (this.current < this.source.length) {
      this.start = this.current;
      switch (this.advance()) {
        case "\n":
          this.line++;
          this.col = 1;
          break;

        case " ":
        case "\t":
          break;

        case "+":
          this.pushToken(token.TOK_PLUS, this.line, this.col - 1);
          break;

        case "-":
          this.pushToken(token.TOK_MINUS, this.line, this.col - 1);
          break;

        case "*":
          this.pushToken(token.TOK_MULTIPLY, this.line, this.col - 1);
          break;

        case "/":
          this.pushToken(token.TOK_DIVIDE, this.line, this.col - 1);
          break;

        case "%":
          this.pushToken(token.TOK_MODULO, this.line, this.col - 1);
          break;

        case "=":
          this.pushToken(token.TOK_ASSIGN, this.line, this.col - 1);
          break;

        case "<":
          this.pushToken(token.TOK_LESS_THAN, this.line, this.col - 1);
          break;

        case ">":
          this.pushToken(token.TOK_GREATER_THAN, this.line, this.col - 1);
          break;

        case "(":
          this.pushToken(token.TOK_LEFT_PAREN, this.line, this.col - 1);
          break;

        case ")":
          this.pushToken(token.TOK_RIGHT_PAREN, this.line, this.col - 1);
          break;

        case "{":
          this.pushToken(token.TOK_LEFT_BRACE, this.line, this.col - 1);
          break;

        case "}":
          this.pushToken(token.TOK_RIGHT_BRACE, this.line, this.col - 1);
          break;

        default:
          break;
      }
    }

    return this.tokens;
  }
}

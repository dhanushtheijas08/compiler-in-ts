import { file } from "bun";
import { token, type TokenType as TokenKind } from "./token";
type Token = {
  type: TokenKind;
  lexeme: string;
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
  private lookup(n: number = 0) {
    const index = this.current + n;

    if (index >= this.source.length) {
      return "\0";
    }
    return this.source[this.current + n];
  }

  private match(char: string) {
    if (this.lookup(0) === char) {
      this.advance();
      return true;
    }

    return false;
  }

  private isDigit() {
    const char = this.source[this.current];
    return char && char >= "0" && char <= "9";
  }

  private isChar() {
    const char = this.source[this.current];
    return (
      char && ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z"))
    );
  }

  private pushToken(type: TokenKind) {
    this.tokens.push({
      type,
      lexeme: this.source.slice(this.start, this.current),
      line: this.line,
      column: this.col - 1,
    });
  }
  async tokenize(filePath: string) {
    if (!filePath) throw new Error("source path not found");

    this.source = await file(filePath).text();

    while (this.current < this.source.length) {
      this.start = this.current;
      const char = this.advance();
      switch (char) {
        case "\n":
          this.line++;
          this.col = 1;
          break;
        case " ":
        case "\t":
        case "\r":
          break;
        case "(":
          this.pushToken(token.TOK_LEFT_PAREN);
          break;
        case ")":
          this.pushToken(token.TOK_RIGHT_PAREN);
          break;
        case "{":
          this.pushToken(token.TOK_LEFT_BRACE);
          break;
        case "}":
          this.pushToken(token.TOK_RIGHT_BRACE);
          break;
        case "+":
          this.pushToken(token.TOK_PLUS);
          break;
        case "-":
          this.pushToken(token.TOK_MINUS);
          break;
        case "*":
          this.pushToken(token.TOK_MULTIPLY);
          break;
        case "/":
          if (this.match("/")) {
            while (this.peek() !== "\n" && this.peek() !== "\0") this.advance();
          } else this.pushToken(token.TOK_DIVIDE);
          break;
        case "%":
          this.pushToken(token.TOK_MODULO);
          break;
        case "=":
          if (this.match("=")) this.pushToken(token.TOK_EQUAL);
          else this.pushToken(token.TOK_ASSIGN);
          break;
        case "<":
          if (this.match("=")) this.pushToken(token.TOK_LESS_EQUAL);
          else this.pushToken(token.TOK_LESS_THAN);
          break;
        case ">":
          if (this.match("=")) this.pushToken(token.TOK_GREATER_EQUAL);
          else this.pushToken(token.TOK_GREATER_THAN);
          break;
        case "!":
          if (this.match("=")) this.pushToken(token.TOK_NOT_EQUAL);
          else this.pushToken(token.TOK_NOT);
          break;
        case "&":
          if (this.match("&")) this.pushToken(token.TOK_AND);
          else
            throw new Error(`Unexpected '&' at ${this.line}:${this.col - 1}`);
          break;
        case "|":
          if (this.match("|")) this.pushToken(token.TOK_OR);
          else
            throw new Error(`Unexpected '|' at ${this.line}:${this.col - 1}`);
          break;
        default:
          if (this.isDigit()) {
            while (this.isDigit()) {
              this.advance();
            }
            if (this.peek() === ".") {
              this.advance();

              while (this.isDigit()) {
                this.advance();
              }
            }
            this.pushToken(token.TOK_NUM);
          } else if (char === "'" || char == '"') {
            while (this.peek() !== char && this.peek() !== "\0") {
              this.advance();
            }
            if (this.peek() === "\0") {
              throw new Error(
                `Unterminated string at ${this.line}:${this.col}`,
              );
            }
            this.advance();
            this.pushToken(token.TOK_STRING);
          }
          break;
      }
    }

    return this.tokens;
  }
}

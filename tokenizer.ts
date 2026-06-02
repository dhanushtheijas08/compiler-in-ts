const file = Bun.file("./sample.sa");
const fileContent = await file.text();

import { Token } from "./model";
const reservedWords: Record<string, string> = {
  let: "LET",
  if: "IF",
  else: "ELSE",
  while: "WHILE",
  func: "FUNC",
  return: "RETURN",
  log: "LOG",
};
const singleLtKeywords: Record<string, string> = {
  "+": "PLUS",
  "*": "TIMES",
  "<": "LT",
  "=": "ASSIGN",
  ";": "SEMI",
  "(": "LPAREN",
  ")": "RPAREN",
  "{": "LBRACE",
  "}": "RBRACE",
  ",": "COMMA",
};
const doubleLtKeywords: Record<string, string> = { "==": "EQ" };

const isWhiteSpace = (s: string) =>
  s === "\n" || s === "\t" || s === "\r" || s === " ";
const isLower = (c: string) => c >= "a" && c <= "z";
const isUpper = (c: string) => c >= "A" && c <= "Z";
const isLetter = (c: string) => isLower(c) || isUpper(c) || c === "_";
const isDigit = (n: string) => {
  const val = n.trim();
  if (!val.length) return false;
  return !Number.isNaN(Number(val));
};
const isAlphaNum = (c: string) => isLetter(c) || isDigit(c);

// Number(10) => true
// Number(10as) => NaN

// token possibility
// 1. keyword
// 2. string
// 3. number

export const tokenize = (prg: string) => {
  const prgArr = prg.split("");

  let tokenPosition = 0;
  let reservedWordsArr: Token[] = [];

  const top = (offset: number = 0) => {
    if (offset + tokenPosition < prgArr.length)
      return prgArr[offset + tokenPosition];
    return "\0";
  };

  while (tokenPosition < prgArr.length) {
    const topVal = top();
    if (!topVal) break;

    if (topVal === "\0") {
      break;
    }

    // whitesapce
    if (isWhiteSpace(topVal)) {
      tokenPosition++;
      continue;
    }

    // single line cmt
    if (topVal === "/" && top(1) === "/") {
      // till the eof (\n)
      while (top(1) !== "\0" && top(1) !== "\n") {
        tokenPosition++;
      }
      continue;
    }

    // multi line cmt
    /**/
    // /* sample */
    if (topVal === "/" && top(1) === "*") {
      tokenPosition++;
      while (top(1) !== "\0" && !(top(1) === "*" && top(2) === "/")) {
        tokenPosition++;
      }
      if (top(1) === "*" && top(2) === "/") tokenPosition += 3;

      continue;
    }

    // digit
    // 103
    if (isDigit(topVal)) {
      let tempVal = topVal;

      // 123
      while (top(1) !== "\0" && isDigit(top(1)!)) {
        tokenPosition++;
        tempVal += top();
      }
      tokenPosition++;
      reservedWordsArr.push(new Token("NUMBER", tempVal));
      continue;
    }
    // string
    if (topVal === `"` || topVal === `'`) {
      let tempVal = topVal;
      tokenPosition++;

      while (top(1) !== "\0" && top(1) !== topVal) {
        tokenPosition++;
        tempVal += top();
      }
      if (top(1) !== topVal) tokenPosition++;
      reservedWordsArr.push(new Token("STRING", tempVal));
      continue;
    }

    // keyword
    if (isAlphaNum(topVal)) {
      let tempVal = topVal;
      while (top(1) !== "\0" && isAlphaNum(top(1)!)) {
        tokenPosition++;
        tempVal += top();
      }
      if (reservedWords[tempVal]) {
        reservedWordsArr.push(new Token(reservedWords[tempVal]!, tempVal));
      } else {
        reservedWordsArr.push(new Token("IDENT", tempVal));
      }
      tokenPosition++;
      continue;
    }

    // ==
    const combineVal = `${topVal + top(1)}`;
    if (doubleLtKeywords[combineVal]) {
      tokenPosition++;
      tokenPosition++;
      reservedWordsArr.push(
        new Token(doubleLtKeywords[combineVal], combineVal),
      );
      continue;
    }

    if (singleLtKeywords[topVal]) {
      reservedWordsArr.push(new Token(singleLtKeywords[topVal], topVal));
      tokenPosition++;
      continue;
    }
  }

  return reservedWordsArr;
};

console.log(tokenize(fileContent));

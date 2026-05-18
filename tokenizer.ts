import { Token } from "./model";
const reservedWords: Record<string, string> = {
  let: "LET",
  if: "IF",
  else: "ELSE",
  while: "WHILE",
  func: "FUNC",
  return: "RETURN",
  log: "LOG",
  "+": "PLUS",
  "*": "TIMES",
  "<": "LT",
  "==": "EQ",
  "=": "ASSIGN",
  ";": "SEMI",
  "(": "LPAREN",
  ")": "RPAREN",
  "{": "LBRACE",
  "}": "RBRACE",
  ",": "COMMA",
};
const isNumeric = (n: string) => {
  return !Number.isNaN(Number(n));
};
// Number(10) => true
// Number(10as) => NaN

export const tokenize = (prg: string) => {
  const prgArr = prg.split("");
  let temp: string = "";
  let reservedWordsArr: Token[] = [];

  for (let i = 0; i < prgArr.length; i++) {
    if (prgArr[i] === " " || prgArr[i] === "") {
      continue;
    }
    if (reservedWords[prgArr[i]]) {
      console.log({ v: prgArr[i], i });

      if (prgArr[i] == "=" && prgArr[i + 1] == "=") {
        reservedWordsArr.push(new Token("EQ", "=="));
        temp = "";
        continue;
      }

      if (isNumeric(temp)) {
        reservedWordsArr.push(new Token("NUMBER", temp));
      } else if (reservedWords[temp]) {
        reservedWordsArr.push(new Token(reservedWords[prgArr[i]], prgArr[i]));
      } else {
        reservedWordsArr.push(new Token("NAME", temp));
      }
      temp = "";
    } else {
      temp += prgArr[i].trim();
      if (reservedWords[temp]) {
        reservedWordsArr.push(new Token(reservedWords[temp], temp));
        temp = "";
      }
    }
  }
  if (temp.length) {
    if (isNumeric(temp)) {
      reservedWordsArr.push(new Token("NUMBER", temp));
    } else if (reservedWords[temp]) {
      reservedWordsArr.push(new Token(reservedWords[temp], temp));
    } else {
      reservedWordsArr.push(new Token("NAME", temp));
    }
  }

  return reservedWordsArr;
};

// // This script displays "Hello world!" in the console
// console.log("Hello world!");

// // Variable declaration and simple arithmetic
// let name = "Alex"; // A string variable
// let age = 25;      // A number variable
// let sum = 5 + 3;   // Using operators

// console.log(name + " is " + age + " years old.");

console.log(tokenize(`let x = 10;`));

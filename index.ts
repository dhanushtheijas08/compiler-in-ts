import { Lexer } from "./lexer";

const lexer = new Lexer();
const tokens = await lexer.tokenize("./test.sa");
console.log(tokens);

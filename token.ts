// Single Character token

// + * - / % = > < ( ) { }
export const token = {
  TOK_ASSIGN: "TOKEN_ASSIGN",

  TOK_PLUS: "TOKEN_PLUS",
  TOK_MINUS: "TOKEN_MINUS",
  TOK_MULTIPLY: "TOKEN_MULTIPLY",
  TOK_DIVIDE: "TOKEN_DIVIDE",
  TOK_MODULO: "TOKEN_MODULO",

  TOK_LESS_THAN: "TOKEN_LESS_THAN",
  TOK_GREATER_THAN: "TOKEN_GREATER_THAN",

  TOK_LEFT_PAREN: "TOKEN_LEFT_PAREN",
  TOK_RIGHT_PAREN: "TOKEN_RIGHT_PAREN",

  TOK_LEFT_BRACE: "TOKEN_LEFT_BRACE",
  TOK_RIGHT_BRACE: "TOKEN_RIGHT_BRACE",
  TOK_SEMICOLON: "TOKEN_SEMICOLON",
  TOK_NOT: "TOKEN_NOT",

  TOK_EQUAL: "TOKEN_EQUAL",
  TOK_NOT_EQUAL: "TOKEN_NOT_EQUAL",
  TOK_LESS_EQUAL: "TOKEN_LESS_EQUAL",
  TOK_GREATER_EQUAL: "TOKEN_GREATER_EQUAL",

  TOK_AND: "TOKEN_AND",
  TOK_OR: "TOKEN_OR",
  TOK_NUM: "TOKEN_NUMBER",
  TOK_STRING: "TOKEN_STRING",
  TOK_IDENTIFIER: "TOKEN_IDENTIFIERS",
} as const;
export type TokenType = (typeof token)[keyof typeof token];

export const keywords = {
  if: "TOKEN_IF",
  else: "TOKEN_ELSE",
  for: "TOKEN_FOR",
  while: "TOKEN_WHILE",
  break: "TOKEN_BREAK",
  continue: "TOKEN_CONTINUE",
  return: "TOKEN_RETURN",
  func: "TOKEN_FUNCTION",
  print: "TOKEN_PRINT",

  true: "TOKEN_TRUE",
  false: "TOKEN_FALSE",
  null: "TOKEN_NULL",

  var: "TOKEN_VAR",
};
export type KeywordTypes = (typeof keywords)[keyof typeof keywords];

export const binaryOperators = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "==",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "&&",
  "||",
];
export type BinaryOperator = (typeof binaryOperators)[number];

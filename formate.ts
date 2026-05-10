import {
  Add,
  Assign,
  Eq,
  Expression,
  Function,
  FunctionCall,
  Gt,
  If,
  Integer,
  Lt,
  Mul,
  Print,
  Program,
  Statement,
  VarDec,
  Variable,
  While,
} from "./model.ts";
// let x = 10 + x
// x = 10 + x
// Just send "x" => Name("x")
// let
const statements = new Program([
  // new Function(
  //   "add1",
  //   [new Variable("x")],
  //   [new Assign("x", new Add(new Variable("x"), new Integer(1)))],
  //   new Variable("x"),
  // ),
  // new VaraiableDec("x", new Integer(10)),
  // new Print(
  //   new Add(
  //     new Mul(new Integer(23), new Integer(45)),
  //     new FunctionCall("add1", [new Variable("x")]),
  //   ),
  // ),
  // new Print(new Variable("x")),
  new Assign(new Variable("x"), new Add(new Integer(10), new Variable("x"))),
]);

const formateProgram = (program: Program) => {
  return formateStatements(program.statement);
};

const formateStatements = (statements: Statement[]) => {
  let code = "";
  for (let i = 0; i < statements.length; i++) {
    const tempCode = formateStatement(statements[i]);
    code += `${tempCode}\n`;
  }
  return code;
};

const formateStatement = (statement: Statement) => {
  if (statement instanceof Print) {
    return `log ${formateExpression(statement.printVal)}`;
  } else if (statement instanceof Assign) {
    return `${formateExpression(statement.variable)} = ${formateExpression(statement.val)}`;
  } else if (statement instanceof VarDec) {
    if (statement.initializer)
      return `let ${statement.name} = ${formateExpression(statement.initializer)}`;
    return `let ${statement.name}`;
  } else if (statement instanceof If) {
    return `if ${formateExpression(statement.ifcondition)} {
      ${formateStatements(statement.ifBlock)}
    } else {
      ${formateStatements(statement.elseBlock)}
     }`;
  } else if (statement instanceof While) {
    return `while ${formateExpression(statement.conditions)} {
      ${formateStatements(statement.whileBlock)}
    }`;
  } else if (statement instanceof Function) {
    return `func ${statement.fnName} (${formateExpressions(statement.fnArgs)}) {
      ${formateStatements(statement.fnBlock)}
    }`;
  }
};

const formateExpressions = (expressions: Expression[]) => {
  let code = "";
  for (let i = 0; i < expressions.length; i++) {
    const tempCode = formateExpression(expressions[i]);
    if (i < expressions.length - 1) code += `${tempCode}, `;
    else code += `${tempCode}`;
  }
  return code;
};
const formateExpression = (expression: Expression) => {
  if (expression instanceof Integer) {
    return String(expression.val);
  } else if (expression instanceof Add) {
    return `(${formateExpression(expression.left)} + ${formateExpression(expression.right)})`;
  } else if (expression instanceof Mul) {
    return `(${formateExpression(expression.left)} * ${formateExpression(expression.right)})`;
  } else if (expression instanceof Variable) {
    return `${expression.name}`;
  } else if (expression instanceof FunctionCall) {
    return `${expression.fnName} (${formateExpressions(expression.fnArgs)})`;
  } else if (expression instanceof Gt) {
    return `${formateExpression(expression.val1)} > ${formateExpression(expression.val2)}`;
  } else if (expression instanceof Lt) {
    return `${formateExpression(expression.val1)} < ${formateExpression(expression.val2)}`;
  } else if (expression instanceof Eq) {
    return `${formateExpression(expression.val1)} == ${formateExpression(expression.val2)}`;
  }
};
console.log(formateProgram(statements));

import {
  Add,
  Assign,
  Expression,
  Integer,
  Mul,
  Print,
  Program,
  Statement,
  VarDec,
  If,
  Gt,
  Lt,
  Eq,
  While,
  Function,
  FunctionCall,
} from "./model.ts";

const statement = new Program([
  new Print(new Add(new Add(new Integer(10), new Integer(10)), new Integer(5))),
]);
export const foldConstants = (program: Program) => {
  return new Program(foldStatements(program.statement));
};

const foldStatements = (statements: Statement[]) => {
  const statementArr: Statement[] = [];
  for (let i = 0; i < statements.length; i++) {
    const tempStatement = foldStatement(statements[i]);
    statementArr.push(tempStatement);
  }
  return statementArr;
};

const foldStatement = (s: Statement): Statement => {
  if (s instanceof Print) {
    if (s.printVal instanceof Add || s.printVal instanceof Mul) {
      return new Print(foldExpression(s.printVal));
    } else return s;
  } else if (s instanceof Assign) {
    return new Assign(foldExpression(s.variable), foldExpression(s.val));
  } else if (s instanceof VarDec) {
    if (s.initializer) {
      return new VarDec(s.name, foldExpression(s.initializer));
    }
    return new VarDec(s.name);
  } else if (s instanceof If) {
    const condition = foldExpression(s.ifcondition);
    const ifBlock = foldStatements(s.ifBlock);
    const elseBlock = foldStatements(s.elseBlock);
    return new If(condition, ifBlock, elseBlock);
  } else if (s instanceof While) {
    const condition = foldExpression(s.conditions);
    const whileBlock = foldStatements(s.whileBlock);
    return new While(condition, whileBlock);
  } else if (s instanceof Function) {
    const fnArgs = foldExpressions(s.fnArgs);
    const fnBlock = foldStatements(s.fnBlock);
    const fnReturn = foldExpression(s.fnReturn);
    return new Function(s.fnName, fnArgs, fnBlock, fnReturn);
  }

  return s;
};

const foldExpressions = (expressions: Expression[]) => {
  const expressionsArr: Expression[] = [];
  for (let i = 0; i < expressions.length; i++) {
    const tempStatement = foldExpression(expressions[i]);
    expressionsArr.push(tempStatement);
  }
  return expressionsArr;
};

const foldExpression = (e: Expression): Expression => {
  if (e instanceof Add) {
    let left = foldExpression(e.left);
    let right = foldExpression(e.right);

    if (left instanceof Integer && right instanceof Integer) {
      return new Integer(Number(left.val) + Number(right.val));
    }

    return new Add(left, right);
  } else if (e instanceof Mul) {
    let left = foldExpression(e.left);
    let right = foldExpression(e.right);

    if (left instanceof Integer && right instanceof Integer) {
      return new Integer(Number(left.val) * Number(right.val));
    }
    return new Mul(left, right);
  } else if (e instanceof FunctionCall) {
    const args = foldExpressions(e.fnArgs);
    return new FunctionCall(e.fnName, args);
  } else if (e instanceof Gt) {
    let val1 = foldExpression(e.val1);
    let val2 = foldExpression(e.val2);

    return new Gt(val1, val2);
  } else if (e instanceof Lt) {
    let val1 = foldExpression(e.val1);
    let val2 = foldExpression(e.val2);

    return new Lt(val1, val2);
  } else if (e instanceof Eq) {
    let val1 = foldExpression(e.val1);
    let val2 = foldExpression(e.val2);

    return new Eq(val1, val2);
  } else {
    return e;
  }
};
const val = foldConstants(statement);
console.log(val.statement);

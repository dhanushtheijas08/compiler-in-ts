import {
  Add,
  Assign,
  Eq,
  Expression,
  Function,
  FunctionCall,
  GlobalVarDec,
  GlobalVariable,
  Gt,
  If,
  Integer,
  LocalVarDec,
  LocalVariable,
  Lt,
  Mul,
  Print,
  Program,
  Statement,
  VarDec,
  Variable,
  While,
} from "./model";
// var x = 23;            // x is global (top-level)

// func f(y) {            // y is local (function parameter)
//     var r = x + y;     // r is local (declared inside a function)
//     return r;
// }

// if x > 10 {
//     var t = 2*x;       // t is local (inside a code block)
//     t = 1 + 1
//     print t;
// } else {
//     print f(x);
// }

/* 
 new Var(Int(23))
 new Func(Var("y"), VarDec("r", [Add(Var("x"), Var("y")))], Var("r"))

 If(Gt(Var("x"), Int(10)),
 [ VarDec("t", Mul(Int(2), Var("x"))), Assign(Var("t"), Add(Int(1), Int(1)))], 
  Print(FunCall(Var("x"))))
 */
// check the depth by checking if it inside any block (if, while, functions)
// check if the value already exist in the map
// replace all the Variable -> LocalVariable | GolbalVariable
// replace all VarDec -> LocalVarDec | GlobalVarDec

// [{r}, {d, f}]
const varScope: object[] = [{}];
const removeScope = () => {
  varScope.pop();
};
const addScope = () => {
  varScope.push({});
};
// if i == 1 then outermost (global) scope; larger i == nested; -1 == not declared
const findVar = (name: string) => {
  for (let i = varScope.length - 1; i >= 0; i--) {
    const scope = varScope[i] as Record<string, unknown>;
    if (scope[name]) {
      return i + 1;
    }
  }
  return -1;
};
const pushVar = (name: string) => {
  const top = varScope.length - 1;
  varScope[top] = {
    ...(varScope[top] as Record<string, unknown>),
    [name]: true,
  };
};
// Sample AST for: var x = 23; func f(y) { var r = x + y; return r; }
//   if x > 10 { var t = 2*x; t = 1 + 1; print t; } else { print f(x); }
const val = new Program([
  new VarDec("x", new Integer(23)),
  new Function(
    "f",
    [new Variable("y")],
    [new VarDec("r", new Add(new Variable("x"), new Variable("y")))],
    new Variable("r"),
  ),
  new If(
    new Gt(new Variable("x"), new Integer(10)),
    [
      new VarDec("t", new Mul(new Integer(2), new Variable("x"))),
      new Assign(new Variable("t"), new Add(new Integer(1), new Integer(1))),
      new Print(new Variable("t")),
    ],
    [new Print(new FunctionCall("f", [new Variable("x")]))],
  ),
]);

export const resolveProgram = (prg: Program) => {
  return new Program(resolveStatements(prg.statement));
};
export const resolveStatements = (st: Statement[]) => {
  const statementArr: Statement[] = [];
  for (let i = 0; i < st.length; i++) {
    const tempState = resolveStatement(st[i]);
    statementArr.push(tempState);
  }
  return statementArr;
};
export const resolveStatement = (s: Statement) => {
  if (s instanceof Assign) {
    const variable = resolveExpression(s.variable);
    const val = resolveExpression(s.val);
    return new Assign(variable, val);
  } else if (s instanceof VarDec) {
    const varScopeNumber = findVar(s.name);
    if (varScopeNumber === 1) {
      if (s.initializer) {
        return new GlobalVarDec(s.name, resolveExpression(s.initializer));
      }
      return new GlobalVarDec(s.name);
    } else if (varScopeNumber === -1) {
      pushVar(s.name);
      if (varScope.length === 1) {
        if (s.initializer) {
          return new GlobalVarDec(s.name, resolveExpression(s.initializer));
        }
        return new GlobalVarDec(s.name);
      }
      if (s.initializer) {
        return new LocalVarDec(s.name, resolveExpression(s.initializer));
      }
      return new LocalVarDec(s.name);
    }
    if (s.initializer) {
      return new LocalVarDec(s.name, resolveExpression(s.initializer));
    }
    return new LocalVarDec(s.name);
  } else if (s instanceof If) {
    const condition = resolveExpression(s.ifcondition);

    addScope();
    const ifBlock = resolveStatements(s.ifBlock);
    removeScope();

    addScope();
    const elseBlock = resolveStatements(s.elseBlock);
    removeScope();
    return new If(condition, ifBlock, elseBlock);
  } else if (s instanceof While) {
    addScope();
    const condition = resolveExpression(s.conditions);
    const whileBlock = resolveStatements(s.whileBlock);
    removeScope();
    return new While(condition, whileBlock);
  } else if (s instanceof Function) {
    addScope();
    for (const arg of s.fnArgs) {
      pushVar((arg as Variable).name);
    }
    const fnArgs = s.fnArgs.map(
      (arg) => new LocalVariable((arg as Variable).name),
    ) as Expression[];

    const fnName = s.fnName;
    const fnBlock = resolveStatements(s.fnBlock);
    const fnReturn = resolveExpression(s.fnReturn);

    removeScope();
    return new Function(fnName, fnArgs, fnBlock, fnReturn);
  } else if (s instanceof Print) {
    const val = resolveExpression(s.printVal);
    return new Print(val);
  }

  return s;
};
export const resolveExpression = (exp: Expression): Expression => {
  if (exp instanceof Variable) {
    if (findVar(exp.name) === 1) {
      return new GlobalVariable(exp.name);
    } else if (findVar(exp.name) === -1) {
      pushVar(exp.name);
      if (varScope.length === 1) {
        return new GlobalVariable(exp.name);
      } else {
        return new LocalVariable(exp.name);
      }
    } else {
      return new LocalVariable(exp.name);
    }
  } else if (exp instanceof Add) {
    const left = resolveExpression(exp.left);
    const right = resolveExpression(exp.right);
    return new Add(left, right);
  } else if (exp instanceof Mul) {
    const left = resolveExpression(exp.left);
    const right = resolveExpression(exp.right);
    return new Mul(left, right);
  } else if (exp instanceof Gt) {
    const val1 = resolveExpression(exp.val1);
    const val2 = resolveExpression(exp.val2);
    return new Gt(val1, val2);
  } else if (exp instanceof Lt) {
    const val1 = resolveExpression(exp.val1);
    const val2 = resolveExpression(exp.val2);
    return new Lt(val1, val2);
  } else if (exp instanceof Eq) {
    const val1 = resolveExpression(exp.val1);
    const val2 = resolveExpression(exp.val2);
    return new Eq(val1, val2);
  } else if (exp instanceof FunctionCall) {
    let fnArgs: Expression[] = [];
    for (let i = 0; i < exp.fnArgs.length; i++) {
      const tempVal = resolveExpression(exp.fnArgs[i]);
      fnArgs.push(tempVal);
    }
    return new FunctionCall(exp.fnName, fnArgs);
  }
  return exp;
};

console.log(resolveProgram(val));

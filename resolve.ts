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
// if i == 1 then global or local
// -1 then not declared
const findVar = (val: string) => {
  for (let i = varScope.length; i > 0; i--) {
    if (varScope[i][val]) {
      return i;
    }
  }
  return -1;
};
const pushVar = (val: string) => {
  varScope[varScope.length - 1] = { ...varScope[varScope.length - 1], val };
};
const depth = varScope.length;
const val = new Program([]);

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
      if (s.initializer)
        new GlobalVarDec(s.name, resolveExpression(s.initializer));
      else new GlobalVarDec(s.name);
    } else if (varScopeNumber === -1) {
      pushVar(s.name);
      if (depth === 1) {
        if (s.initializer)
          new GlobalVarDec(s.name, resolveExpression(s.initializer));
        else new GlobalVarDec(s.name);
      } else {
        if (s.initializer)
          new LocalVarDec(s.name, resolveExpression(s.initializer));
        else new LocalVarDec(s.name);
      }
    } else {
      if (s.initializer)
        new LocalVarDec(s.name, resolveExpression(s.initializer));
      else new LocalVarDec(s.name);
    }

    // new VarDec("x") | new VarDec("x", Add(Var("x"), Int(10)))
  } else if (s instanceof If) {
    addScope();
    const condition = resolveExpression(s.ifcondition);
    const ifBlock = resolveStatements(s.ifBlock);
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
      if (depth === 1) {
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

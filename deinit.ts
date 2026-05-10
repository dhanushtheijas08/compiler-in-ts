import {
  Assign,
  Function,
  If,
  Statement,
  VarDec,
  Variable,
  While,
} from "./model.ts";

// def deinit_statements(statements: list[Statement]) -> list[Statement]:
// let x = 10 + y -> [new VarDec("x", new Add(new Int(10), new Var("y")))]
// -> [new VarDec(x), new Assign(new Var(x), new Add(new Int(10), new Var("y")))]

export const splitInitializedVarDec = (v: VarDec): Statement[] => {
  const init = v.initializer;
  if (!init) return [v];
  return [new VarDec(v.name), new Assign(new Variable(v.name), init)];
};

export const deinitStatements = (statements: Statement[]) => {
  const statementArr: Statement[] = [];
  for (let i = 0; i < statements.length; i++) {
    statementArr.push(...deinitStatement(statements[i]));
  }
  return statementArr;
};

export const deinitStatement = (statement: Statement): Statement[] => {
  if (statement instanceof VarDec) {
    return splitInitializedVarDec(statement);
  }
  if (statement instanceof If) {
    return [
      new If(
        statement.ifcondition,
        deinitStatements(statement.ifBlock),
        deinitStatements(statement.elseBlock),
      ),
    ];
  }
  if (statement instanceof While) {
    return [
      new While(statement.conditions, deinitStatements(statement.whileBlock)),
    ];
  }
  if (statement instanceof Function) {
    return [
      new Function(
        statement.fnName,
        statement.fnArgs,
        deinitStatements(statement.fnBlock),
        statement.fnReturn,
      ),
    ];
  }

  return [statement];
};

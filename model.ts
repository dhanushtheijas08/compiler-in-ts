export abstract class Statement {}
export abstract class Expression {}
export class Token {
  tokenType: string;
  tokenVal: string;
  constructor(tokenType: string, tokenVal: string) {
    this.tokenType = tokenType;
    this.tokenVal = tokenVal;
  }
}

export class Program {
  statement: Statement[];
  constructor(statement: Statement[]) {
    this.statement = statement;
  }
}
export class Print extends Statement {
  printVal: Expression;
  constructor(printVal: Expression) {
    super();
    this.printVal = printVal;
  }
}
export class Integer extends Expression {
  val: number;
  constructor(val: number) {
    super();
    this.val = val;
  }
}
export class Add extends Expression {
  left: Expression;
  right: Expression;
  constructor(left: Expression, right: Expression) {
    super();

    this.left = left;
    this.right = right;
  }
}

export class Mul extends Expression {
  left: Expression;
  right: Expression;
  constructor(left: Expression, right: Expression) {
    super();
    this.left = left;
    this.right = right;
  }
}
export class Variable extends Expression {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}
export class LocalVariable extends Expression {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}
export class GlobalVariable extends Expression {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class VarDec extends Statement {
  name: string;
  initializer?: Expression;
  constructor(name: string, initializer?: Expression) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
}
export class LocalVarDec extends Statement {
  name: string;
  initializer?: Expression;
  constructor(name: string, initializer?: Expression) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
}
export class GlobalVarDec extends Statement {
  name: string;
  initializer?: Expression;
  constructor(name: string, initializer?: Expression) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
}

export class Assign extends Statement {
  variable: Expression;
  val: Expression;
  constructor(variable: Expression, val: Expression) {
    super();
    this.variable = variable;
    this.val = val;
  }
}

export class If extends Statement {
  ifcondition: Expression;
  ifBlock: Statement[];
  elseBlock: Statement[];

  constructor(
    ifcondition: Expression,
    ifBlock: Statement[],
    elseBlock: Statement[],
  ) {
    super();
    this.ifcondition = ifcondition;
    this.ifBlock = ifBlock;
    this.elseBlock = elseBlock;
  }
}

export class Gt extends Expression {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class Lt extends Expression {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class Eq extends Expression {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class While extends Statement {
  conditions: Expression;
  whileBlock: Statement[];
  constructor(conditions: Expression, whileBlock: Statement[]) {
    super();
    this.conditions = conditions;
    this.whileBlock = whileBlock;
  }
}
export class Function extends Statement {
  fnName: string;
  fnArgs: Expression[];
  fnBlock: Statement[];
  fnReturn: Expression;
  constructor(
    fnName: string,
    fnArgs: Expression[],
    fnBlock: Statement[],
    fnReturn: Expression,
  ) {
    super();
    this.fnName = fnName;
    this.fnArgs = fnArgs;
    this.fnBlock = fnBlock;
    this.fnReturn = fnReturn;
  }
}
export class FunctionCall extends Expression {
  fnName: string;
  fnArgs: Expression[];
  constructor(fnName: string, fnArgs: Expression[]) {
    super();
    this.fnName = fnName;
    this.fnArgs = fnArgs;
  }
}

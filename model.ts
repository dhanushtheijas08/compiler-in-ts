export abstract class Statement {}
export abstract class Expression {}
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

export class Assign extends Statement {
  name: string;
  val: Expression;
  constructor(name: string, val: Expression) {
    super();
    this.name = name;
    this.val = val;
  }
}
export class VaraiableDec extends Statement {
  name: string;
  val: Expression;
  constructor(name: string, val: Expression) {
    super();
    this.name = name;
    this.val = val;
  }
}

export class If extends Statement {
  ifcondition: Statement;
  ifBlock: Statement[];
  elseBlock: Statement[];

  constructor(
    ifcondition: Statement,
    ifBlock: Statement[],
    elseBlock: Statement[],
  ) {
    super();
    this.ifcondition = ifcondition;
    this.ifBlock = ifBlock;
    this.elseBlock = elseBlock;
  }
}

export class Gt extends Statement {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class Lt extends Statement {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class Eq extends Statement {
  val1: Expression;
  val2: Expression;
  constructor(val1: Expression, val2: Expression) {
    super();
    this.val1 = val1;
    this.val2 = val2;
  }
}
export class While extends Statement {
  conditions: Statement;
  whileBlock: Statement[];
  constructor(conditions: Statement, whileBlock: Statement[]) {
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

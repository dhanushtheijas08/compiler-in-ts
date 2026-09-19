import { binaryOperators, type BinaryOperator } from "./token";

export abstract class Expression {
  abstract print(): void;
}
export abstract class Statement {
  abstract print(): void;
}
export class Program {
  constructor(private statements: Statement[]) {
    this.statements = statements;
  }

  print() {
    for (let statement of this.statements) {
      statement.print();
    }
  }
}
export class IntegerLiteral extends Expression {
  constructor(private val: number) {
    super();
    if (!Number.isInteger(val))
      throw new TypeError("Integer requires a number");

    this.val = val;
  }
  print() {
    console.log(`INTEGER(${this.val})`);
  }
}
export class FloatLiteral extends Expression {
  constructor(private val: number) {
    super();
    if (!Number.isFinite(val)) throw new TypeError("Invalid float");

    this.val = val;
  }
  print() {
    console.log(`FLOAT(${this.val})`);
  }
}
export class StringLiteral extends Expression {
  constructor(private val: string) {
    super();
    this.val = val;
  }
  print() {
    console.log(`STRING(${this.val})`);
  }
}
export class BooleanLiteral extends Expression {
  private val: boolean;
  constructor(val: string) {
    super();
    if (val === "true") this.val = true;
    else if (val === "false") this.val = false;
    else throw new TypeError("Boolean requires true or false");
  }
  print() {
    console.log(`BOOL(${this.val})`);
  }
}
export class BinOps extends Expression {
  constructor(
    private left: Expression,
    private right: Expression,
    private operator: BinaryOperator,
  ) {
    super();

    if (!(left instanceof Expression)) {
      throw new TypeError("Left operand must be an Expression");
    }

    if (!(right instanceof Expression)) {
      throw new TypeError("Right operand must be an Expression");
    }

    if (!binaryOperators.includes(operator)) {
      throw new TypeError("Invalid binary operator");
    }

    this.left = left;
    this.right = right;
    this.operator = operator;
  }
  print() {
    console.log(
      `BINOP(${this.left.toString()}, ${this.operator}, ${this.right.toString()})`,
    );
  }
}
export class Identifier extends Expression {
  constructor(private name: string) {
    super();
    this.name = name;
  }

  print() {
    console.log(`IDENTIFIER(${this.name})`);
  }
}
export class AssignmentExpression extends Expression {
  constructor(
    public readonly target: Identifier,
    public readonly value: Expression,
  ) {
    super();
    this.target = target;
    this.value = value;
  }

  print() {
    console.log(`ASSIGNMENT`);
    this.target.print();
    this.value.print();
  }
}
export class VariableDeclaration extends Statement {
  constructor(
    public readonly name: Identifier,
    public readonly initializer: Expression,
  ) {
    super();

    this.name = name;
    this.initializer = initializer;
  }

  print() {
    console.log("VARIABLE_DECLARATION");

    this.name.print();
    this.initializer.print();
  }
}

// export class WhileStatement extends Statement {
//   // while () {}

//   constructor() {
//     super();
//   }
// }

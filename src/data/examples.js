/**
 * TypeGuard - Curated Preset Example Programs
 * Organized by educational category for Compiler Design demonstrations
 */

export const EXAMPLE_CATEGORIES = [
  'All',
  'Valid Programs',
  'Type Errors',
  'Syntax Errors',
  'Undeclared Variables',
  'Duplicate Declarations',
  'Arithmetic Expressions',
  'Boolean Expressions',
  'Comparison Expressions'
];

export const EXAMPLES = [
  {
    id: 'standard-reference',
    title: 'TypeGuard Reference Program',
    category: 'Valid Programs',
    difficulty: 'Introductory',
    description: 'The standard sample program featuring multiple data types, arithmetic calculation, and output display.',
    outcome: 'Demonstrates clean passage through all 6 compiler pipeline stages without errors.',
    code: `int age = 20;
float height = 5.8;
string name = "Utkarsh";
bool isStudent = true;

int score = 90;
int bonus = 10;
int total = score + bonus;

print(name);
print(total);`
  },
  {
    id: 'example-a-valid',
    title: 'Example A: Basic Arithmetic & Output',
    category: 'Valid Programs',
    difficulty: 'Beginner',
    description: 'Two integer variables summed together and printed to standard output.',
    outcome: 'Produces a valid AST, 3 symbol table entries, and verified static type checking.',
    code: `int a = 10;
int b = 20;
int sum = a + b;
print(sum);`
  },
  {
    id: 'example-b-type-mismatch',
    title: 'Example B: Incompatible Assignment',
    category: 'Type Errors',
    difficulty: 'Fundamental',
    description: 'Attempting to assign a string literal to an integer variable.',
    outcome: 'Triggers TYPE001 diagnostic explaining that string cannot be assigned to int.',
    code: `int age = "twenty";`
  },
  {
    id: 'example-c-undeclared',
    title: 'Example C: Undeclared Variable',
    category: 'Undeclared Variables',
    difficulty: 'Fundamental',
    description: 'Using identifier "marks" in an expression before it has been declared.',
    outcome: 'Triggers NAME001 diagnostic indicating identifier was not found in the symbol table.',
    code: `int total = marks + 10;`
  },
  {
    id: 'example-d-duplicate',
    title: 'Example D: Duplicate Declaration',
    category: 'Duplicate Declarations',
    difficulty: 'Fundamental',
    description: 'Declaring the variable "score" twice in the same global lexical scope.',
    outcome: 'Triggers DECL001 diagnostic identifying first declaration line and prohibiting redeclaration.',
    code: `int score = 80;
int score = 90;`
  },
  {
    id: 'example-e-invalid-arithmetic',
    title: 'Example E: Invalid Mixed Arithmetic',
    category: 'Arithmetic Expressions',
    difficulty: 'Intermediate',
    description: 'Attempting addition between an integer variable and a string variable.',
    outcome: 'Triggers TYPE002 diagnostic indicating incompatible operand types for "+".',
    code: `int a = 10;
string name = "Sam";
int result = a + name;`
  },
  {
    id: 'example-f-boolean-valid',
    title: 'Example F: Valid Boolean Logic',
    category: 'Boolean Expressions',
    difficulty: 'Intermediate',
    description: 'Logical AND (&&) operation between two boolean variables.',
    outcome: 'Static type checker infers boolean type and approves expression.',
    code: `bool active = true;
bool verified = false;
bool result = active && verified;`
  },
  {
    id: 'example-g-syntax-error',
    title: 'Example G: Missing Semicolon',
    category: 'Syntax Errors',
    difficulty: 'Beginner',
    description: 'Omitting the mandatory semicolon at the end of a variable declaration.',
    outcome: 'Triggers SYN001 syntax error and halts AST generation before semantic analysis.',
    code: `int number = 10
print(number);`
  },
  {
    id: 'invalid-boolean-type',
    title: 'Invalid Boolean Operands',
    category: 'Boolean Expressions',
    difficulty: 'Intermediate',
    description: 'Using an integer with the logical AND (&&) operator.',
    outcome: 'Triggers TYPE003 diagnostic because logical operators strictly require boolean operands.',
    code: `int count = 5;
bool isValid = count && true;`
  },
  {
    id: 'comparisons-valid',
    title: 'Relational & Equality Comparisons',
    category: 'Comparison Expressions',
    difficulty: 'Intermediate',
    description: 'Comparing numeric values and assigning the boolean outcome to variables.',
    outcome: 'Infers boolean types for all comparison operators (<, >=, ==).',
    code: `int age = 21;
bool isAdult = age >= 18;
bool isCentury = age == 100;
print(isAdult);`
  },
  {
    id: 'float-widening',
    title: 'Float Widening & Expressions',
    category: 'Arithmetic Expressions',
    difficulty: 'Advanced',
    description: 'Demonstrating numeric type promotion where an integer is widened to float.',
    outcome: 'Confirms that int + float promotes cleanly to float in static type checking.',
    code: `float pi = 3.14159;
int radius = 10;
float area = pi * radius * radius;
print(area);`
  },
  {
    id: 'string-concatenation',
    title: 'String Concatenation',
    category: 'Valid Programs',
    difficulty: 'Intermediate',
    description: 'Joining two string expressions using the overloaded addition operator.',
    outcome: 'Infers string type for binary "+" when both operands are strings.',
    code: `string greeting = "Hello, ";
string target = "TypeGuard";
string message = greeting + target;
print(message);`
  }
];

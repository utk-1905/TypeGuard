/**
 * TypeGuard - Symbol Table Manager
 * Compiler Design Mini Project: Static Type Checking System
 */

export class SymbolEntry {
  constructor({
    name,
    type,
    initialValue = null,
    isInitialized = false,
    line = 1,
    col = 1,
    scope = 'global',
    memoryOffset = 0
  }) {
    this.name = name;
    this.type = type;
    this.initialValue = initialValue !== null ? initialValue : '— (uninitialized)';
    this.isInitialized = isInitialized;
    this.line = line;
    this.col = col;
    this.scope = scope;
    this.memoryOffset = memoryOffset;
    this.references = [];
  }

  addReference(line) {
    if (!this.references.includes(line)) {
      this.references.push(line);
    }
  }
}

export class SymbolTable {
  constructor(scopeName = 'global') {
    this.scopeName = scopeName;
    this.symbols = new Map();
    this.duplicates = [];
    this.currentOffset = 0;
  }

  getTypeSize(type) {
    switch (type) {
      case 'int': return 4;
      case 'float': return 8;
      case 'bool': return 1;
      case 'string': return 16;
      default: return 4;
    }
  }

  define({ name, type, initialValue, isInitialized, line, col }) {
    if (this.symbols.has(name)) {
      const existing = this.symbols.get(name);
      this.duplicates.push({
        name,
        type,
        line,
        col,
        firstDeclaredLine: existing.line
      });
      return false;
    }

    const offset = this.currentOffset;
    this.currentOffset += this.getTypeSize(type);

    const entry = new SymbolEntry({
      name,
      type,
      initialValue,
      isInitialized,
      line,
      col,
      scope: this.scopeName,
      memoryOffset: offset
    });

    this.symbols.set(name, entry);
    return true;
  }

  lookup(name) {
    return this.symbols.get(name) || null;
  }

  has(name) {
    return this.symbols.has(name);
  }

  markInitialized(name) {
    const entry = this.symbols.get(name);
    if (entry) {
      entry.isInitialized = true;
    }
  }

  recordReference(name, line) {
    const entry = this.symbols.get(name);
    if (entry) {
      entry.addReference(line);
    }
  }

  getAll() {
    return Array.from(this.symbols.values());
  }

  clear() {
    this.symbols.clear();
    this.duplicates = [];
    this.currentOffset = 0;
  }
}

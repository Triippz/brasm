declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export {};

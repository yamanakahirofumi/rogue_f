export class Random {
  private readonly initialSeed: bigint;
  private seed: bigint;
  private multiplier: bigint = 0x5DEECE66Dn;
  private addend: bigint = 0xBn;
  private mask: bigint = (1n << 48n) - 1n; // 281474976710655n; // (1n << 48n) - 1n;

  constructor(seed: bigint) {
    this.initialSeed = seed;
    this.seed = this.initialScramble(seed);
  }

  private initialScramble(seed: bigint): bigint {
    return (seed ^ this.multiplier) & this.mask;
  }

  private next(bits: number): number {
    this.seed = (this.seed * this.multiplier + this.addend) & this.mask;
    let d: number;
    if (this.seed < 0n){
      d = 1 << 31;
    } else{
      d = 0;
    }
    return Number(this.seed >> BigInt(48 - bits)) | d;
  }

  public nextInt(): number {
    return this.next(32);
  }

}

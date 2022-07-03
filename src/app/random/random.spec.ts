import { Random } from './random';

describe('Random', () => {
  it('should create an instance', () => {
    expect(new Random(1n)).toBeTruthy();
  });

  it('1 to next', () => {
    const r = new Random(1n);
    expect(r.nextInt()).toEqual(-1155869325, 'First');
    expect(r.nextInt()).toEqual(431529176, 'Second');
    expect(r.nextInt()).toEqual(1761283695, 'Third');
    expect(r.nextInt()).toEqual(1749940626, 'Fourth');
    expect(r.nextInt()).toEqual(892128508, 'Fifth');
    expect(r.nextInt()).toEqual(155629808, 'Sixth');
    expect(r.nextInt()).toEqual(1429008869, 'Seventh');
    expect(r.nextInt()).toEqual(-1465154083, 'Eighth');
    expect(r.nextInt()).toEqual(-138487339, 'Ninth');
    expect(r.nextInt()).toEqual(-1242363800, 'Tenth');
    expect(r.nextInt()).toEqual(26273138, 'Eleventh');
  });
});

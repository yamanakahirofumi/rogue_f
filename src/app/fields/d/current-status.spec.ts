import {CurrentStatus} from './current-status';

describe('CurrentStatus', () => {
  it('should create an instance', () => {
    expect(new CurrentStatus(100, 100, 100, 100, 0.5)).toBeTruthy();
  });

  it('should handle percentage-based recovery', () => {
    const status = new CurrentStatus(50, 100, 50, 100, 0.5);
    status.recover(1.0); // Satiated rate 1.0 (multiplier 1.2)
    // HP: 50 + 100 * 0.01 * 1.2 = 50 + 1 = 51 (floor)
    // Stamina: 50 + 100 * 0.01 * 1.2 = 50 + 1 = 51 (floor)
    expect(status.getHp()).toBe(51);
    expect(status.getStamina()).toBe(51);
  });

  it('should handle minusStamina with HP damage', () => {
    const status = new CurrentStatus(100, 100, 1, 100, 0.5);
    status.minusStamina(2);
    expect(status.getStamina()).toBe(0);
    expect(status.getHp()).toBe(99);
  });

  it('should not recover when hungry', () => {
    const status = new CurrentStatus(50, 100, 50, 100, 0.5);
    status.recover(0.1); // Hungry rate 0.1 (multiplier 0)
    expect(status.getHp()).toBe(50);
    expect(status.getStamina()).toBe(50);
  });
});

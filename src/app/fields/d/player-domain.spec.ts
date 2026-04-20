import {PlayerDomain} from './player-domain';

describe('Player', () => {
  let mockPlayer: Player;

  beforeEach(() => {
    mockPlayer = {
      id: "1",
      name: "name",
      actionTime: 0,
      gold: 100,
      level: 1,
      exp: 0,
      nextExp: 100,
      hp: 100,
      maxHp: 100,
      stamina: 100,
      maxStamina: 100,
      satiety: 100,
      maxSatiety: 100,
      attack: 10,
      defense: 5,
      agility: 100, // 2x speed
      dexterity: 10,
      speed: 10,
      luck: 10,
      inventory: [],
      inventoryCapacity: 20,
      statusEffects: [],
    };
  });

  it('should create an instance and calculate interval based on agility', () => {
    const player = new PlayerDomain(mockPlayer);
    expect(player).toBeTruthy();
    // baseInterval 0.5 / (1 + 100/100) = 0.25
    expect(player.getActionGageRecoveryTimes()).toBe(0.25);
  });

  it('should decrease satiety on action', (done) => {
    const player = new PlayerDomain(mockPlayer);
    // Move actionTime back to bypass cooldown
    const p = player as any;
    p.actionTime = new Date().getTime() - 1000;

    player.action();
    expect(player.getSatiety()).toBeCloseTo(99.8, 5);
    done();
  });

  it('should handle natural recovery and starvation', () => {
    const player = new PlayerDomain({
      ...mockPlayer,
      hp: 50,
      stamina: 50,
      satiety: 0
    });
    player.recover();
    // Satiety 0 means no recovery and 2% HP damage per 10s tick (1% per 5s)
    expect(player.getHp()).toBe(48);
    expect(player.getStamina()).toBe(50);
  });
});

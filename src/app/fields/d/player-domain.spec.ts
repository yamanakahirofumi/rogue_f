import {PlayerDomain} from './player-domain';

describe('Player', () => {
  it('should create an instance', () => {
    expect(new PlayerDomain({
        id: "1",
        name: "name",
        actionTime: 0,
        gold: 0,
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
        agility: 10,
        dexterity: 10,
        speed: 10,
      })
    ).toBeTruthy();
  });
})
;

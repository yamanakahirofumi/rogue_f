import {PlayerDomain} from './player-domain';

describe('Player', () => {
  it('should create an instance', () => {
    expect(new PlayerDomain({
        id: "1",
        name: "name",
        actionTime: 0,
        gold: 0,
      })
    ).toBeTruthy();
  });
})
;

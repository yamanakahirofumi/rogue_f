import {PlayerDomain} from './player-domain';

describe('Player', () => {
  it('should create an instance', () => {
    expect(new PlayerDomain("1", "name")).toBeTruthy();
  });
});

import app from '../../../src/app';

describe('\'v1/statistics\' service', () => {
  it('registered the service', () => {
    const service = app.service('v1/statistics');
    expect(service).toBeTruthy();
  });
});

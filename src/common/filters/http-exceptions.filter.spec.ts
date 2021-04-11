import { HttpExceptionsFilter } from './http-exceptions.filter';

describe('TtpExceptionsFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionsFilter()).toBeDefined();
  });
});

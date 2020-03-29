import generateBoardName from './generateBoardName';
const MockDate = require('mockdate');

describe('generateBoardName', () => {
  beforeAll(() => {
    MockDate.set('1/30/2000');
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('generates a name based on date', () => {
    const generatedBoardName = generateBoardName();
    expect(generatedBoardName).toContain('1/30/2000');
    expect(generatedBoardName).toMatchSnapshot();
  });
});

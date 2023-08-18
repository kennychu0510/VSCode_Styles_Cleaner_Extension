import { expect, test, describe } from 'vitest';
import { getStyles } from '../src/helper';
import fs from 'fs';

describe('For all styles used file', () => {
  const text = fs.readFileSync('./test/file1.js', {
    encoding: 'utf-8',
  });
  const result = getStyles(text)[0];

  test('get styles return the correct shape', () => {
    expect(result).toHaveProperty('rootName');
    expect(result).toHaveProperty('styles');
    expect(result).toHaveProperty('location');
    expect(result).toHaveProperty('styleType');
  });

  test('each style is used once', () => {
    expect(result.styles.container.usage).toBe(1);
    expect(result.styles.text.usage).toBe(1);
  });
});

describe('For no styles used file', () => {
  const text = fs.readFileSync('./test/file2.js', {
    encoding: 'utf-8',
  });
  const result = getStyles(text)[0];

  test('no style is used', () => {
    expect(result.styles.container.usage).toBe(0);
    expect(result.styles.text.usage).toBe(0);
  });
});

describe('For stylesheet created as arrow function', () => {
  const text = fs.readFileSync('./test/file3.js', {
    encoding: 'utf-8',
  });
  const result = getStyles(text)[0];

  test('get styles return the correct shape', () => {
    expect(result).toHaveProperty('rootName');
    expect(result).toHaveProperty('styles');
    expect(result).toHaveProperty('location');
    expect(result).toHaveProperty('styleType');
  });

  test('correctly extract style usage', () => {
    expect(result.styles.container.usage).toBe(1);
    expect(result.styles.text.usage).toBe(0);
  });
});

describe('For multiple styles in component', () => {
  const text = fs.readFileSync('./test/file4.js', {
    encoding: 'utf-8',
  });
  const result = getStyles(text);
  const componentStyle = result.find((item) => item.rootName === 'componentStyle');
  const styles = result.find((item) => item.rootName === 'styles');

  test('expect result to return 2 styles', () => {
    expect(result.length).toBe(2);
  });

  test('expect all the root styles to be found', () => {
    expect(componentStyle).toBeDefined();
    expect(styles).toBeDefined();
  });

  test('expect style usage of individual styles are correct', () => {
    expect(componentStyle.styles.componentContainer.usage).toBe(1)
    expect(componentStyle.styles.text.usage).toBe(0)

    expect(styles.styles.container.usage).toBe(0)
    expect(styles.styles.text.usage).toBe(1)
  });
});

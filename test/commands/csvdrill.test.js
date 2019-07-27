const {expect, test} = require('@oclif/test')

// Note: Please update paths before testing! Add your directory path.

describe('should return an error for an unexisting file path', () => {
  test
  .stdout()
  .command(['csvdrill', '--dbpath', '/home/ayush/test.csv'])
  .it('runs csvdrill --dbpath /home/ayush/test.csv', ctx => {
    expect(ctx.stdout).to.contain('The directory or file does not exists! Filename should be all lower case or else another file with the same name but lower case will be created!')
  })
})

describe('should return an error for an unexisting path', () => {
  test
  .stdout()
  .command(['csvdrill', '--dbpath', '/home/ayushs'])
  .it('runs csvdrill --dbpath /home/ayushs', ctx => {
    expect(ctx.stdout).to.contain('The directory or file does not exists! Filename should be all lower case or else another file with the same name but lower case will be created!')
  })
})

describe('should continue on existing file path', () => {
  test
  .stdout()
  .command(['csvdrill', '--dbpath', '/home/ayush/a.csv'])
  .it('runs csvdrill --dbpath /home/ayush/a.csv', ctx => {
    expect(ctx.stdout).to.contain('')
  })
})

describe('should continue on existing path', () => {
  test
  .stdout()
  .command(['csvdrill', '--dbpath', '/home/ayush'])
  .it('runs csvdrill --dbpath /home/ayush', ctx => {
    expect(ctx.stdout).to.contain('')
  })
})

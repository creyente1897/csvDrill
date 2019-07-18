const {expect, test} = require('@oclif/test')

describe('csvdrill', () => {
  test
  .stdout()
  .command(['csvdrill'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['csvdrill', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

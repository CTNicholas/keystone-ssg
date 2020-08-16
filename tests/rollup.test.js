const File = require('../keystone/builder/file')
const ROLLUP = require('../keystone/builder/rollup')

describe('ROLLUP', () => {
  test('.scss SCSS', async () => {
    const file = new File('tests/examples/style.scss')
    await ROLLUP(file)
    expect(file.new.fileContent.trimEnd()).toBe('body{background:red}')
  })
  
  test('.html HTML', async () => {
    const file = new File('tests/examples/index.html')
    await ROLLUP(file)
    expect(file.new.fileContent.trimEnd()).toBe('<_import src="tests/examples/header.md" /><body>index.html</body>')
  })
 
  test('.js Javascript', async () => {
    const file = new File('tests/examples/log.js')
    await ROLLUP(file)
    expect(file.new.fileContent.trimEnd()).toBe('!function(){\"use strict\";console.log(\"hello\")}();')
  })

  test('.md Markdown', async () => {
    const file = new File('tests/examples/header.md')
    await ROLLUP(file)
    expect(file.new.fileContent.trimEnd()).toBe('<h2 id="markdown">Markdown</h2>')
  })
})
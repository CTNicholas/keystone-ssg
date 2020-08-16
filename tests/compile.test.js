const File = require('../keystone/builder/file')
const COMPILE = require('../keystone/builder/compile')


describe('COMPILE', () => {
  test('import', async () => {
    const file = new File('tests/examples/index.html')
    file.new = {
      fileContent: file.old.fileContent,
      fileName: 'index.html'
    }
    await COMPILE(file)
    expect(file.new.fileContent).toBe('<h2 id="markdown">Markdown</h2>\n<body>index.html</body>')
  })

  test('template, import, var, script, style', async () => {
    const file = new File('tests/examples/compile.html')
    file.new = {
      fileContent: file.old.fileContent,
      fileName: 'compile.html'
    }
    await COMPILE(file)
    expect(file.new.fileContent).toBe('<h2 id="markdown">Markdown</h2>\n<body>index.html</body>apple<section>Compile me!</section><link rel=\"stylesheet\" href=\"/css/style.css\"><script src=\"/js/log.js\"></script>')
  })
})

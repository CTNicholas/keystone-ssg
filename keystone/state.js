module.exports = {
  mode: '',
  devServer: {},
  filesBuilt: [],
  error: false,

  fileStore: [],
  addFile (file) {
    this.fileStore.push(file)
  },
  getFile (filePath) {
    return this.fileStore.filter(file => file.old.filePath === filePath)[0] || false
  },
  removeFile (filePath) {
    this.fileStore = this.fileStore.filter(file => file.old.filePath === filePath)
  },
  hasFile (file) {
    return this.fileStore.includes(file)
  }
  /*
  templates: {},
  addTemplate ({ fileName, filePath }) {
    if (!this.templates.hasOwnProperty(filePath)) {
      this.templates[fileName] = filePath
    }
    // console.log(this.templates)
  },
  clearTemplates () {
    this.templates = {}
  }
  */
}

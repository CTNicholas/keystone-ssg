#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')

const exampleDirs = ['assets', 'components', 'pages', 'src', 'styles', 'templates']
if (pathsNotExist(exampleDirs)) {
  fs.copySync('keystone/bin/base', process.env.INIT_CWD)
} else {
  console.log('Keystone template folder(s) already exist, skipping installing example')
}

const gitInitDirs = ['.git', '.gitignore']
if (pathsNotExist(gitInitDirs)) {
  fs.ensureDirSync(homePath('.git'))
  fs.copySync('keystone/bin/git', homePath('.git'))
  fs.copySync('keystone/bin/gitIgnore', homePath('.gitignore'))
} else {
  console.log('Git already exists, skipping git init')
}

const packageLocation = homePath('package.json')
const keystoneScripts = {
  build: 'keystone-ssg',
  dev: 'keystone-ssg --dev'
}

try {
  const currPackage = fs.readJsonSync(packageLocation)
  currPackage.scripts = currPackage.scripts ? keystoneScripts : { ...currPackage.scripts, ...keystoneScripts }
  fs.writeJsonSync(packageLocation, currPackage)
  console.log('Writing scripts to package.json')
} catch (err) {
  console.log('Creating empty package.json')
  try {
    fs.writeJsonSync(packageLocation, {
      name: 'empty-keystone-project',
      author: '',
      description: '',
      license: 'ISC',
      version: '1.0.0',
      scripts: keystoneScripts
    })
  } catch (error) {
    console.log(error)
  }
}

function homePath (relPath) {
  return path.normalize(path.join(process.env.INIT_CWD, relPath))
}

function pathsNotExist (paths) {
  let notExist = true
  for (const path of paths) {
    if (fs.existsSync(homePath(path))) {
      notExist = false
    }
  }
  return notExist
}

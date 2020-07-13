#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')

fs.copySync('keystone/bin/base', process.env.INIT_CWD)

fs.ensureDirSync(path.join(process.env.INIT_CWD, '.git'))
fs.copySync('keystone/bin/git', path.join(process.env.INIT_CWD, '.git'))
fs.copySync('keystone/bin/gitIgnore', path.join(process.env.INIT_CWD, '.gitignore'))

const packageLocation = path.join(process.env.INIT_CWD, 'package.json')
const keystoneScripts = {
  build: 'keystone-ssg',
  dev: 'keystone-ssg --dev'
}

try {
  console.log('Writing scripts to package.json')
  const currPackage = fs.readJsonSync(packageLocation)
  currPackage.scripts = currPackage.scripts ? keystoneScripts : { ...currPackage.scripts, ...keystoneScripts }
  fs.writeJsonSync(packageLocation, currPackage)
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

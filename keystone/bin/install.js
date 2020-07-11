#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')

fs.copySync('keystone/bin/base', process.env.INIT_CWD)

const packageLocation = path.join(process.env.INIT_CWD, 'package.json')
const currPackage = fs.readJsonSync(packageLocation)
const keystoneScripts = {
  build: 'keystone-ssg',
  dev: 'keystone-ssg --dev'
}
currPackage.scripts = currPackage.scripts ? keystoneScripts : { ...currPackage.scripts, ...keystoneScripts }

fs.writeJsonSync(packageLocation, currPackage)

#!/usr/bin/env node

const fs = require('fs-extra')

fs.copySync('keystone/bin/base', process.env.INIT_CWD)

console.log('INSTALLERRRRRRRRRR')

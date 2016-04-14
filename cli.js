#!/usr/bin/env node
'use strict'
const imgcat = require('imgcat')
const meow = require('meow')
const Spin = require('io-spin')

const spin = new Spin('Box1')

const cli = meow(`
  Usage:

    imgcat <path|url>

    -w/--width    Image width
    -h/--height   Image height
    -v/--version  Print version
    --help        Print help
`, {
  alias: {
    w: 'width',
    h: 'height',
    v: 'version'
  }
})

const file = cli.input[0]
if (!file) {
  cli.showHelp()
}

const events = {
  beforeDownload() {
    spin.start()
  },
  afterDownload() {
    spin.stop()
  }
}

imgcat(file, cli.flags, events)
  .then(image => {
    console.log(image)
  })
  .catch(err => {
    console.log(err.stack)
    process.exit(1)
  })

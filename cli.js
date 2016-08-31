#!/usr/bin/env node
'use strict'
const imgcat = require('imgcat')
const meow = require('meow')
const Spin = require('io-spin')
const getStdin = require('get-stdin')

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

const events = {
  beforeDownload() {
    spin.start()
  },
  afterDownload() {
    spin.stop()
  }
}

const cat = file => imgcat(file, cli.flags, events)
  .then(image => {
    console.log(image)
  })
  .catch(err => {
    console.log(err.stack)
    process.exit(1)
  })

let file = cli.input[0]
if (file) {
  cat(file)
} else {
  getStdin().then(data => {
    if (data) {
      file = data.trim()
      cat(file)
    } else {
      cli.showHelp()
    }
  })
}

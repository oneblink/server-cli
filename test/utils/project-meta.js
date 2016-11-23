'use strict'

const path = require('path')

const test = require('ava')
const proxyquire = require('proxyquire')

const pkg = require('../../package.json')

const TEST_SUBJECT = '../../lib/utils/project-meta.js'

const CWD = path.join(__dirname, '..', 'fixtures', 'project-meta')

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(TEST_SUBJECT, overrides || {})
  }
})

test('projectConfig() call configLoader with correct input', (t) => {
  t.plan(1)
  const projectMeta = t.context.getTestSubject({
    '@blinkmobile/blinkmrc': {
      projectConfig: (options) => t.deepEqual(options, {
        name: pkg.name,
        cwd: CWD
      })
    }
  })

  projectMeta.projectConfig(CWD)
})

test('read() should return contents of .blinkmrc.json file', (t) => {
  const projectMeta = t.context.getTestSubject()

  return projectMeta.read(CWD)
    .then((meta) => t.deepEqual(meta, {
      'project-meta': 'test'
    }))
})

test('write() should merge changes with .blinkmrc.json file', (t) => {
  const projectMeta = t.context.getTestSubject()

  return projectMeta.write(CWD, (config) => {
    config.new = 'test new property'
    return config
  })
    .then((meta) => t.deepEqual(meta, {
      'new': 'test new property',
      'project-meta': 'test'
    }))
    .then(() => projectMeta.write(CWD, (config) => ({
      'project-meta': 'test'
    })))
})
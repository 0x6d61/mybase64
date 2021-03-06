const assert = require('assert')
const mybase64 = require('../index.js')

describe('encode',() => {
    it('ABCDEF',() => {
        assert.equal(mybase64.encode('ABCDEF'),'QUJDREVG')
    })
    it('12345',() => {
        assert.equal(mybase64.encode('12345'),'MTIzNDU=')
    })
})

describe('decode',() => {
    it('QUJDREVG',() => {
        assert.equal(mybase64.decode('QUJDREVG'),'ABCDEF')
    })
    it('MTIzNDU=',() => {
        assert.equal(mybase64.decode('MTIzNDU='),'12345')
    })
})

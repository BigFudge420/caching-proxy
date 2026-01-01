import request from 'supertest'
import { describe, jest, it, expect } from '@jest/globals'
import app from '../app'
import nock from 'nock'

describe('cacheController' ,() => {
    it('tests request forwarding', async () => {
        nock('https://dummyjson.com')
          .get('/product')
          .reply(200, {products : [1, 2, 3, 4]})

        const res = await request(app).get('/product')

        expect(res.status).toBe(200)
        expect(res.body.product).toBe([1,2,3,4])
    })
})
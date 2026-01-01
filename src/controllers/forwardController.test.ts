import request from 'supertest'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import app from '../app.ts'
import nock from 'nock'

describe('cacheController' ,() => {
    it('tests request forwarding', async () => {
        nock('https://dummyjson.com')
          .get('/product')
          .reply(200, {products : [1, 2, 3, 4]})

        const res = await request(app).get('/product')

        assert.strictEqual(res.status, 200)
        assert.deepStrictEqual(res.body.products, [1,2,3,4])
    })

    it('tests params forwarding', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .query({limit : 10})
        .reply(200, {query : {limit : 10}})
      
      const res = await request(app).get('/product?limit=10')

      assert.strictEqual(res.status, 200)
      assert.deepStrictEqual(res.body.query, {limit : 10})
    })

    it('tests http methods', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .reply(200, {method : 'get'})

      nock('https://dummyjson.com')
        .post('/product')
        .reply(200, {method : 'post'})

      const resGet = await request(app).get('/product')
      
      assert.strictEqual(resGet.status, 200)
      assert.strictEqual(resGet.body.method, 'get')

      const resPost = await request(app).post('/product')
      
      assert.strictEqual(resPost.status, 200)
      assert.strictEqual(resPost.body.method, 'post')
    })

    it('tests header forwarding', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .matchHeader('Authorization', 'Bearer token')
        .matchHeader('X-test', (val) => {
          return val.includes('works')
        })
        .reply(200, {status : 'ok'})
        
      const headers = {'Authorization' : 'Bearer token', 'X-test' : 'test, works, application/json'}
      const res = await request(app).get('/product').set(headers)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(nock.isDone(), true)
    })
})
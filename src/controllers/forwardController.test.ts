import request from 'supertest'
import { describe, it, expect } from '@jest/globals'
import app from '../app.js'
import nock from 'nock'

describe('cacheController' ,() => {
    it('tests request forwarding', async () => {
        nock('https://dummyjson.com')
          .get('/product')
          .reply(200, {products : [1, 2, 3, 4]})

        const res = await request(app).get('/product')

        expect(res.status).toBe(200)
        expect(res.body.products).toEqual([1,2,3,4])
    })

    it('tests params forwarding', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .query({limit : 10})
        .reply(200, {query : {limit : 10}})
      
      const res = await request(app).get('/product?limit=10')

      expect(res.status).toBe(200)
      expect(res.body.query).toEqual({limit : 10})
    })

    it('tests http methods', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .reply(200, {method : 'get'})

      nock('https://dummyjson.com')
        .post('/product')
        .reply(200, {method : 'post'})

      const resGet = await request(app).get('/product')
      
      expect(resGet.status).toBe(200)
      expect(resGet.body.method).toBe('get')

      const resPost = await request(app).post('/product')
      
      expect(resPost.status).toBe(200)
      expect(resPost.body.method).toBe('post')
    })

    it('tests header forwarding', async () => {
      nock('https://dummyjson.com')
        .get('/product')
        .matchHeader('Authorization', 'Bearer token')
        .matchHeader('X-test', 'works')
        .reply(200, {status : 'ok'})

        
      const headers = {'Authorization' : 'Bearer token', 'X-test' : 'works'}
      const res = await request(app).get('/product').set(headers)

      expect(res.status).toBe(200)
      expect(nock.isDone()).toBeTruthy()
    })
})
import cookie from 'cookie'
import onHeaders from 'on-headers'
import uid from 'uid-safe'
import Redis from 'ioredis'
import crypto from 'crypto'
import parseUrl from 'parseurl'
import signature from 'cookie-signature'

export default function (options) {
    let opts = options || {}
    let name = opts.name || opts.key || 'connect.rid'
    let secret = opts.secret
    let redis = new Redis()
    let cookieOtp = options.cookie
    return async function(req, res, next) {
        try {
            if (req.redis) return next()

            let originalPath = parseUrl.original(req).pathname
            if (originalPath.indexOf('/') !== 0) return next()

            let redisId = req.redisId = getCookie(req, name, secret)
            if (!redisId) {
                redisId = req.redisId = await setredisId()
            }
            setCookie(res, name, redisId, secret, cookieOtp)
            req.redisCon = redis
            req.redis = await new _redis(req, opts).init()
            next()
        } catch (err) {
            console.error(err)
        }
    }
}
/**
 * 获取cookie
 * @param  {[type]} req    [description]
 * @param  {[type]} name   [description]
 * @param  {[type]} secret [description]
 * @return {[type]}        [description]
 */
function getCookie (req, name, secret) {
    let headers = req.headers.cookie
    if (headers) {
        let cookies = cookie.parse(headers)
        let raw = cookies[name]
        if (raw.substr(0, 2) === 'r:') {
            return signature.unsign(raw.slice(2), secret)
        } else {
            return null
        }
    }
}
/**
 * 生成cookies，设置响应头
 * @param {[type]} res       [description]
 * @param {[type]} name      [description]
 * @param {[type]} id        [description]
 * @param {[type]} secret    [description]
 * @param {[type]} cookieOtp [description]
 */
function setCookie (res, name, id, secret, cookieOtp) {
    let coo = 'r:' + signature.sign(id, secret)
    let data = cookie.serialize(name, coo, cookieOtp)
    let prev = res.getHeader('set-cookie') || []
    let header = Array.isArray(prev) ? prev.concat(data) : [prev, data]
    res.setHeader('set-cookie', header)
}

async function setredisId () {
    return await uid(24)
}
class _redis {
    constructor (vm, options) {
        this.vm = vm
        this.id = vm.redisId
        this.redis = vm.redisCon
        this.cookies = vm.cookies
        this.options = options
        this.data = {}
    }
    async init () {
        if (await this.redis.hsetnx(this.id, '_id', this.id)) {
            this.redis.expire(this.id, this.options.cookie.maxAge / 1000)
        }
        await this.redis.hmset(this.id, {
            secret: this.options.secret
        })
        this.data = await this.hgetall()
        return this
    }
    async set (type, msg) {
        let pid = this.id
        if (msg instanceof Object) {
            msg = JSON.stringify(msg)
        }
        if (msg instanceof Array) {
            msg = `[${msg.join(',')}]`
        }
        return await this.redis.hset(pid, type, msg)
    }
    async get (type) {
        let pid = this.id
        let data = await this.redis.hget(pid, type)
        if (data[0] === '{' && data[data.length - 1] === '}') {
            data = JSON.parse(data)
        }
        if (data[0] === '[' && data[data.length - 1] === ']') {
            data = data.slice(1, data.length - 1).split(',')
        }
        return data
    }
    async hmset (data) {
        return await this.redis.hmset(this.id, data)
    }
    async hgetall () {
        return await this.redis.hgetall(this.id)
    }
    async hdel (type) {
        return await this.redis.hdel(this.id, type)
    }
    async del () {
        return await this.redis.del(this.id)
    }
}

import { User } from '../models'
import respond from '../middleware/respond'
import { orUserName, orPwd, orEmail } from '../utils'
/**
 * 注册
 * @param  {[type]}  req [description]
 * @param  {[type]}  res [description]
 * @return {Promise}     [description]
 */
export const signup = async (req, res) => {
    let user = await new User({
        username: req.body.username,
        email: req.body.email
    })
    try {
        await User.signUp(user, req.body.pwd)
    } catch (error) {
        return respond(res, [
            400,
            error
        ])
    }
    req.flash('message', '注册成功')
    res.redirect('/signupdown')
}

export const signin = async (req, res) => {
    let info
    try {
        info = await User.signin(req.body.username, req.body.pwd)
    } catch (error) {
        return respond(res, [
            400,
            error
        ])
    }
    req.redis.set('userId', info.data._id + '')
    return res.redirect('/')
}

/**
 * 验证表单
 * @param  {[type]}  req [description]
 * @param  {[type]}  res [description]
 * @return {Promise}     [description]
 */
export const validator = async (req, res) => {
    if (req.query.resource === 'signup') {
        try {
            await veliSignUp(req.body)
        } catch (error) {
            return respond(res, {
                validator: false,
                errorMessage: error
            }, true)
        }
    } else {
        try {
            await veliSignIn(req.body)
        } catch (error) {
            return respond(res, {
                validator: false,
                errorMessage: error
            }, true)
        }
    }
    return respond(res, {
        validator: true
    }, true)
}
/**
 * 验证中间件
 * @type {Object}
 */
export const Verify = {
    signup: async (req, res, next) => {
        try {
            await veliSignUp(req.body)
        } catch (error) {
            return respond(res, [401, {
                message: error
            }])
        }
        next()
    },
    signin: async (req, res, next) => {
        try {
            await veliSignIn(req.body)
        } catch (error) {
            return respond(res, [401, {
                message: error
            }])
        }
        next()
    }
}

async function veliSignUp (data) {
    let username = data.username || null
    let pwd = data.pwd || null
    let email = data.email || null
    if (!orUserName(username))
        throw '用户名输入有误'
    if (!orPwd(pwd))
        throw '密码输入有误'
    if (!orEmail(email))
        throw '邮箱输入有误'
    if (await User.findOne({ username: username }))
        throw '用户名已存在'
    if (await User.findOne({ email: email }))
        throw '邮箱已被注册'

    return true
}
async function veliSignIn (data) {
    let username = data.username || null
    let pwd = data.pwd || null
    if (!orUserName(username))
        throw '用户名输入有误'
    if (!orPwd(pwd))
        throw '密码输入有误'
    if (!await User.findOne({ username: username }))
        throw '用户名不存在'

    return true
}

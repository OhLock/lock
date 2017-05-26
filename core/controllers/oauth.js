import axios from 'axios'
axios.defaults.headers = {
    Accept: 'application/json'
}
/**
 * Created by yuer on 2017/5/26.
 */
export const github = async (req, res) => {
    let code = req.query.code
    let cb
    try {
        cb = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: '6509c38c55d429061594',
            client_secret: '76f14c9b6c945f197491eb3f7006d1aa89ec22d0',
            code: code,
        })
    } catch (err) {
        req.flash('message', '认证失败')
        return res.redirect('/sigin')
    }
    let token = cb.data.access_token
    req.redis.set('isAuthenticated', true)
    req.redis.set('authInfo', {
        isOauth: true,
        auth: 'github',
        token: token
    })
}
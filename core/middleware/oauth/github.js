/**
 * Created by yuer on 2017/5/26.
 */
import config from '../../../config'
import axios from '../axios'
export const GithubAuthorize = function (next, error) {
    return async (req, res) => {
        let code = req.query.code
        let cb
        try {
            cb = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: '6509c38c55d429061594',
                client_secret: '76f14c9b6c945f197491eb3f7006d1aa89ec22d0',
                code: code,
            })
        } catch (err) {
            req.cute.unAuth({
                message: '认证失败',
                errData: err
            })
        }
        let token = cb.access_token
        next(req, res, null, token)
    }
}
import { signup, signin, signout, Verify, validator } from '../controllers/accounts'
import { authenticated } from '../controllers/authenticated'
import { github } from '../controllers/oauth'
import { User } from '../models'
import { GithubAuthorize } from '../middleware/oauth'
import * as auth from '../middleware/auth'
import axios from 'axios'
axios.defaults.headers = {
    Accept: 'application/json'
}
export default (server) => {
    server.get('/', auth.authenticated, async (req, res) => {
        let authInfo = req.redis.authInfo
        let initUser = {}
        let user = {}
        if (authInfo.isOauth) {
            initUser = await axios.post('https://api.github.com/graphql', {
                query: `
                    query {
                        viewer {
                            login
                            avatarUrl
                            name
                            url
                            email
                            bio
                            websiteUrl
                        }
                    }`
            }, {
                headers: {
                    Authorization: `bearer ${authInfo.token}`
                }
            })
            initUser = initUser.data.data.viewer
            Object.keys(initUser)
                .forEach(key => {
                    if (key === 'login') {
                        user.username = initUser[key]
                    } else if (key === 'name') {
                        user.nickname = initUser[key]
                    } else if (key === 'avatarUrl') {
                        user.avatar = initUser[key]
                    } else if (key === 'websiteUrl') {
                        user.url = initUser[key]
                    } else if (key === 'bio') {
                        user.description = initUser[key]
                    } else {
                        user[key] = initUser[key]
                    }
                })
        } else {
            user = await User.findById(req.redis.data.userId)
        }
        res.render('index', {
            title: 'index',
            user: user
        })
    })
    server.get('/signup', auth.anonymous, async (req, res) => {
        res.render('signup', {
            title: 'Sign Up'
        })
    })
    server.get('/signin', auth.anonymous, async (req, res) => {
        let message = await req.flash('message')
        res.render('signin', {
            title: 'Sign In',
            message: message
        })
    })
    server.get('/signupdown', async (req, res) => {
        let message = await req.flash('message')
        if (!message) return res.redirect('/signin')
        res.render('signupdown', {
            title: 'Sign Up Down',
            message: message
        })
    })
    server.get('/signout', signout)
    server.get('/authenticated', authenticated)
    server.get('/oauth/github', github)
    server.post('/signup', Verify.signup, signup)
    server.post('/signin', Verify.signin, signin)
    server.post('/validator', validator)
    server.get('/test', GithubAuthorize)
}

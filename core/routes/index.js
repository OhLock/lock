import { signup, signin, Verify, validator } from '../controllers/accounts'
import { User } from '../models'
export default (server) => {
    server.get('/', async (req, res) => {
        let user = await User.findById(req.redis.data.userId)
        res.render('index', {
            title: 'index',
            user: user
        })
    })
    server.get('/signup', async (req, res) => {
        res.render('signup', {
            title: 'Sign Up'
        })
    })
    server.get('/signin', async (req, res) => {
        res.render('signin', {
            title: 'Sign In'
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
    server.post('/signup', Verify.signup, signup)
    server.post('/signin', Verify.signin, signin)
    server.post('/validator', validator)
}

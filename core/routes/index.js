import { signup, signin, Verify, validator } from '../controllers/accounts'
export default (server) => {
    server.get('/', async (req, res) => {
        res.render('index', {
            title: 'index'
        })
    })
    server.get('/signup', async (req, res) => {
        let a = await req.redis.get('test')
        console.log(a)
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
        if (req.flash('message')) return res.redirect('/signin')
        res.render('signupdown', {
            title: 'Sign Up Down',
            message: req.flash('message')
        })
    })
    server.post('/signup', Verify.signup, signup)
    server.post('/signin', Verify.signin, signin)
    server.post('/validator', validator)
}

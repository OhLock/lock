import { signup, Verify, validator } from '../controllers/accounts'
export default (server) => {
    server.get('/signup', async (req, res) => {
        res.render('signup', {
            title: 'Sign Up'
        })
    })
    server.get('/signupdown', async (req, res) => {
        res.render('signupdown', {
            title: 'Sign Up Down',
            message: '注册成功' ||req.flash('message')
        })
    })
    server.post('/signup', Verify.signup, signup)
    server.post('/validator', validator)
}

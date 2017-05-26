import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import fp from 'path'

let url = relative('./views')

function relative (path) {
    return fp.join(__dirname, path)
}


const hbs = exphbs.create({
    defaultLayout: 'default',
    layoutsDir: `${url}/layouts`,
    partialsDir: [
        `${url}/partials/`
    ],
    extname: '.hbs'
})

const app = new express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser())
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', url)

app.get('/', function (req, res) {
    let url = `${req.protocol}://${req.headers.host}${req.originalUrl}`
    // return res.redirect(`http://localhost:2333/authenticated?redirect_uri=${url}`)
    if (req.query.rid) {
        res.redirect('/')
    }
    console.log(req.query)
    return res.render('index', {
        title: 'Sign Up'
    })
})

app.listen(4001, function(){
    console.log('port 4001!')
    console.log('biu~')
})

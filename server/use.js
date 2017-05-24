/**
 * Created by yuer on 2017/5/22.
 */
import express from 'express'
import bodyParser from 'body-parser'
import fp from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from '../config'
import exphbs from 'express-handlebars'
import helpers from '../core/helpers'
import session from 'express-session'
import flash from './flash'
let url = relative('../app')

function relative (path) {
    return fp.join(__dirname, path)
}

let hbs = exphbs.create({
    defaultLayout: 'default',
    helpers: helpers,
    layoutsDir: `${url}/layouts`,
    partialsDir: [
        `${url}/partials/`
    ],
    extname: '.hbs'
})

export default (app) => {
    // Node.js body parsing middleware.
    app.set('secret', config.secret)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: null
        }
    }))
    app.use(flash())
    app.use(morgan('dev'))
    app.use(cookieParser())
    app.engine('.hbs', hbs.engine)
    app.set('view engine', '.hbs')
    app.set('views', url)
    app.use('/assets', express.static(`${url}/assets/`))
}

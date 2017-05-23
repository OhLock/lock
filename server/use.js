/**
 * Created by yuer on 2017/5/22.
 */
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from '../config'

export default (app) => {
    // Node.js body parsing middleware.
    app.set('secret', config.secret)
    app.use(bodyParser.json())
    app.use(morgan('dev'))
    app.use(cookieParser())
}
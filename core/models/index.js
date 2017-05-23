import mongoose from 'mongoose'
import { mongo as config } from '../../config'

mongoose.connect(`mongodb://${config.username}:${config.pwd}@${config.host}:${config.port}/${config.db}`)

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', async () => {
    console.log('MongoDB Opened!')
})

export { default as User } from './user'

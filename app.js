/**
 * Created by yuer on 2017/5/22.
 */
import express from 'express'
import config from './config'

// use middleware
import use from './server/use'

const app = new express()

use(app)

process.on('SIGINT', () => {
    console.log('bye~')
    process.exit()
})

app.listen(config.port, function(){
    console.log(`port ${config.port}!`)
    console.log('biu~')
})

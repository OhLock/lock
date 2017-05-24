export default function (options) {
    return function(req, res, next) {
        if (req.flash) return next()
        req.flash = _flash
        next()
    }
}

function _flash (type, msg) {
    let msgs = this.session.flash = this.session.flash || {}
    if (type && msg) {
        msgs[type] = msg
        return this
    } else if (type) {
        let m = msgs[type]
        delete msgs[type]
        return m
    } else {
        this.session.flash = {}
        return msgs
    }
}

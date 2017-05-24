export function filterObj (obj, arr) {
    obj = Object.create(obj)
    let newObj = {}
    arr.forEach(type => {
        newObj[type] = obj[type] || null
    })
    return newObj
}

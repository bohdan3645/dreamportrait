var mongoose = require('mongoose')
var Schema = mongoose.Schema
var products = require('./productOrder').schema

var schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isPayed: { type: Boolean, default: false },
    products: [
      { type: products, ref: 'productOrder' }
    ],
    idNumber: { type: Schema.Types.Number }
  },
  {
    timestamps: true
  }
)

// before create
schema.pre('save', function (next) {
  if (!this.isNew) {
    return next()
  }

  getUniqueIdNumber(this.constructor, (err, number) => {
    if (err) return next(err)

    this.idNumber = number

    next()
  })
})

// generate 4 digest random number
function getUniqueIdNumber (model, cb) {
  const number = Math.floor(1000 + Math.random() * 9000)

  model.findOne(
    { idNumber: number },
    (err, result) => {
      if (err) return cb(err)
      if (result) return getUniqueIdNumber(model, cb) // generate again

      cb(null, number)
    })
}

module.exports = mongoose.model('Order', schema)

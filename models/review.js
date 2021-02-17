const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema(
  {
    imageUrl: { type: Schema.Types.String, required: true },
    customerName: { type: Schema.Types.String, required: true },
    body: { type: Schema.Types.String, required: true },
    rate: { type: Schema.Types.Number, required: true },

    fake: { type: Schema.Types.Boolean, default: false }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Review', schema)

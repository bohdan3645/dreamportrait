const mongoose = require('mongoose')
const { Schema } = mongoose
const { removeObject } = require('../services/s3')

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

schema.post('findOneAndRemove', async function (doc) {
  try {
    await removeObject(doc.imageUrl)
  } catch (err) {
    console.error('Error on Review post #findOneAndRemove:', err)
  }
});

module.exports = mongoose.model('Review', schema)

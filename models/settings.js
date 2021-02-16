const mongoose = require('mongoose')
const { Schema } = mongoose

const DEFAULT_SPOTS = 15

const schema = new Schema(
  {
    spots: { type: Schema.Types.Number, default: DEFAULT_SPOTS }
  },
  {
    timestamps: true
  }
)

schema.static('getSettings', async function () {
  let record = await this.findOne({});

  if (!record) {
    record = await this.create({})
  }

  return record
});

schema.static('useSpot', async function () {
  const record = await this.getSettings();
  let spots = --record.spots

  if (spots < 1) {
    spots = DEFAULT_SPOTS
  }

  await this.updateOne({ _id: record._id }, { spots })

  return await this.getSettings()
});

module.exports = mongoose.model('Settings', schema)

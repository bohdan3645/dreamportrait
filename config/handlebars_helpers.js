const Handlebars = require('handlebars');

function stars (count, options) {
  count = count || 1

  let stars = ''
  for (let i = 0; i < count; i++) {
    stars += '<img class="star-rating" src="/images/filled_star.png" alt="star">'
  }

  return new Handlebars.SafeString(`<div class="stars-block">${stars}</div>`);
}

module.exports.stars = stars

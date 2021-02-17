const Review = require('../models/review');
const mongoose = require('mongoose');

const data = [
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/20.jpg',
		customerName: 'Bella',
		body: 'We absolutely Love the art work! Just beautiful! Thank you!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/19.jpg',
		customerName: 'Theresa',
		body: 'Perfecttttt!!!!!!! OMG i\'m so happy thanks Dream Portrait!!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/18.jpg',
		customerName: 'Isabelle',
		body: 'Wedding day',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/17.jpg',
		customerName: 'Charlotte',
		body: 'I absolutely love my picture everything turned out perfect!!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/1.jpg',
		customerName: 'Mia',
		body: 'The picture was super cute! The style was phenomenal and it made for a fantastic birthday present for my husband! It\'s such a unique gift to be able to give to someone and I couldn\'t be happier with it! Thanks dream portrait',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/14.jpg',
		customerName: 'Joe',
		body: 'I just Love itReview Art Image the artist did a great job capturing Ruby\'s personality (or rather purrsonality) Thank you.',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/13.jpg',
		customerName: 'Kelsey',
		body: 'OMG!!!I love it!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/12.jpg',
		customerName: 'Sara',
		body: 'Absolutely perfect. Worth every penny',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/11.jpg',
		customerName: 'Jenny',
		body: 'By far the most unique gift I have ever given someone, thanks Dream Portrait',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/10.jpg',
		customerName: 'Liam',
		body: 'Excellent work! Done in a timely fashion.',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/9.jpg',
		customerName: 'Nicole',
		body: 'Thanks i realy love this Portrait guys!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/8.jpg',
		customerName: 'Annah',
		body: 'Too beautiful thanks a lot Dream Portrait!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/6.jpg',
		customerName: 'Christine',
		body: 'my family is like real, amazing work!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/5.jpg',
		customerName: 'Elisa',
		body: 'Absolutely stunning!! Requested this to be made for my boyfriend as a gift of us as a couple for his birthday and he LOVES it!! So magical every time I look at it! Thank you so much! :)',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/4.jpg',
		customerName: 'Gabriel',
		body: 'Wonderful experience. Did 2 revisions until it was just perfect. Definitely would do this again. Thank you',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/3.jpg',
		customerName: 'Mike',
		body: 'A dream for my family! thank you guys!',
		rate: 5,
		fake: true
	},
	{
		imageUrl: 'https://dream-portrait.s3.eu-central-1.amazonaws.com/photos/reviews/2.jpg',
		customerName: 'Karen',
		body: 'Really pleased with outcome, thanks Dream Portrait, will definetly get another one for my best friend!',
		rate: 5,
		fake: true
	},
]

connect()
createReviews(data)

function createReviews (data) {
	Review.insertMany(data, err => {
		if (err) {
			return console.error(err)
		}

		console.log('Successfully created records.')

		disconnect()
	});
}

function disconnect () {
	 mongoose.disconnect();
}

function connect () {
	const { MONGODB_URI, MONGOUSER, MONGOPASSWORD } = process.env
	console.log(MONGODB_URI)
	const url = MONGODB_URI || `mongodb+srv://${MONGOUSER}:${MONGOPASSWORD}@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority`

	mongoose.connect(url);

	global.db = mongoose.connection
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('opened', _ => console.log('Connected to DB.'))
}

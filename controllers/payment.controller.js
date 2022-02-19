const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const config = require('../config/stripe');
const stripe = require('stripe')(config.secretKey);

exports.index = (req, res) => {
    const fromDate = moment();
    const toDate = moment().add(10, 'years');
    const range = moment().range(fromDate, toDate);

    const years = Array.from(range.by('year')).map(m => m.year());
    const months = moment.monthsShort();

    return res.render('index', { months, years, message: req.flash() });
}

exports.payment = async (req, res) => {
    const token = await createToken(req.body);
    if (token.error) {
        req.flash('danger', token.error)
        return res.redirect('/');
    }
    if (!token.id) {
        req.flash('danger', 'Payment failed.');
        return res.redirect('/');
    }

    const charge = await createCharge(token.id, 2000);
    if (charge && charge.status == 'succeeded') { 
        req.flash('success', 'Payment completed.');
    } else {
        req.flash('danger', 'Payment failed.');
    }
    return res.redirect('/');
}

const createToken = async (cardData) => {
    let token = {};
    try {
        token = await stripe.tokens.create({
            card: {
                number: cardData.cardNumber,
                exp_month: cardData.month,
                exp_year: cardData.year,
                cvc: cardData.cvv
            }
        });
    } catch (error) {
        switch (error.type) {
            case 'StripeCardError':
                token.error = error.message;
                break;
            default:
                token.error = error.message;
                break;
        }
    }
    return token;
}

const createCharge = async (tokenId, amount) => {
    let charge = {};
    try {
        charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: tokenId,
            description: 'My first payment'
        });
    } catch (error) {
        charge.error = error.message;
    }
    return charge;
}
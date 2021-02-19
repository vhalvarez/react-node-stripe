const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const stripe = new Stripe(process.env.KEY_STRIPE)

app.use(express.json())
app.use(cors())

app.post('/api/checkout', async (req, res) => {
    try {
        const { id, amount } = req.body

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'USD',
            description: 'Gaming Keyboard',
            payment_method: id,
            confirm: true,
        })
        console.log(payment)
        res.send({ message: 'Succesfull payment' })
    } catch (error) {
        console.log(error)
        res.json({ message: error.raw.message})
    }
})

app.listen(4000, () => {
    console.log('Server on port', 4000)
})

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
import 'bootswatch/dist/lux/bootstrap.min.css'
import './App.css'

const stripePromise = loadStripe(
    'pk_test_51Ho88OAsW7NcKnFlKRlAXg8a4UZCXH4VNN7nB7BxYJAjA9qJz33OCdyi1l59T6cZZWZ8uVxdGU4BQFpAJqrbDI5c002zZIBZHG'
)

const CheckoutForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)

    const handlerSubmit = async (e) => {
        e.preventDefault()

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        })
        setLoading(true)

        if (!error) {
            const { id } = paymentMethod

            try {
                const { data } = await axios.post(
                    'http://localhost:4000/api/checkout',
                    {
                        id,
                        amount: 10000,
                    }
                )

                console.log(data)

                elements.getElement(CardElement).clear()
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handlerSubmit} className='card card-body'>
            <img
                src='https://images-na.ssl-images-amazon.com/images/I/71yLAJ9iibL._AC_SX466_.jpg'
                alt='Teclado mecanico'
                className='img-fluid'
            />

            <h3 className='text-center my-2'>Price: 100$</h3>

            <div className='form-group'>
                <CardElement className='form-control' />
            </div>

            <button className='btn btn-success' disabled={!stripe}>
                {loading ? (
                    <div className='spinner-border text-success' role='status'>
                        <span className='sr-only'>Loading...</span>
                    </div>
                ) : (
                    'Buy'
                )}
            </button>
        </form>
    )
}

function App() {
    return (
        <Elements stripe={stripePromise}>
            <div className='container p-4'>
                <div className='row'>
                    <div className='col-md-4 offset-md-4'>
                        <CheckoutForm />
                    </div>
                </div>
            </div>
        </Elements>
    )
}

export default App

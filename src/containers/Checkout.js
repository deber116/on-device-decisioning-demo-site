/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"
import { fetchProducts } from '../actions/fetchProducts'
import { fetchCart } from '../actions/fetchCart'
import { deleteCart } from '../actions/deleteCart'

/**
 * Checkout Container Component
 * 
 * Handles the checkout process for cart items.
 * Displays order summary and processes payment completion.
 * 
 * @class Checkout
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of all products from Redux store
 * @param {Object} props.cart - Cart items from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 * @param {Object} props.history - React Router history object
 */
class Checkout extends Component {

  /**
   * Creates an instance of Checkout
   * @param {Object} props - Component props
   */
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Handles the checkout completion
   * Clears the cart and redirects to confirmation page
   * @param {Event} event - Click event
   */
  handleClick(event) {
    this.props.dispatch(deleteCart());
    this.props.history.push('/confirm');
  }

  /**
   * Gets a product by its ID from the products array
   * @param {string|number} id - Product ID to find
   * @returns {Object} Product object or empty object if not found
   */
  getItemById(id) {
    let obj = {}
    this.props.products.map((item) => {
      if (item.id == id) obj = item
    })
    return obj
  }
  /**
   * Calculates the total price of all items in the cart
   * @returns {Array<number>} Array of prices for all cart items
   */
  totalPricesArray() {
    let cartItems = this.props.cart
    let getPricesById = (id) => { return this.getItemById(id).price }
    let prices = []
    Object.keys(this.props.cart).map(function (key) {
      prices.push(getPricesById(cartItems[key].id))
    })
    return prices
  }

  /**
   * Lifecycle method called after component mounts
   * Fetches products and cart data from the API
   */
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchProducts())
    dispatch(fetchCart())
  }
  /**
   * Renders the Checkout component
   * @returns {JSX.Element} The rendered component
   */
  render() {
    let total = this.totalPricesArray().reduce(function (prev, next) {
      return prev + next;
    }, 0)

    return (

      <div>
        <Helmet title="My Cart" />
        <section className="section">
          <div className="container">
            <div className="heading">
              <h1 className="title">Checkout</h1>
            </div>
            <form>
              <h2><span className="badge badge-secondary">Personal Information</span></h2>
              <div className="form-row">
                <div className="col-md-4 mb-2">
                  <label >First name  </label>
                  <input type="text" className="form-control" id="firstname" placeholder="First name" defaultValue="Mark" required />
                </div>
                <div className="col-md-4 mb-2">
                  <label >Last name  </label>
                  <input type="text" className="form-control" id="lastname" placeholder="Last name" defaultValue="Otto" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-8 mb-3">
                  <label >Address 1      </label>
                  <input type="text" className="form-control" id="address1" defaultValue="123 Main Street" placeholder="Address 1" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-8 mb-3">
                  <label >Address 2      </label>
                  <input type="text" className="form-control" id="address2" defaultValue="#1234" placeholder="Address 2" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-2 mb-3">
                  <label >City      </label>
                  <input type="text" className="form-control" id="city" defaultValue="New York" placeholder="City" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >State</label>
                  <input type="text" className="form-control" id="state" defaultValue="NY" placeholder="State" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >Zip          </label>
                  <input type="text" className="form-control" id="zip" defaultValue="10001" placeholder="Zip" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >Country          </label>
                  <input type="text" className="form-control" id="country" defaultValue="USA" placeholder="Country" required />
                </div>
              </div>
              <h2><span className="badge badge-secondary">Credit Card Information</span></h2>
              <div className="form-row">
                <div className="col-md-4 mb-2">
                  <label >First name  </label>
                  <input type="text" className="form-control" id="cfirstname" placeholder="First name" defaultValue="Mark" required />
                </div>
                <div className="col-md-4 mb-2">
                  <label >Last name  </label>
                  <input type="text" className="form-control" id="clastname" placeholder="Last name" defaultValue="Otto" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-2 mb-3">
                  <label >Credit Card Type      </label>
                  <select className="form-control" id="ct">
                    <option>Visa</option>
                    <option>Master Card</option>
                    <option>Maestro</option>
                    <option>Visa Electron</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label >Credit Card Number      </label>
                  <input type="text" className="form-control" id="cc" defaultValue="5500 0000 0000 0004" placeholder="Credit Card Number" required />
                </div>
                <div className="col-md-2 mb-2">
                  <label >CVV</label>
                  <input type="text" className="form-control" id="CVV" defaultValue="1234" placeholder="CVV" required />
                </div>
              </div>
              <h2><span className="badge badge-secondary">Billing Information</span></h2>
              <div className="form-row">
                <div className="col-md-4 mb-2">
                  <label >First name  </label>
                  <input type="text" className="form-control" id="bfirstname" placeholder="First name" defaultValue="Mark" required />
                </div>
                <div className="col-md-4 mb-2">
                  <label >Last name  </label>
                  <input type="text" className="form-control" id="blastname" placeholder="Last name" defaultValue="Otto" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-8 mb-3">
                  <label >Address 1      </label>
                  <input type="text" className="form-control" id="baddress1" defaultValue="123 Main Street" placeholder="Address 1" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-8 mb-3">
                  <label >Address 2      </label>
                  <input type="text" className="form-control" id="baddress2" defaultValue="#1234" placeholder="Address 2" required />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-2 mb-3">
                  <label >City      </label>
                  <input type="text" className="form-control" id="bcity" defaultValue="New York" placeholder="City" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >State</label>
                  <input type="text" className="form-control" id="bstate" defaultValue="NY" placeholder="State" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >Zip          </label>
                  <input type="text" className="form-control" id="bzip" defaultValue="10001" placeholder="Zip" required />
                </div>
                <div className="col-md-2 mb-3">
                  <label >Country          </label>
                  <input type="text" className="form-control" id="bcountry" defaultValue="USA" placeholder="Country" required />
                </div>
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary btn-lg" onClick={this.handleClick}>
                  Pay <span className="badge badge-light">{total} USD</span>  to complete the order
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

    )
  }
}
/**
 * Maps Redux state to component props
 * @param {Object} state - Redux store state
 * @param {Object} state.ProductsReducer - Products reducer state
 * @param {Array} state.ProductsReducer.data - Array of products
 * @param {Object} state.CartReducer - Cart reducer state
 * @param {Object} state.CartReducer.data - Cart items data
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
  return {
    cart: state.CartReducer.data,
    products: state.ProductsReducer.data
  }
}

export default connect(stateProps)(Checkout)

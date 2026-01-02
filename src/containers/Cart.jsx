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
import { removeFromCart } from '../actions/removeFromCart'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'

/**
 * Cart Container Component
 * 
 * Displays the shopping cart with cart items and checkout functionality.
 * Manages cart operations like removing items and calculating totals.
 * 
 * @class Cart
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of all products from Redux store
 * @param {Array} props.cart - Array of cart items from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 */
class Cart extends Component {
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
	 * Handles removing an item from the cart
	 * @param {string|number} key - Cart item key to remove
	 */
	handleTrash(key) {
		const { dispatch } = this.props
		dispatch(removeFromCart(key))
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
	 * Renders the Cart component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		let total = this.totalPricesArray().reduce(function (prev, next) {
			return prev + next;
		}, 0)
		let checkoutButton = total > 0 ? <Link to="/checkout" className="btn btn-primary btn-lg">Checkout your order</Link> : "";
		return (

			<div>
				<Helmet title="My Cart" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">My Cart</h1>
						</div>
						<table className="table">
							<thead>
								<tr>
									<th><abbr>ID</abbr></th>
									<th><abbr>Title</abbr></th>
									<th>Price</th>
									<th>&nbsp;</th>
								</tr>
							</thead>
							<tfoot>
								<tr>
									<th>&nbsp;</th>
									<th>&nbsp;</th>
									<th>Total:{total} USD</th>
									<th>&nbsp;</th>
								</tr>
							</tfoot>
							<tbody>
								{
									Object.keys(this.props.cart).map((key) => {
										return (<CartItem key={key} productKey={key} handleTrash={this.handleTrash.bind(this)} product={this.getItemById(this.props.cart[key].id)} />)
									})
								}
							</tbody>
						</table>
						{checkoutButton}
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

export default connect(stateProps)(Cart)

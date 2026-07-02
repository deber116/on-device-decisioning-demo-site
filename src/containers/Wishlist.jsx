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
import { fetchWishlist } from '../actions/fetchWishlist'
import { fetchProducts } from '../actions/fetchProducts'
import WishlistItem from '../components/WishlistItem'
import { removeFromWishlist } from '../actions/removeFromWishlist'

/**
 * Wishlist Container Component
 * 
 * Displays the user's wishlist with wishlist items and management functionality.
 * Allows users to view and remove items from their wishlist.
 * 
 * @class Wishlist
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of all products from Redux store
 * @param {Array} props.wishlist - Array of wishlist items from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 */
class Wishlist extends Component {
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
	 * Handles removing an item from the wishlist
	 * @param {string|number} key - Wishlist item key to remove
	 */
	handleTrash(key) {
		const { dispatch } = this.props
		dispatch(removeFromWishlist(key))
	}
	/**
	 * Lifecycle method called after component mounts
	 * Fetches products and wishlist data from the API
	 */
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchProducts())
		dispatch(fetchWishlist())
	}
	/**
	 * Renders the Wishlist component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		return (
			<div>
				<Helmet title="My Wishlist" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">My Wishlist</h1>
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
							<tbody>
								{
									Object.keys(this.props.wishlist).map((key) => {
										return (<WishlistItem key={key} productKey={key} handleTrash={this.handleTrash.bind(this)} product={this.getItemById(this.props.wishlist[key].id)} />)
									})
								}
							</tbody>
						</table>
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
 * @param {Object} state.WishlistReducer - Wishlist reducer state
 * @param {Object} state.WishlistReducer.data - Wishlist items data
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
	return {
		wishlist: state.WishlistReducer.data,
		products: state.ProductsReducer.data
	}
}

export default connect(stateProps)(Wishlist)

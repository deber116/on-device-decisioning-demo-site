/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductItem from '../components/ProductItem'
import { fetchProducts } from '../actions/fetchProducts'
import { addToCart } from '../actions/addToCart'
import { addToWishlist } from '../actions/addToWishlist'
import { removeFromWishlist } from '../actions/removeFromWishlist'
import { removeFromCart } from '../actions/removeFromCart'
import { Helmet } from "react-helmet"

/**
 * Products Container Component
 * 
 * Displays a paginated list of all products on the products page.
 * Provides product browsing functionality with cart and wishlist integration.
 * 
 * @class Products
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects from Redux store
 * @param {Array} props.wishlist - Array of wishlist items from Redux store
 * @param {Array} props.cart - Array of cart items from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 */
class Products extends Component {
	/**
	 * Creates an instance of Products
	 * @param {Object} props - Component props
	 */
	constructor(props) {
		super(props);
		/**
		 * @type {Object}
		 * @property {number} currentPage - Current page number for pagination
		 * @property {number} productsPerPage - Number of products to display per page
		 */
		this.state = {
			currentPage: 1,
			productsPerPage: 8
		};
	}

	/**
	 * Adds a product to the shopping cart
	 * @param {string|number} id - Product ID to add to cart
	 * @param {Object} target - Adobe Target context object
	 */
	addToCart(id, target) {
		const { dispatch } = this.props
		dispatch(addToCart(id, target))
	}

	/**
	 * Adds a product to the wishlist
	 * @param {string|number} id - Product ID to add to wishlist
	 * @param {Object} target - Adobe Target context object
	 */
	addToWishlist(id, target) {
		const { dispatch } = this.props
		dispatch(addToWishlist(id, target))
	}

	/**
	 * Removes a product from the wishlist
	 * @param {string|number} id - Product ID to remove from wishlist
	 * @param {Object} target - Adobe Target context object
	 */
	removeFromWishlist(id, target) {
		const { dispatch } = this.props
		dispatch(removeFromWishlist(id, target))
	}

	/**
	 * Removes a product from the shopping cart
	 * @param {string|number} id - Product ID to remove from cart
	 * @param {Object} target - Adobe Target context object
	 */
	removeFromCart(id, target) {
		const { dispatch } = this.props
		dispatch(removeFromCart(id, target))
	}

	/**
	 * Handles pagination page changes
	 * @param {number} pageNumber - The page number to navigate to
	 */
	handlePageChange(pageNumber) {
		this.setState({ currentPage: pageNumber });
	}

	/**
	 * Lifecycle method called after component mounts
	 * Fetches products from the API
	 */
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchProducts())
	}
	/**
	 * Renders the Products component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		const { products } = this.props;
		const { currentPage, productsPerPage } = this.state;

		// Calculate pagination
		const totalPages = Math.ceil(products.length / productsPerPage);
		const startIndex = (currentPage - 1) * productsPerPage;
		const endIndex = startIndex + productsPerPage;
		const currentProducts = products.slice(startIndex, endIndex);

		/**
		 * Slider configuration for the product carousel
		 * @type {Object}
		 */
		const settings = {
			dots: true,
			speed: 500,
			autoplay: true,
			autoplaySpeed: 3000,
			infinite: true
		};

		return (

			<div>
				<Helmet title="Home" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">Products</h1>
							<div className="columns is-multiline">
								{currentProducts.map((product) => {
									return <ProductItem key={product.id}
										product={product}
										addToCart={this.addToCart.bind(this)}
										addToWishlist={this.addToWishlist.bind(this)}
										removeFromWishlist={this.removeFromWishlist.bind(this)}
										removeFromCart={this.removeFromCart.bind(this)}
										wishlist={this.props.wishlist}
										cart={this.props.cart}
									/>
								})}
							</div>

							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className="pagination-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
									<nav className="pagination is-centered" role="navigation" aria-label="pagination">
										<button
											className="pagination-previous"
											disabled={currentPage === 1}
											onClick={this.handlePageChange.bind(this, currentPage - 1)}
										>
											Previous
										</button>
										<button
											className="pagination-next"
											disabled={currentPage === totalPages}
											onClick={this.handlePageChange.bind(this, currentPage + 1)}
										>
											Next
										</button>
										<ul className="pagination-list">
											{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
												<li key={page}>
													<button
														className={`pagination-link ${currentPage === page ? 'is-current' : ''}`}
														onClick={this.handlePageChange.bind(this, page)}
													>
														{page}
													</button>
												</li>
											))}
										</ul>
									</nav>
									<p className="has-text-centered" style={{ marginTop: '1rem', color: '#666' }}>
										Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
									</p>
								</div>
							)}
						</div>
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
 * @param {Array} state.WishlistReducer.data - Array of wishlist items
 * @param {Object} state.CartReducer - Cart reducer state
 * @param {Array} state.CartReducer.data - Array of cart items
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
	return {
		products: state.ProductsReducer.data,
		wishlist: state.WishlistReducer.data,
		cart: state.CartReducer.data
	}
}
export default connect(stateProps)(Products)

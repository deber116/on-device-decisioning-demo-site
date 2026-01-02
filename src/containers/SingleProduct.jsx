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
import { fetchProduct } from '../actions/fetchProduct'
import { addToCart } from '../actions/addToCart'
import { addToWishlist } from '../actions/addToWishlist'
import { removeFromWishlist } from '../actions/removeFromWishlist'
import { removeFromCart } from '../actions/removeFromCart'

/**
 * SingleProduct Container Component
 * 
 * Displays detailed information for a single product with cart and wishlist functionality.
 * Shows product details, images, and allows users to add/remove from cart and wishlist.
 * 
 * @class SingleProduct
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Object} props.product - Single product object from Redux store
 * @param {Array} props.wishlist - Array of wishlist items from Redux store
 * @param {Array} props.cart - Array of cart items from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 * @param {Object} props.match - React Router match object
 * @param {Object} props.match.params - Route parameters
 * @param {string} props.match.params.id - Product ID from URL
 */
class SingleProduct extends Component {
    /**
     * Creates an instance of SingleProduct
     * @param {Object} props - Component props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Lifecycle method called after component mounts
     * Fetches the specific product by ID from the API
     */
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchProduct(this.props.match.params.id))
    }
    /**
     * Checks if a product is in the wishlist
     * @param {string|number} id - Product ID to check
     * @returns {boolean|null} True if in wishlist, null otherwise
     */
    checkWishlist(id) {
        let check = null
        Object.keys(this.props.wishlist).map((key) => {
            if (this.props.wishlist[key].id == id) check = true
        })
        return check
    }

    /**
     * Checks if a product is in the cart
     * @param {string|number} id - Product ID to check
     * @returns {boolean|null} True if in cart, null otherwise
     */
    checkCart(id) {
        let check = null
        Object.keys(this.props.cart).map((key) => {
            if (this.props.cart[key].id == id) check = true
        })
        return check
    }

    /**
     * Gets the key for a product in the wishlist by ID
     * @param {string|number} id - Product ID to find
     * @returns {string} Wishlist key or empty string if not found
     */
    getKeyByIdForWl(id) {
        let productKey = ''
        Object.keys(this.props.wishlist).map((key) => {
            if (this.props.wishlist[key].id == id) productKey = key
        })
        return productKey
    }

    /**
     * Gets the key for a product in the cart by ID
     * @param {string|number} id - Product ID to find
     * @returns {string} Cart key or empty string if not found
     */
    getKeyByIdForCart(id) {
        let productKey = ''
        Object.keys(this.props.cart).map((key) => {
            if (this.props.cart[key].id == id) productKey = key
        })
        return productKey
    }

    /**
     * Renders the SingleProduct component
     * @returns {JSX.Element} The rendered component
     */
    render() {
        return (

            <div key="ProductViewPage">
                <Helmet
                    title={this.props.product.title}
                    meta={
                        [
                            { property: "og:type", content: "article" },
                            { property: "og:title", content: this.props.product.title },
                            { property: "og:image", content: this.props.product.image },
                            { property: "og:description", content: this.props.product.description }
                        ]
                    }
                />
                <section className="section">
                    <div className="container">

                        <div className="columns">
                            <div className="column is-half">
                                <img src={this.props.product.image} width="100%" />
                            </div>
                            <div className="column is-half">
                                <h1 className="title">{this.props.product.title}</h1>
                                <h3><b>Price:{this.props.product.price} USD</b></h3>
                                <br />
                                <p>{this.props.product.description}</p>
                                <button data-track-action='link-click' data-track="analytics" data-link-name={`${(this.checkCart(this.props.product.id)) ? 'remove-from-cart' : 'add-to-cart'}`} className={`button btn-margin ${(this.checkCart(this.props.product.id)) ? 'is-info' : 'is-success'}`} onClick={(event) => {
                                    (this.checkCart(this.props.product.id)) ?
                                        this.props.dispatch(removeFromCart(this.getKeyByIdForCart(this.props.product.id), event.target)) :
                                        this.props.dispatch(addToCart(this.props.product.id, event.target))
                                }
                                }  >
                                    {`${(this.checkCart(this.props.product.id)) ? 'Remove from Cart' : 'Add to Cart'}`}
                                </button>
                                <button data-track-action='link-click' data-track='analytics' data-link-name={`${(this.checkWishlist(this.props.product.id)) ? 'remove-from-wishlist' : 'add-to-wishlist'}`} className={`button btn-margin ${(this.checkWishlist(this.props.product.id)) ? 'is-info' : 'is-primary'}`}
                                    onClick={(event) => {
                                        (this.checkWishlist(this.props.product.id)) ?
                                            this.props.dispatch(removeFromWishlist(this.getKeyByIdForWl(this.props.product.id), event.target)) :
                                            this.props.dispatch(addToWishlist(this.props.product.id, event.target))
                                    }} >
                                    {`${(this.checkWishlist(this.props.product.id)) ? 'Remove from Wishlist' : 'Add to Wishlist'}`}
                                </button>
                            </div>

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
 * @param {Object} state.ProductReducer - Product reducer state
 * @param {Object} state.ProductReducer.data - Single product data
 * @param {Object} state.WishlistReducer - Wishlist reducer state
 * @param {Object} state.WishlistReducer.data - Wishlist items data
 * @param {Object} state.CartReducer - Cart reducer state
 * @param {Object} state.CartReducer.data - Cart items data
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
    return {
        cart: state.CartReducer.data,
        wishlist: state.WishlistReducer.data,
        product: state.ProductReducer.data
    }
}
export default connect(stateProps)(SingleProduct)

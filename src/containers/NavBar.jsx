/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart } from '../actions/fetchCart'
import { fetchWishlist } from '../actions/fetchWishlist'

/**
 * Create NavBar Container
 */
class NavBar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showBar: false
		}
	}
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchCart())
		dispatch(fetchWishlist())
	}
	componentDidUpdate() {

	}
	toggleNavBar() {
		if (this.state.showBar) {
			this.setState({
				showBar: false
			})
		} else {
			this.setState({
				showBar: true
			})
		}
	}
	render() {
		return (

			<div>
				<nav className="nav has-shadow">
					<div className="container">
						<div className="nav-left">
							<Link to="/" className="nav-item">
								<img src="/assets/images/logo.png" title="A Shop" alt="A Shop" />
							</Link>
						</div>
						<div className={`nav-right nav-menu ${(this.state.showBar) ? 'is-active' : ''}`}>
							<Link to="/" className="nav-item">
								Home
							</Link>
							<Link to="/products" className="nav-item">
								Products
							</Link>
							<Link to="/tools" className="nav-item">
								Tools
							</Link>
							<Link to="/help" className="nav-item">
								Help
							</Link>
							<div key="NavBarCart" className="nav-item">
								<Link to="/cart" className="button menu" >
									<span className="icon">
										<i className="fa fa-cart-arrow-down" aria-hidden="true"></i>
									</span>
									<span className="tag is-light">{Object.keys(this.props.cart).length}</span>
								</Link>
								<Link to="/wishlist" className="button menu">
									<span className="icon">
										<i className="fa fa-thumbs-up" aria-hidden="true"></i>
									</span>
									<span className="tag is-light">{Object.keys(this.props.wishlist).length}</span>
								</Link>
							</div>
						</div>
					</div>
				</nav>
				<br></br>
			</div>

		)
	}
}
/**
 * Insert Props Into Component
 */
const stateProps = (state) => {
	return {
		cart: state.CartReducer.data,
		wishlist: state.WishlistReducer.data
	}
}

export default connect(stateProps)(NavBar)

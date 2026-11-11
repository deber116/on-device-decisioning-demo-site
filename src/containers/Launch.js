/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchLaunch } from '../actions/fetchLaunch'
import { Helmet } from "react-helmet"

/**
 * Documentation Container Component
 * 
 * Displays documentation and help information.
 * 
 * @class Launch
 * @extends {Component}
 */
class Launch extends Component {
	/**
	 * Renders the Documentation component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		return (

			<div>
				<Helmet title="Documentation" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">
								Documentation & Help
							</h1>
						</div>
						<p>
							Welcome to A Shop! This is a demo e-commerce application built with modern web technologies.
						</p>
						<br />
						<h2 className="subtitle">Features</h2>
						<ul>
							<li>Browse products and view details</li>
							<li>Add items to your shopping cart</li>
							<li>Save items to your wishlist</li>
							<li>Secure checkout process (demo only - no real transactions)</li>
						</ul>
						<br />
						<p><strong>Note:</strong> All transactions on this site are simulated for demonstration purposes only.</p>
					</div>
				</section>
			</div>

		)
	}
}
/**
 * Maps Redux state to component props
 * @param {Object} state - Redux store state
 * @param {Object} state.LaunchReducer - Launch reducer state
 * @param {Object} state.LaunchReducer.data - Launch content data
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
	return {
		about: state.LaunchReducer.data
	}
}

export default connect(stateProps)(Launch)

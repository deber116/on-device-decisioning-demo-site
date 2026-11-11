/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchAbout } from '../actions/fetchAbout'
import { Helmet } from "react-helmet"

/**
 * About Container Component
 * 
 * Displays information about the shop and available tools.
 * 
 * @class About
 * @extends {Component}
 */
class About extends Component {
	/**
	 * Renders the About component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		return (

			<div>
				<Helmet title="Developer Tools" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">
								Developer Tools
							</h1>
						</div>
						<p>
							This demo storefront showcases a server-side-rendered React application with Express.
							It includes features like shopping cart management, product browsing, and wishlist functionality.
						</p>
						<br />
						<h2 className="subtitle">Technology Stack</h2>
						<ul>
							<li>React 16 with server-side rendering</li>
							<li>Redux for state management</li>
							<li>Express.js backend</li>
							<li>Webpack build system</li>
						</ul>
					</div>
				</section>
			</div>

		)
	}
}
/**
 * Maps Redux state to component props
 * @param {Object} state - Redux store state
 * @param {Object} state.AboutReducer - About reducer state
 * @param {Object} state.AboutReducer.data - About content data
 * @returns {Object} Props object for the component
 */
const stateProps = (state) => {
	return {
		about: state.AboutReducer.data
	}
}

export default connect(stateProps)(About)

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
 * Displays information about the Adobe Target SDKs and their capabilities.
 * Fetches and renders about content from the API.
 * 
 * @class About
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Object} props.about - About content from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 */
class About extends Component {
	/**
	 * Creates an instance of About
	 * @param {Object} props - Component props
	 */
	constructor(props) {
		super(props);
		// this.converter = new ReactHTMLConverter();
		// this.converter.registerComponent('helmet', Helmet);
	}

	/**
	 * Lifecycle method called after component mounts
	 * Fetches about content from the API
	 */
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchAbout())
	}
	/**
	 * Renders the About component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		return (

			<div>
				<Helmet title="About Demo" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">
								{/* {this.props.about.title} */}
								SDK Details
							</h1>
						</div>
						<p>
							{/* {this.props.about.content} */}
							This page will list all the Adobe Target SDK locations for various platforms
						</p>
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

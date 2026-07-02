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
 * Launch Container Component
 * 
 * Displays information about Adobe Launch and its capabilities.
 * Fetches and renders launch content from the API.
 * 
 * @class Launch
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {Object} props.launch - Launch content from Redux store
 * @param {Function} props.dispatch - Redux dispatch function
 */
class Launch extends Component {
	/**
	 * Lifecycle method called after component mounts
	 * Fetches launch content from the API
	 */
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchLaunch());
	}

	/**
	 * Renders the Launch component
	 * @returns {JSX.Element} The rendered component
	 */
	render() {
		return (

			<div>
				<Helmet title="About Launch by Adobe" />
				<section className="section">
					<div className="container">
						<div className="heading">
							<h1 className="title">
								{/* {this.props.about.title} */}
								Documentation details.
							</h1>
						</div>
						<p>
							{/* {this.props.about.content} */}
							This page will list the URLs for documentation on Adobe Target On Device Decisioning.
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

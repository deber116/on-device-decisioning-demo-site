/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
/**
 * Create WishlistItem Component
 */
class CartItem extends Component {
    render() {
        const product = this.props.product || {}
        return (
            <tr>
                <td>
                    <article className="media cart-item">
                        <figure className="media-left">
                            {product.image ? <img className="cart-item-thumb" src={product.image} alt={product.title || 'Cart item'} /> : null}
                        </figure>
                        <div className="media-content">
                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                        </div>
                    </article>
                </td>
                <td className="cart-item-price">{product.price} USD</td>
                <td>
                    <a href="#" className="button is-danger is-outlined" onClick={(e) => {
                        e.preventDefault()
                        this.props.handleTrash(this.props.productKey)
                    }}>
                        <span className="icon is-small"> <i className="fa fa-trash" aria-hidden="true"></i> </span>
                    </a>
                </td>
            </tr>
        )
    }
}

export default CartItem

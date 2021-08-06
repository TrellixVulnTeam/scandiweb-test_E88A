import React from "react";
import { currenciesSymbols } from "../../constants";
import { toggleCart } from "../../redux/actions/cart";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class Cart extends React.Component {

    stringCount() {
        const count = this.props.cartItems.length;
        return `${count} item${count !== 1 ? 's' : ''}`;
    }

    sumPrice() {
        let sum = 0;
        for (let product of this.props.cartItems) {
            sum += product.prices.find(price => price.currency === this.props.selectedCurrency).amount;
        }

        return sum;
    }

    render() {
        return (
            <div className="cart-dd-wrapper">
                <img alt="" className={this.props.isCartOpen ? "cart-open" : "cart"} src="../../empty-cart.svg" onClick={() => {
                    this.props.toggleCart();
                }}></img>
                {(this.props.isCartOpen) && <div role="list" className="cart-list">
                    <div className="cart-wrapper">
                        <p className="cart-title"><b>My bag</b>, {this.stringCount()}</p>
                        {
                            this.props.cartItems.map(cartItem => <div className="cart-popup-item">
                                <div className="cart-popup-info">
                                    <p>{cartItem.brand}</p>
                                    <p>{cartItem.name}</p>
                                    <p>{currenciesSymbols[this.props.selectedCurrency] || '$'}
                                        <b>{cartItem.prices.find(price => price.currency === this.props.selectedCurrency).amount}</b></p>
                                    <div className="cart-popup-attributes">
                                        {
                                            cartItem.attributes.map(attribute => <div>
                                                {
                                                    attribute.items.map(attr => <button
                                                        className={Object.values(cartItem.attrValues).includes(attr.value) ? 'attribute-text-active-cart' : 'attribute-button-cart'}
                                                        style={{ ...attribute.type === "swatch" ? { backgroundColor: attr.value } : "" }}
                                                    >{attribute.type === "swatch" ? "" : attr.value}</button>
                                                    )}
                                            </div>)
                                        }
                                    </div>
                                </div>
                                <div className="cart-popup-image">
                                    <div className="cart-popup-amount">
                                        <button className="cart-popup-button">
                                            +
                                        </button>
                                        <p>1</p>
                                        <button className="cart-popup-button">
                                            -
                                        </button>
                                    </div>
                                    <div className="img-wrapper">
                                        <img alt="" src={cartItem.gallery[0]}></img>
                                    </div>
                                </div>
                            </div>
                            )
                        }
                        <p className="cart-popup-total">Total: <b>{currenciesSymbols[this.props.selectedCurrency] || '$'}{this.sumPrice().toFixed(2)}</b></p>
                        <div className="cart-buttons">
                            <NavLink to={`/cart`}>
                                <button>view bag</button>
                            </NavLink>
                            <button className="cart-popup-green-button">check out</button>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        isCartOpen: state.cart.isOpen,
        selectedCurrency: state.currencies.selected,
        cartItems: state.cart.list,
    };
};

export default connect(
    mapStateToProps,
    { toggleCart }
)(Cart);

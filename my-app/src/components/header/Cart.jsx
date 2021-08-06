import React from "react";
import { currenciesSymbols } from "../../constants";
import { toggleCart, addCartItem, removeCartItem } from "../../redux/actions/cart";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class Cart extends React.Component {

    stringCount() {
        const count = this.props.cartItems.length;
        return `${count} item${count !== 1 ? 's' : ''}`;
    }

    numberCount() {
        const count = this.props.cartItems.length;
        return count;
    }

    countCartItems(itemId) {
        const counts = {};
        this.props.cartItems.forEach(function (x) { counts[x.id] = (counts[x.id] || 0) + 1; });
        return counts[itemId]
    }

    getProductsSet() {
        const itemsSet = new Set(this.props.cartItems.map(item => JSON.stringify(item)))
        const productsSet = [];
        itemsSet.forEach(item => productsSet.push(JSON.parse(item)));
        return productsSet;
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
            <div className={this.props.isCartOpen ? "cart-open" : "cart-image-circle-container"}>
                {this.numberCount() > 0 && <div className="products-number-circle">{this.numberCount()}</div>}
                    <img alt="" className="cart" src="../../empty-cart.svg" onClick={() => {
                        this.props.toggleCart();
                    }}></img>
            </div>
            
                {(this.props.isCartOpen) && <div role="list" className="cart-list">
                    <div className="cart-wrapper">
                        <p className="cart-title"><b>My bag</b>, {this.stringCount()}</p>
                        {
                            this.getProductsSet().map(cartItem => <div className="cart-popup-item">
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
                                                        style={{
                                                            ...attribute.type === "swatch"
                                                                ? { backgroundColor: attr.value } : ""
                                                        }}
                                                    >{attribute.type === "swatch" ? "" : attr.value}</button>
                                                    )}
                                            </div>)
                                        }
                                    </div>
                                </div>
                                <div className="cart-popup-image">
                                    <div className="cart-popup-amount">
                                        <button className="cart-popup-button"
                                            onClick={() => {
                                                this.props.addCartItem({ ...cartItem, attrValues: cartItem.attrValues });
                                            }}>
                                            +
                                        </button>
                                        <p>{this.countCartItems(cartItem.id)}</p>
                                        <button className="cart-popup-button" onClick={() => {
                                            this.props.removeCartItem(cartItem);
                                        }}>
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
                            <NavLink to={'/cart'}>
                                <button onClick={() => { this.props.toggleCart() }}>view bag</button>
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
    { toggleCart, addCartItem, removeCartItem }
)(Cart);

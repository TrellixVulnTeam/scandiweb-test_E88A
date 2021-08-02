import { Header } from "./components/header/Header";
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
} from "react-router-dom";
import CategoryPage from "./components/category/CategoryPage";
import { connect } from "react-redux";
import { requestCategories, selectCategory } from "./redux/actions/categories";
import { requestProducts } from "./redux/actions/products";
import React from "react";

export class App extends React.Component {
    componentDidMount() {
        this.props.requestCategories();
        this.props.requestProducts();
        console.log(this.props)
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Header categories={this.props.categories} 
                    selectedCategory={this.props.selectedCategory} 
                    selectCategory={this.props.selectCategory}
                    />
                    <Switch>
                    {this.props.categories.length > 0 && <React.Fragment>
                        <Route path='/:category' render={
                            props => this.props.categories.includes(props.match.params.category) ? 
                                <CategoryPage selectedCurrency={this.props.selectedCurrency} selectedCategory={props.match.params.category} products={this.props.products} /> :
                                <Redirect to={"/" + this.props.categories[0]} />
                        } />
                        <Route exact path='/'>
                            <Redirect to={"/" + this.props.categories[0]} />
                        </Route>
                    </React.Fragment>}
                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { ...state.categories, ...state.products, ...state.currencies, ...state.prices };
};

export default connect(
    mapStateToProps,
    { requestCategories, selectCategory, requestProducts }
)(App);

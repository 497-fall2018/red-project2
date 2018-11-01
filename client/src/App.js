import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import PageContainer from './components/pageContainer.js';

const diningHallQuery = gql`
  {
    foods {
      id,
      name,
      rating,
      diningHall
    }
  }
`

const diningFoods = [
  {_id: "1", name: "Hamburger", rank: "1", diningHall: "Plex", price: "3.00"},
  {_id: "2", name: "Chicken", rank: "2", diningHall: "Hinman", price: "3.00"},
  {_id: "3", name: "Cream Pasta", rank: "3", diningHall: "Sargeant", price: "3.00"},
  {_id: "4", name: "Hot Cookie", rank: "4", diningHall: "Hinman", price: "3.00"},
  {_id: "5", name: "Bananas", rank: "5", diningHall: "Plex", price: "3.00"}
]

const nonDiningFoods = [
  {_id: "1", name: "Ramen", rank: "1", diningHall: "Asiana Foodville", price: "3.00"},
  {_id: "2", name: "Hot Chicken", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00"},
  {_id: "3", name: "Meatball Sandwich", rank: "3", diningHall: "Lisa's", price: "3.00"},
  {_id: "4", name: "Quesadillas", rank: "4", diningHall: "Lisa's", price: "3.00"},
  {_id: "5", name: "Fries", rank: "5", diningHall: "Wildcat Deli", price: "3.00"}
]

const diningHallFoods = [
  {_id: "1", name: "Apples ", rank: "1", diningHall: "Asiana Foodville", price: "3.00"},
  {_id: "2", name: "Oranges", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00"},
  {_id: "3", name: "Bananas", rank: "3", diningHall: "Lisa's", price: "3.00"},
  {_id: "4", name: "Peaches", rank: "4", diningHall: "Lisa's", price: "3.00"},
  {_id: "5", name: "Mangoes", rank: "5", diningHall: "Wildcat Deli", price: "3.00"}
]

class App extends Component {
  render() {
    // const { data: { loading, foods }} = this.props;
    return (
      <PageContainer
        diningFoods={diningFoods}
        nonDiningFoods={nonDiningFoods}
        diningHallFoods={diningHallFoods}
      />
    );
  }
}

export default App;
// export default graphql(diningHallQuery)(App);

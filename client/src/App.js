import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import HomePage from './components/homePage.js';

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

class App extends Component {
  render() {
    const { data: { loading, foods }} = this.props;
    if (loading) {
      return (
        <div className="App">
          loading
        </div>
      );
    } else {
      return (
        <HomePage
          foodItems={foods}
        />
      );
    }
  }
}

export default graphql(diningHallQuery)(App);

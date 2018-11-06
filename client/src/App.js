import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import PageContainer from './components/pageContainer.js';
import {sort} from './components/utils/sort'

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
  state={
    diningFoods : [
      {_id: "1", name: "Hamburger", rank: "1", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:1,},
      {_id: "2", name: "Chicken", rank: "2", diningHall: "Hinman", price: "3.00",thumbup:5,thumbdown:0},
      {_id: "3", name: "Cream Pasta", rank: "3", diningHall: "Sargeant", price: "3.00",thumbup:5,thumbdown:3},
      {_id: "4", name: "Hot Cookie", rank: "4", diningHall: "Hinman", price: "3.00",thumbup:5,thumbdown:5},
      {_id: "5", name: "Bananas", rank: "5", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "6", name: "Apples", rank: "5", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:2},
    ],
    
    nonDiningFoods : [
      {_id: "1", name: "Ramen", rank: "1", diningHall: "Asiana Foodville", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "2", name: "Hot Chicken", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "3", name: "Meatball Sandwich", rank: "3", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "4", name: "Quesadillas", rank: "4", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "5", name: "Fries", rank: "5", diningHall: "Wildcat Deli", price: "3.00",thumbup:5,thumbdown:2}
    ],
    
    diningHallFoods : [
      {_id: "1", name: "Apples ", rank: "1", diningHall: "Asiana Foodville", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "2", name: "Oranges", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "3", name: "Bananas", rank: "3", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "4", name: "Peaches", rank: "4", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "5", name: "Mangoes", rank: "5", diningHall: "Wildcat Deli", price: "3.00",thumbup:5,thumbdown:2}
    ],}

    
    handleIncrement=(food)=>{
      console.log(food)
      let foodCopy = JSON.parse(JSON.stringify(this.state.diningFoods));
      for (var i = 0; i < foodCopy.length; i++) {
        if (foodCopy[i]._id == food._id) {
          foodCopy[i].thumbup++;
        }
      }
      this.setState({diningFoods:foodCopy});

      // const foods=[this.state.diningFoods];
      // const index =foods.indexOf(food);
      // foods[index]={...foods};
      // foods[index].thumbup+=1;
      // this.setState({diningFoods:foods});
    };

    handleDecrement=(food)=>{
      console.log(food)
      let foodCopy = JSON.parse(JSON.stringify(this.state.diningFoods));
      for (var i = 0; i < foodCopy.length; i++) {
        if (foodCopy[i]._id == food._id) {
          foodCopy[i].thumbdown++;
        }
      }
      this.setState({diningFoods:foodCopy});
    };

  
  render() {
    // const { data: { loading, foods }} = this.props;
    const {diningFoods:allDiningFoods,
      nonDiningFoods:allNonDiningFoods,
      diningHallFoods:allDiningHallFoods
    }=this.state;
    const sortedDiningFoods=sort(allDiningFoods);
    const diningFoods = sortedDiningFoods.slice(0,5);
    const sortedNonDiningFoods=sort(allNonDiningFoods);
    const nonDiningFoods = sortedNonDiningFoods.slice(0,5);
    const sortedDiningHallFoods=sort(allDiningHallFoods);
    const  diningHallFoods = sortedDiningHallFoods.slice(0,5);
    return (
      <PageContainer
        diningFoods={diningFoods}
        nonDiningFoods={nonDiningFoods}
        diningHallFoods={diningHallFoods}
        onIncrement={this.handleIncrement}
        onDecrement={this.handleDecrement}
      />
    );
  }
}

export default App;
// export default graphql(diningHallQuery)(App);

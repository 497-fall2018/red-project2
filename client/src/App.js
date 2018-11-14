import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql, compose, withApollo } from 'react-apollo';
import PageContainer from './components/pageContainer.js';
import {sort} from './components/utils/sort'
import moment from 'moment'

var request = require('request');


const TopFoodsOverall= gql`
  query topFoods($num: Int!, $isHall: Boolean!, $date: String!, $timeOfDay: String!) {
    topFoods(num: $num, isHall: $isHall, date: $date, timeOfDay: $timeOfDay) {
      id
      name
      thumbsUp
      thumbsDown
      diet
      dining {
        name
      }
    }
  }
`

class App extends Component {
  state = {
    // diningFoods : [
    //   {_id: "1", name: "Hamburger", rank: "1", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:1,},
    //   {_id: "2", name: "Chicken", rank: "2", diningHall: "Hinman", price: "3.00",thumbup:5,thumbdown:0},
    //   {_id: "3", name: "Cream Pasta", rank: "3", diningHall: "Sargeant", price: "3.00",thumbup:5,thumbdown:3},
    //   {_id: "4", name: "Hot Cookie", rank: "4", diningHall: "Hinman", price: "3.00",thumbup:5,thumbdown:5},
    //   {_id: "5", name: "Bananas", rank: "5", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:2},
    //   {_id: "6", name: "Apples", rank: "5", diningHall: "Plex", price: "3.00",thumbup:5,thumbdown:2},
    // ],

    // nonDiningFoods : [
    //   {_id: "1", name: "Ramen", rank: "1", diningHall: "Asiana Foodville", price: "3.00",thumbup:5,thumbdown:2},
    //   {_id: "2", name: "Hot Chicken", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00",thumbup:5,thumbdown:2},
    //   {_id: "3", name: "Meatball Sandwich", rank: "3", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
    //   {_id: "4", name: "Quesadillas", rank: "4", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
    //   {_id: "5", name: "Fries", rank: "5", diningHall: "Wildcat Deli", price: "3.00",thumbup:5,thumbdown:2}
    // ],
    topDiningFoods: [],
    topNonDiningFoods: [],
    diningHallFoods : [
      {_id: "1", name: "Apples ", rank: "1", diningHall: "Asiana Foodville", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "2", name: "Oranges", rank: "2", diningHall: "Budlong Hot Chicken", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "3", name: "Bananas", rank: "3", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "4", name: "Peaches", rank: "4", diningHall: "Lisa's", price: "3.00",thumbup:5,thumbdown:2},
      {_id: "5", name: "Mangoes", rank: "5", diningHall: "Wildcat Deli", price: "3.00",thumbup:5,thumbdown:2}
    ],
  }




  handleIncrement= (foodId)=>{
    this.props.thumbsUp(foodId)
  };

  handleDecrement= (foodId)=>{
    this.props.thumbsDown(foodId)
  }


/*
  handleIncrement=(food)=>{
    let foodCopy = JSON.parse(JSON.stringify(this.state.diningFoods));
    for (var i = 0; i < foodCopy.length; i++) {
      if (foodCopy[i]._id == food._id) {
        foodCopy[i].thumbup++;
      }
    }
    this.setState({diningFoods:foodCopy});
  };



  handleDecrement=(food)=>{
    let foodCopy = JSON.parse(JSON.stringify(this.state.diningFoods));
    for (var i = 0; i < foodCopy.length; i++) {
      if (foodCopy[i]._id == food._id) {
        foodCopy[i].thumbdown++;
      }
    }
    this.setState({diningFoods:foodCopy});
  };
*/



// topFoodsOverall = (num, isHall) => {
//     return (this.props.topFoodsOverall({
//       variables: {
//         num: num,
//         isHall: isHall,
//         date: moment().format("YYYY-MM-D"),
//         timeOfDay: "Breakfast" // use moment to determine breakfast, lunch, or dinner
//       },
//   }));
// }

// topFoodsOverall = (num, isHall, date, timeOfDay) => {
//   return (this.props.topFoodsOverall({
//     variables: {
//       num: num,
//       isHall: isHall,
//       date: date,
//       timeOfDay: timeOfDay
//     },
// }));
// }

// topFoodsOverall = (num, isHall, date, timeOfDay) => {
//   this.props.topFoodsOverall({
//     variables: {
//       num,
//       isHall,
//       date,
//       timeOfDay
//     },
//   }).then(({ data }) => {
//     if (isHall) {
//       this.setState({ topDiningFoods: data.topFoods });
//     }
//     else {
//       this.setState({ topNonDiningFoods: data.topFoods });
//     }
//   }).catch((error) => {
//     console.log(error);
//   });
// }

topFoodsOverall = (num, isHall, date, timeOfDay) => {
  this.props.client.query({
    query: TopFoodsOverall,
    variables: {
      num,
      isHall,
      date,
      timeOfDay
    },
  }).then(({ data }) => {
    console.log(data)
    if (isHall) {
      this.setState({ topDiningFoods: data.topFoods });
    }
    else {
      this.setState({ topNonDiningFoods: data.topFoods });
    }
  }).catch((error) => {
    console.log(error);
  });
}


  getTop5Dining = () => this.topFoodsOverall(5, true, "2018-11-13", "Breakfast")
  getTop5NonDining = () => this.topFoodsOverall(5, false, "2018-11-13", "Breakfast")

  // does one time when the component is first rendered
  componentDidMount() {
    {this.getTop5Dining()}
    {this.getTop5NonDining()}
  }

  render() {
    // const { data: { loading, foods }} = this.props;
    // const {
    //   topDiningFoods:diningFoods,
    //   topNonDiningFoods:diningFoods,
    //   diningHallFoods:allDiningHallFoods
    // } = this.state;

    return (
      <PageContainer
        diningFoods={this.state.topDiningFoods}
        nonDiningFoods={this.state.topNonDiningFoods}
        diningHallFoods={this.state.allDiningHallFoods}
        onIncrement={this.handleIncrement}
        onDecrement={this.handleDecrement}
      />
    );
  }
}
export default compose(
  graphql(ThumbsUp, { name: 'thumbsUp' })
)(App);
// explanation:
// makes the TopFoodsOverall query a prop for App component; the prop can be accessed as this.props.topFoodsOverall
// this.topFoodsOverall is a function defined for App using that query

//export default withApollo(AppWithData) if only queries??
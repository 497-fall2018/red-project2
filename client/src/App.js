import React, { Component } from 'react';
import './App.css';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PageContainer from './components/pageContainer.js';

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
const ThumbsUp = gql`
  mutation thumbsUp($id: ID!) {
    thumbsUp(id: $id)
  }
`
const ThumbsDown = gql`
  mutation thumbsDown($id: ID!) {
    thumbsDown(id: $id)
  }
`

class App extends Component {
  state = {
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

  // handleThumbsUp = (foodId) => {
  //   this.props.thumbsUp({
  //     variables: {
  //       id: foodId
  //     },
  //     refetchQueries: [{
  //       query: TopFoodsOverall,
  //       variables: {
  //         num: 5,
  //         isHall: true,
  //         date: "2018-11-13",
  //         timeOfDay: "Breakfast"
  //       }
  //     }]
  //   }).then(() => {
  //     this.loadTopFoods();
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

  handleThumbsUp = async (foodId) => {
    await Promise.resolve(this.props.thumbsUp({
      variables: {
        id: foodId
      },
      refetchQueries: [{
        query: TopFoodsOverall,
        variables: {
          num: 5,
          isHall: true,
          date: "2018-11-13",
          timeOfDay: "Breakfast"
        }
      }]
    }));
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    await sleep(50);
    console.log('One seconds later');

    this.loadTopFoods();
  }

  handleThumbsDown = (foodId) => {
    console.log(foodId)
    this.props.thumbsDown({
      variables: {
        id: foodId
      }
    }).then(() => {
      this.loadTopFoods();
    }).catch((error) => {
      console.log(error);
    });
  }

  topFoodsOverall = (num, isHall, date, timeOfDay) => {
    this.props.client.query({
      query: TopFoodsOverall,
      variables: {
        num, // same as num: num when named the same
        isHall,
        date, // date: moment().format("YYYY-MM-D")
        timeOfDay // use moment to determine breakfast, lunch, or dinner
      },
    }).then(({ data }) => {
      if (isHall) {
        this.setState({ topDiningFoods: data.topFoods });
      } else {
        this.setState({ topNonDiningFoods: data.topFoods });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  loadTopFoods = () => {
    this.topFoodsOverall(5, true, "2018-11-13", "Breakfast");
    this.topFoodsOverall(5, false, "2018-11-13", "Breakfast");
  }

  // does one time when the component is first rendered
  componentDidMount() {
    this.loadTopFoods();
  }

  render() {  
    return (
      <PageContainer
        diningFoods={this.state.topDiningFoods}
        nonDiningFoods={this.state.topNonDiningFoods}
        diningHallFoods={this.state.allDiningHallFoods}
        handleThumbsUp={this.handleThumbsUp}
        handleThumbsDown={this.handleThumbsDown}
      />
    );
  }
}

export default compose(
  graphql(ThumbsUp, { name: 'thumbsUp' }),
  graphql(ThumbsDown, { name: 'thumbsDown' })
)(App);
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
const TopFoodsMenu = gql`
  query topFoodsMenu($num: Int!, $diningId: ID!, $date: String!, $timeOfDay: String!) {
    menuByDiningDateTimeOfDay(diningId: $diningId, date: $date, timeOfDay: $timeOfDay) {
      topFoods(num: $num) {
        id
        name
        thumbsUp
        thumbsDown
        diet
        dining {
          name
        }
      }
      dining {
        id
        name
      }
    }
  }
`
const Dinings = gql`
  query {
    dinings {
      id
      name
      foods {
        id
        name
        thumbsUp
        thumbsDown
        diet
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
    diningHallTopFoods : [],
  }

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
    
    await sleep(100);
    this.loadTopFoods();
  }

  handleThumbsDown = async (foodId) => {
    await Promise.resolve(this.props.thumbsDown({
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
    await sleep(100);
    this.loadTopFoods();
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
    })
  }

  getTopFoodsByDining = (num, date, timeOfDay) => {
    this.props.client.query({
      query: Dinings
    }).then(({ data }) => {
      this.setState({ diningHallTopFoods: [] });
      data.dinings.map(
        (food) => {
          this.props.client.query({
            query: TopFoodsMenu,
            variables: {
              num, // same as num: num when named the same
              diningId: food.id,
              date, // date: moment().format("YYYY-MM-D")
              timeOfDay // use moment to determine breakfast, lunch, or dinner
            }
          }).then(({ data }) => {
            console.log(data.menuByDiningDateTimeOfDay)
            if (data.menuByDiningDateTimeOfDay != null) {
              this.setState({ diningHallTopFoods: [...this.state.diningHallTopFoods, data.menuByDiningDateTimeOfDay]})
              console.log(this.state)
            }
        }).catch((error) => {
          console.log(error);
        });
      });
    }).catch((error) => {
      console.log(error);  
    });
  }

  topFoodsMenu = (num, diningId, date, timeOfDay) => {
    this.props.client.query({
      query: TopFoodsMenu,
      variables: {
        num, // same as num: num when named the same
        diningId,
        date, // date: moment().format("YYYY-MM-D")
        timeOfDay // use moment to determine breakfast, lunch, or dinner
      }
    })
  }

  loadTopFoods = () => {
    this.topFoodsOverall(5, true, "2018-11-13", "Breakfast");
    this.topFoodsOverall(5, false, "2018-11-13", "Breakfast");
    this.getTopFoodsByDining(5, "2018-11-13", "Breakfast");
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
        diningHallTopFoods={this.state.diningHallTopFoods}
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
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import PageContainer from './components/pageContainer.js';
import {sort} from './components/utils/sort'

var request = require('request');

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

const diningHallUrls = [
  // TODO: substitute names later
  {name: "Allison", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593d&date=2018-11-6'},
  {name: "Hinman", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b8fdc2c1178e90ec1a3c097&date=2018-11-6'},
  {name: "Sargent", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593e&date=2018-11-6'},
  {name: "Plex West", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7de3f3eeb60c7d3854ba&date=2018-11-6'},
  {name: "Plex East", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7ee9f3eeb60cb4f8f3af&date=2018-11-6'}
];

function responseCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var all_foods = [];
        var json_response = JSON.parse(body);
        // console.log(json_response.menu);
        for (var i = 0; i < json_response.menu.periods.length; i++) {
          var period = json_response.menu.periods[i];
          var FOOD_PERIOD = period.name;
          for (var j = 0; j < period.categories.length; j++) {
            var preferences = period.categories[j].name;
            for (var k = 0; k < period.categories[j].items.length; k++) {
              var food = period.categories[j].items[k];
              var filters = food.filters;
              var diets = [];
              for (var l = 0; l < filters.length; l++) {
                if (filters[l].type == "label") {
                  diets.push(filters[l].name);
                }
              }
              var db_food = {
                name: food.name,
                thumbsUp: 0,
                thumbsDown: 0,
                diet: diets.join(", "),
                preferences: preferences
                //diningHallId: do later
              };
              //food.name
              //food.desc
              //food.ingredients
            }
          }
        }
        // json_response.menu.periods - array of 6 values (breakfast, lunch, dinner, salad bar, deli bar, everyday)
    }
}

function scrapeMenu() {
  var headers = {
    'Origin': 'https://www.dineoncampus.com',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://www.dineoncampus.com/northwestern/whats-on-the-menu',
    'Connection': 'keep-alive'
  };

  // for (var i = 0; i < diningHallUrls.length; i++) {
  //   var name = diningHallUrls[i].name;
  //   var url = diningHallUrls[i].url;
  //   var options = {
  //     url: url,
  //     headers: headers
  //   }
  //
  //   request(options, responseCallback);
  // }

  var options = {
    url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b8fdc2c1178e90ec1a3c097&date=2018-11-6',
    headers: headers
  };

  request(options, responseCallback);
}

class App extends Component {
  state = {
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
    ],
  }


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


  render() {
    // const { data: { loading, foods }} = this.props;
    {scrapeMenu()}

    const {diningFoods:allDiningFoods,
      nonDiningFoods:allNonDiningFoods,
      diningHallFoods:allDiningHallFoods
    }=this.state;
    // fix sort
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

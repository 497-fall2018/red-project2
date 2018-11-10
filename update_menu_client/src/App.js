import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import moment from 'moment'

var request = require('request');
const GetDiningHallId = gql`
  query diningByName($name: String!) {
    diningByName(name: $name) {
      id
    }
  }
`

const CreateMenu = gql`
  mutation createMenu($diningId: ID!, $timeOfDay: String!, $date: String!) {
    createMenu(diningId: $diningId, timeOfDay: $timeOfDay, date: $date) {
      id
    }
  }
`

// check if food or null
const SearchFood = gql`
  query findFoodByNameAndDining($name: String!, $diningId: ID!) {
    findFoodByNameAndDining(name: $name, diningId: $diningId) {
      id
    }
  }
`

// if null
const CreateFood = gql`
  mutation createFood($name: String!, $description: String, $diet: String, $category: String, $diningId: ID!) {
    createFood(name: $name, description: $description, diet: $diet, category: $category, diningId: $diningId) {
      id
    }
  }
`

// get the id from above
const AddFoodToMenu = gql`
  mutation addFoodToMenu($menuId: ID!, $foodId: ID!) {
    addFoodToMenu(menuId: $menuId, foodId: $foodId)
  }
`

const diningHallUrls = [
  // TODO: substitute names later
  {name: "Allison", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593d&date='},
  {name: "Hinman", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b8fdc2c1178e90ec1a3c097&date='},
  {name: "Sargent", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593e&date='},
  {name: "Plex West", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7de3f3eeb60c7d3854ba&date='},
  {name: "Plex East", url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7ee9f3eeb60cb4f8f3af&date='}
];

class App extends Component {
  scrapeMenu = () => {
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

    var todaydate = moment().format("YYYY-MM-D");
    var options = {
      url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593d&date=' + todaydate,
      headers: headers
    };

    console.log(options.url);
    var diningHallName = "Allison";
    request(options, (function(error, response, body) {
      this.responseCallback(diningHallName, error, response, body, todaydate);
    }).bind(this));
  }

  responseCallback = (diningHallName, error, response, body, date) => {
    if (!error && response.statusCode == 200) {
      // TODO: this does not yet return dining_id
      // var dining_id = this.getDiningHallId(diningHallName);
      var json_response = JSON.parse(body);
      if (json_response.status != "error") {
        for (var i = 0; i < json_response.menu.periods.length; i++) {
          var period = json_response.menu.periods[i];
          var FOOD_PERIOD = period.name;
          // var menu_id = this.createMenu(dining_id, FOOD_PERIOD, todaydate);
          for (var j = 0; j < period.categories.length; j++) {
            var category = period.categories[j].name;
            for (var k = 0; k < period.categories[j].items.length; k++) {
              var food = period.categories[j].items[k];
              var filters = food.filters;
              var diets = [];
              for (var l = 0; l < filters.length; l++) {
                if (filters[l].type == "label") {
                  diets.push(filters[l].name);
                }
              }

              // var food_id = this.searchFood(food.name, dining_id);
              // if (food_id == null) {
              //   food_id = this.createFood(food.name, food.description, diet.join(", "), category, dining_id);
              // }
              // this.addFoodToMenu(menu_id, food_id);

            }
          }
        }
      }
    }
  }
  test_function = () => {
    var dining_id = getDiningHallId("Sargent");
    var new_menu = createMenu(diningId, "Lunch", "November 10");
    var foundFood = searchFood("Arroz con Pollo", diningId);
    if (foundFood == null) {
        foundFood = createFood("Arroz con Pollo", diningId));
    }
    addFoodToMenu(new_menu, foundFood)
    var notFoundFood = searchFood("Pineapple", diningId);
    if (notFoundFood == null) {
      notFoundFood = createFood("Pineapple", diningId);
    }
    addFoodToMenu(new_menu, notFoundFood)
  }

  getDiningHallId = (diningHallName) => {
    this.props.client.query({
      query: GetDiningHallId,
      variables: {
        name: diningHallName
      }
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  createMenu = (diningId, timeOfDay, date) => {
    this.props.createMenu({
      variables: {
        diningId: diningId,
        timeOfDay: timeOfDay,
        date: date
      },
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  searchFood = (name, diningId) => {
    this.props.client.query({
      query: SearchFood,
      variables: {
        name: name,
        diningId: diningId
      }
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  createFood = (name, description, diet, category, diningId) => {
    this.props.createFood({
      variables: {
        name: name,
        description: description,
        diet: diet,
        category: category,
        diningId: diningId
      },
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  addFoodToMenu = (menuId, foodId) => {
    this.props.addFoodToMenu({
      variables: {
        menuId: menuId,
        foodId: foodId
      },
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    {this.scrapeMenu()}
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Updating Menus ...
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default compose(
  graphql(CreateMenu, { name: 'createMenu' }),
  graphql(CreateFood, { name: 'createFood' }),
  graphql(AddFoodToMenu, { name: 'addFoodToMenu' })
)(App);

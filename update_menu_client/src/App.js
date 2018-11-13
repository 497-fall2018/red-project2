import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import moment from 'moment'

var request = require('request');
const CreateDining = gql`
  mutation createDining($name: String!, $hours: String!, $isHall: Boolean!) {
    createDining(name: $name, hours: $hours, isHall: $isHall) {
      name
    }
  }
`

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
  query foodByNameAndDining($name: String!, $diningId: ID!) {
    foodByNameAndDining(name: $name, diningId: $diningId) {
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

const diningHalls = [
  // TODO: substitute names later
  {name: "Allison", hours: "7:00am - 8:00pm", isHall: true, url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593d&date='},
  {name: "Hinman", hours: "7:00am - 8:00pm", isHall: true, url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b8fdc2c1178e90ec1a3c097&date='},
  {name: "Sargent", hours: "7:00am - 11:30pm", isHall: true, url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5b33ae291178e909d807593e&date='},
  {name: "Plex West", hours: "7:00am - 12:00am", isHall: true, url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7de3f3eeb60c7d3854ba&date='},
  {name: "Plex East", hours: "7:00am - 8:00pm", isHall: true, url: 'https://api.dineoncampus.com/v1/location/menu?site_id=5acea5d8f3eeb60b08c5a50d&platform=0&location_id=5bae7ee9f3eeb60cb4f8f3af&date='}
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

    var todaydate = moment().format("YYYY-MM-D");
    for (var i = 0; i < diningHalls.length; i++) {
      var options = {
        url: diningHalls[i].url + todaydate,
        headers: headers
      };
      this.getMenu(diningHalls[i].name, options, todaydate);
    }
  }

  getMenu = (name, options, todaydate) => {
    request(options, (function(error, response, body) {
      this.responseCallback(name, error, response, body, todaydate);
    }).bind(this));
  }

  responseCallback = async (diningHallName, error, response, body, date) => {
    if (!error && response.statusCode == 200) {
      var json_response = JSON.parse(body);
      if (json_response.status != "error") {
        var dining_id = (await Promise.resolve(this.getDiningHallId(diningHallName))).data.diningByName.id;
        for (var i = 0; i < json_response.menu.periods.length; i++) {
          var period = json_response.menu.periods[i];
          var FOOD_PERIOD = period.name;
          var menu_id = (await Promise.resolve(this.createMenu(dining_id, FOOD_PERIOD, date))).data.createMenu.id;
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
              var food_id = (await Promise.resolve(this.createFood(food.name, food.description, diets.join(", "), category, dining_id))).data.createFood.id;
              this.addFoodToMenu(menu_id, food_id);
            }
          }
        }
      }
    }
  }

  createAllDiningHalls = () => {
    for (var i = 0; i < diningHalls.length; i++) {
      this.createDining(diningHalls[i].name, diningHalls[i].hours, diningHalls[i].isHall);
    }
  }

  createDining = (name, hours, isHall) => {
    return this.props.createDining({
      variables: {
        name: name,
        hours: hours,
        isHall: isHall
      }
    });
  }

  getDiningHallId = diningHallName => {
    return this.props.client.query({
      query: GetDiningHallId,
      variables: {
        name: diningHallName
      }
    });
  }

  createMenu = (diningId, timeOfDay, date) => {
    return this.props.createMenu({
      variables: {
        diningId: diningId,
        timeOfDay: timeOfDay,
        date: date
      },
    });
  }

  searchFood = (name, diningId) => {
    return this.props.client.query({
      query: SearchFood,
      variables: {
        name: name,
        diningId: diningId
      }
    });
  }

  createFood = (name, description, diet, category, diningId) => {
    return this.props.createFood({
      variables: {
        name: name,
        description: description,
        diet: diet,
        category: category,
        diningId: diningId
      },
    });
  }

  addFoodToMenu = (menuId, foodId) => {
    return this.props.addFoodToMenu({
      variables: {
        menuId: menuId,
        foodId: foodId
      },
    });
  }

  render() {
    {/*this.createAllDiningHalls()*/}
    {/*this.scrapeMenu()*/}
    {console.log("Finished parsing the menu.");}

    return (
      <div className="App">
        <header className="App-header">
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
  graphql(CreateDining, { name: 'createDining' }),
  graphql(CreateMenu, { name: 'createMenu' }),
  graphql(CreateFood, { name: 'createFood' }),
  graphql(AddFoodToMenu, { name: 'addFoodToMenu' })
)(App);

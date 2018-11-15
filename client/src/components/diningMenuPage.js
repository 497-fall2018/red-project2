import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'
import Top5Table from './top5Table';
import MenuTable from './menuTable';

export class DiningMenuPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePage: this.props.diningHall
    }
  }
  render() {
    if (this.props.diningHallTopFoods.length != 0) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div style={{ margin: "auto", width: 900 }}>
              <Header as='h1'>{this.props.diningHall}</Header>
              <Header as='h1'>Top 5</Header>
                <Top5Table
                  foodItems= { this.props.diningHallTopFoods.filter(
                    (menu) => menu.dining.name == this.props.diningHall).map(
                      (menu) => menu.topFoods)[0]
                  }
                  handleThumbsUp= {this.props.handleThumbsUp}
                  handleThumbsDown= {this.props.handleThumbsDown}
              />
              <MenuTable
                foodItems={ this.props.diningHallFoods.filter(
                  (menu) => menu.dining.name == this.props.diningHall).map(
                    (menu) => menu.foods)[0]
                  }
                handleThumbsUp={this.props.handleThumbsUp}
                handleThumbsDown={this.props.handleThumbsDown}
                />

            </div>
          </div>
        </div>
      );
    }
    else {
      return null
    }
  }
}

export default DiningMenuPage;

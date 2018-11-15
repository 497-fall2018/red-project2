import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'
import Top5Table from './top5Table';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';



export class DiningMenuPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePage: this.props.diningHall
    }
  }
  render() {
    console.log('xxxxxxxx')
    console.log( this.props.diningHallTopFoods[0].topFoods)
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <div style={{ margin: "auto", width: 900 }}>
            <Header as='h1'>{this.props.diningHall}</Header>
            <Header as='h1'>Top 5</Header>
              <Top5Table
                foodItems= { this.props.diningHallTopFoods[0].topFoods }
                handleThumbsUp= {this.props.handleThumbsUp}
                handleThumbsDown= {this.props.handleThumbsDown}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DiningMenuPage;

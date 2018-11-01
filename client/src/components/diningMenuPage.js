import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Dropdown, Header} from 'semantic-ui-react'
import Top5Table from './top5Table';


export class DiningMenuPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePage: this.props.diningHall
    }
  }

  render() {
    const {activePage } = this.state
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '50px' }}>
          <div style={{ margin: "auto", width: 900 }}>
            <Header as='h1'>{this.props.diningHall}</Header>
            <Header as='h1'>Top 5</Header>
              <Top5Table
              foodItems= { this.props.diningHallFoods }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DiningMenuPage;

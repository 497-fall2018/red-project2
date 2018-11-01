import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Dropdown, Header} from 'semantic-ui-react'
import HomePage from './homePage.js';

export class PageContainer extends Component {
  constructor(props) {
      super(props)
      this.state = {
        activePage: 'home',
      }
  }

  render() {
    if (this.state.activePage == 'home') {
      return (
        <HomePage
          diningFoods={this.props.diningFoods}
          nonDiningFoods={this.props.nonDiningFoods}
        />
      );
    }
  }
}

export default PageContainer;

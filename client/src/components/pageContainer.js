import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'
import HomePage from './homePage.js';
import DiningMenuPage from './diningMenuPage.js';

const diningOptions = [
  {
    key: '1',
    text: 'Sargent',
    value: 'Sargent'
  },
  {
    key: '2',
    text: 'Allison',
    value: 'Allison'
  },
  {
    key: '3',
    text: 'Plex East',
    value: 'Plex East'
  },
  {
    key: '4',
    text: 'Plex West',
    value: 'Plex West'
  },
  {
    key: '5',
    text: 'Hinman',
    value: 'Hinman'
  },
];

const nonDiningOptions = [
  {
    key: '6',
    text: 'Asiana Foodville',
    value: 'Asiana Foodville'
  },
  {
    key: '7',
    text: "Lisa's",
    value: "Lisa's"
  },
  {
    key: '8',
    text: 'Tech Express',
    value: 'Tech Express'
  },
  {
    key: '9',
    text: 'Budlong Hot Chicken',
    value: 'Budlong Hot Chicken'
  },
  {
    key: '10',
    text: 'Wildcat Deli',
    value: 'Wildcat Deli'
  },
];

export class PageContainer extends Component {
  constructor(props) {
      super(props)
      this.state = {
        activePage: 'home',
      }
  }

  changeDiningPage = (value) => {
    console.log(value);
    this.setState({ activePage: value})
  }

  handlePageToggle = (e, { name }) => this.setState({ activePage: name })
  handleDiningPage = (e, { value }) => { this.setState({ activePage: value}) }

  render() {

    if (this.state.activePage == 'home') {
      return (
        <div>
          <Menu secondary style={{display: 'flex', justifyContent: 'center'}}>
            <Menu.Item name='home' active={this.state.activePage === 'home'} onClick={this.handlePageToggle}></Menu.Item>
            <Menu.Item>
              <Dropdown text='dining'>
                <Dropdown.Menu>
                  {diningOptions.map(option => {
                    return <Dropdown.Item
                              key={option.key}
                              text={option.text}
                              value={option.value}
                              onClick={this.handleDiningPage} />
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            {/*
            <Menu.Item>
              <Dropdown text='non-dining' options={nonDiningOptions} onChange={this.handleDiningPage} />
            </Menu.Item>
            */}
          </Menu>
        <HomePage
          diningFoods={this.props.diningFoods}
          nonDiningFoods={this.props.nonDiningFoods}
          handleThumbsUp={this.props.handleThumbsUp}
          handleThumbsDown={this.props.handleThumbsDown}
        />
        </div>
      );
    } else {
      return (
        <div>
            <Menu secondary style={{display: 'flex', justifyContent: 'center'}}>
              <Menu.Item name='home' active={this.state.activePage === 'home'} onClick={this.handlePageToggle}></Menu.Item>
              <Menu.Item>
                <Dropdown text='dining'>
                  <Dropdown.Menu>
                    {diningOptions.map(option => {
                      return <Dropdown.Item
                        key={option.key}
                        text={option.text}
                        value={option.value}
                        onClick={this.handleDiningPage} />
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
              {/*
              <Menu.Item>
                <Dropdown text='non-dining' options={nonDiningOptions} onChange={this.handleDiningPage} />
              </Menu.Item>
              */}
            </Menu>
        <DiningMenuPage
          diningHall={this.state.activePage}
          diningHallTopFoods={this.props.diningHallTopFoods}
          diningHallFoods = {this.props.diningHallFoods}
          handleThumbsUp={this.props.handleThumbsUp}
          handleThumbsDown={this.props.handleThumbsDown}
        />
      </div>
      );
    }
  }
}

export default PageContainer;

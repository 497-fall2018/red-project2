import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Dropdown, Header} from 'semantic-ui-react'
import Top5Table from './top5Table';

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
    value: 'SarPlex West'
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

export class HomePage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        activePage: 'home',
        activeTop5: 'dining'
      }
  }

  handlePageToggle = (e, { name }) => this.setState({ activePage: name })
  handleTop5Toggle = (e, { name }) => this.setState({ activeTop5: name })
  handleDiningPage = (e, { value }) => { console.log(value); }

  render() {
    const { activePage, activeTop5 } = this.state
    return (
      <div>
        <Menu secondary style={{display: 'flex', justifyContent: 'center'}}>
          <Menu.Item name='home' active={activePage === 'home'} onClick={this.handlePageToggle}></Menu.Item>
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
          <Menu.Item><Dropdown text='non-dining' options={nonDiningOptions} onChange={this.handleDiningPage} /></Menu.Item>
        </Menu>
        <div style={{ display: 'flex', marginTop: '50px' }}>
          <div style={{ margin: "auto", width: 900 }}>
            <Header as='h1'>Top 5</Header>
            <Menu secondary>
              <Menu.Item name='dining' active={activeTop5 === 'dining'} onClick={this.handleTop5Toggle}></Menu.Item>
              <Menu.Item name='non-dining' active={activeTop5 === 'non-dining'} onClick={this.handleTop5Toggle}></Menu.Item>
            </Menu>
            <Top5Table
              foodItems={activeTop5 == 'dining'? this.props.diningFoods : this.props.nonDiningFoods}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;

import React, { Component } from 'react';
import { Menu, Header } from 'semantic-ui-react'
import Top5Table from './top5Table';
import Bottom5Table from './bottom5Table';

export class HomePage extends Component {
  constructor(props) {
      super(props) // only need when doing more stuff in child constructor
      this.state = {
        activeTop5: 'dining'
      }
  }

  handleTop5Toggle = (e, { name }) => this.setState({ activeTop5: name })

  render() {
    const { activeTop5 } = this.state
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '50px' }}>
          <div style={{ margin: "auto", width: 900 }}>
            <Header as='h1'>Top 5</Header>
            <Menu secondary>
              <Menu.Item name='dining' active={activeTop5 === 'dining'} onClick={this.handleTop5Toggle}></Menu.Item>
              <Menu.Item name='non-dining' active={activeTop5 === 'non-dining'} onClick={this.handleTop5Toggle}></Menu.Item>
            </Menu>
            <Top5Table
              foodItems={activeTop5 === 'dining' ? this.props.diningFoods : this.props.nonDiningFoods}
              handleThumbsUp={this.props.handleThumbsUp}
              handleThumbsDown={this.props.handleThumbsDown}
            />
            {/* <Header as='h1'>Bottom 5</Header>
            <Bottom5Table
              foodItems={activeTop5 === 'dining' ? this.props.diningFoods : this.props.nonDiningFoods}
              handleThumbsUp={this.props.handleThumbsUp}
              handleThumbsDown={this.props.handleThumbsDown}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;

import React, {Component} from 'react';
import {Button, Card, Icon} from 'semantic-ui-react'

export class FoodRow extends Component {

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>{this.props.food.name}</Card.Header>
          <Card.Meta>{this.props.food.dining.name}</Card.Meta>
          <Card.Description></Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
          <Button onClick={() => this.props.handleThumbsUp(this.props.food.id)}
                  size='small'
                  basic color='green'>
            <Icon name='thumbs up' ></Icon>
            {this.props.food.thumbsUp}
          </Button>
          <Button onClick={() => this.props.handleThumbsDown(this.props.food.id)}
                  size='small'
                  basic color='red'>
            <Icon name='thumbs down'></Icon>
            {this.props.food.thumbsDown}
          </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default FoodRow;

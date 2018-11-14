import React, {Component} from 'react';
import {Button, Table, Card, Icon} from 'semantic-ui-react'
import gql from 'graphql-tag';
import { graphql, compose, withApollo } from 'react-apollo';

const ThumbsUp = gql`
  mutation thumbsUp($id: ID!) {
    thumbsUp(id: $id)
  }
`

const ThumbsDown = gql`
  mutation thumbsDown($id: ID!) {
    thumbsDown(id: $id)
  }
`

export class FoodRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
        
    }
  }

  handleThumbsUp = (id) => {
    this.props.thumbsUp({
      variables: {
        id: id
      },
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }
  
  handleThumbsDown = (id) => {
    this.props.thumbsDown({
      variables: {
        id: id
      },
    }).then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <Card key={this.props.key}>
      <Card.Content>
        <Card.Header>{this.props.rank}. {this.props.food.name}</Card.Header>
        <Card.Meta>{this.props.food.dining.name}</Card.Meta>
        <Card.Description></Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
        <Button onClick={this.props.handleThumbsUp(this.props.food.id)} size='small' basic color='green'><Icon name='thumbs up' ></Icon>{this.props.food.thumbsUp}</Button>
        <Button onClick={this.props.handleThumbsDown} size='small' basic color='red'><Icon name='thumbs down'></Icon>{this.props.food.thumbsDown}</Button>
        </div>
      </Card.Content>
    </Card>);
  }
}

export default compose(
  graphql(ThumbsUp, { name: 'thumbsUp' }),
  graphql(ThumbsDown, { name: 'thumbsDown' })
)(FoodRow);

/*<Table.Row>
    <Table.Cell>{props.food.rank}</Table.Cell>
    <Table.Cell>{props.food.name}</Table.Cell>
    <Table.Cell>{props.food.diningHall}</Table.Cell>
    <Table.Cell>{props.food.price}</Table.Cell>
</Table.Row>*/

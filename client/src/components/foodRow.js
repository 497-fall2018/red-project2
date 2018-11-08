import React, {Component} from 'react';

import {Button, Table, Card, Icon} from 'semantic-ui-react'



const FoodRow = (props) => {
    return (
      <Card key={props.food._id}>
      <Card.Content>
        <Card.Header>{props.food.rank}. {props.food.name}</Card.Header>
        <Card.Meta>{props.food.diningHall}</Card.Meta>
        <Card.Description></Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
        <Button onClick={props.onIncrement} size='small' basic color='green'><Icon name='thumbs up' ></Icon>{props.food.thumbup}</Button>
        <Button onClick={props.onDecrement} size='small' basic color='red'><Icon name='thumbs down'></Icon>{props.food.thumbdown}</Button>
        </div>
      </Card.Content>
    </Card>);
}

export default FoodRow;

/*<Table.Row>
    <Table.Cell>{props.food.rank}</Table.Cell>
    <Table.Cell>{props.food.name}</Table.Cell>
    <Table.Cell>{props.food.diningHall}</Table.Cell>
    <Table.Cell>{props.food.price}</Table.Cell>
</Table.Row>*/

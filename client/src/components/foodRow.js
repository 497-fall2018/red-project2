import React, {Component} from 'react';

import {Button, Table, Card, Icon} from 'semantic-ui-react'

const FoodRow = (props) => {
    return (
        <Card>
          <Card.Content>
            <Card.Header>{props.food.rank}. {props.food.name}</Card.Header>
            <Card.Meta>{props.food.diningHall}</Card.Meta>
            <Card.Description></Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button size='small' basic color='green'><Icon name='thumbs up'></Icon>30</Button>
              <Button size='small' basic color='red'><Icon name='thumbs down'></Icon>10</Button>
            </div>
          </Card.Content>
        </Card>
    );
}

export default FoodRow;

/*<Table.Row>
    <Table.Cell>{props.food.rank}</Table.Cell>
    <Table.Cell>{props.food.name}</Table.Cell>
    <Table.Cell>{props.food.diningHall}</Table.Cell>
    <Table.Cell>{props.food.price}</Table.Cell>
</Table.Row>*/

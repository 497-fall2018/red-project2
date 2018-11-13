import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Card} from 'semantic-ui-react';
import FoodRow from './foodRow';

const Top5Table = (props) => {
    return (
        <Card.Group>
          {/* This maps the foodItems received as a prop */}
          {props
              .foodItems
              .map(f => {
                return <FoodRow
                    food={f}
                    key={f._id}
                    thumbsUp={e => props.onIncrement(f)}
                    thumbsDown={e => props.onDecrement(f)}
                    />
              })
          }
        </Card.Group>
    )
}

export default Top5Table;

/*<Table collapsing>
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell>Rank</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Dining Hall</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {props
            .foodItems
            .map(f => {
              return <FoodRow
                  food={f}
                  key={f._id}/>
            })
        }
    </Table.Body>
</Table>*/

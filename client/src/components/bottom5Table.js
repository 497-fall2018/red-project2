import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Card} from 'semantic-ui-react';
import FoodRow from './foodRow';

const Bottom5Table = (props) => {
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

export default Bottom5Table;

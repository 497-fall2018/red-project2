import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
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
                      key={f.id}
                      rank="some rank"
                      //rank = { position in array }
                      thumbsUp={e => props.onIncrement(f.id)}
                      thumbsDown={e => props.onDecrement(f.id)}
                      />
              })
          }
        </Card.Group>
    )
}

export default Bottom5Table;

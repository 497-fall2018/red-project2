import React, {Component} from 'react';
import moment from 'moment'

import {Button, Table} from 'semantic-ui-react'

const FoodRow = (props) => {
    return (
        <Table.Row>
            <Table.Cell>{props.food.rank}</Table.Cell>
            <Table.Cell>{props.food.name}</Table.Cell>
            <Table.Cell>{props.food.diningHall}</Table.Cell>
            <Table.Cell>{props.food.price}</Table.Cell>
        </Table.Row>
    );
}

export default FoodRow;

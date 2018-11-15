import React, {Component} from 'react';

import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import {Button,Icon} from 'semantic-ui-react';
const FoodRowTable = (props) => {
    return (
      <TableRow key={props.food._id}>
        <TableCell component="th" scope="row">
          {props.food.name}
        </TableCell>
        <TableCell>{props.food.diningHall}</TableCell>
        <TableCell>{props.food.price}</TableCell>
        <TableCell> <div className='ui two buttons'>
        <Button onClick={() =>props.handleThumbsUp(props.food._id)} size='small' basic color='green'><Icon name='thumbs up' ></Icon>{props.food.thumbup}</Button>
        <Button onClick={() =>props.handleThumbsDown(props.food._id)} size='small' basic color='red'><Icon name='thumbs down'></Icon>{props.food.thumbdown}</Button>
        </div></TableCell>
      </TableRow>

    );}
export default FoodRowTable
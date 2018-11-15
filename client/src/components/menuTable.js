import React, { Component} from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FoodRowTable from './foodRowTable';


const MenuTable =(props)=>{
  if (props.foodItems != null) {
      return(
        <React.Fragment>
        <Table>
        <TableBody>
        {props.foodItems
              .map(f => {
                return <FoodRowTable
                    food={f}
                    key={f.id}
                    handleThumbsUp={props.handleThumbsUp}
                    handleThumbsDown={props.handleThumbsDown}
                    />
              })
            }
        </TableBody>
      </Table>
      </React.Fragment>
      );
  }
  else {
    return <p>No menu at this time.</p>
  }
}
export default MenuTable
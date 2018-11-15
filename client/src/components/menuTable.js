import React, { Component} from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FoodRowTable from './foodRowTable';


const MenuTable =(props)=>{
        return(
        <React.Fragment>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Food</TableCell>
            <TableCell>Dining Hall</TableCell>
            <TableCell>Price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {props.foodItems
              .map(f => {
                return <FoodRowTable 
                    food={f}
                    key={f._id}
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
export default MenuTable
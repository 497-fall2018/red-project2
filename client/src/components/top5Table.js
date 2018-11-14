import React, {Component} from 'react';
import {Button, Icon, Label, Menu, Table, Card} from 'semantic-ui-react';
import FoodRow from './foodRow';

export class Top5Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    render() {
        return (
            <Card.Group>
            {/* This maps the foodItems received as a prop */}
            {this.props
                .foodItems
                .map(f => {
                    return <FoodRow
                        food={f}
                        key={f.id}
                        rank = {"some rank"}
                        //rank = { position in array }
                        thumbsUp={e => this.props.onIncrement(f.id)}
                        thumbsDown={e => this.props.onDecrement(f.id)}
                        />
                })
            }
            </Card.Group>
        )
    }
}

// const Top5Table = (props) => {
//     return (
//         <Card.Group>
//           {/* This maps the foodItems received as a prop */}
//           {props
//               .foodItems
//               .map(f => {
//                 return <FoodRow
//                     food={f}
//                     key={f.id}
//                     rank = {"some rank"}
//                     //rank = { position in array }
//                     thumbsUp={e => props.onIncrement(f.id)}
//                     thumbsDown={e => props.onDecrement(f.id)}
//                     />
//               })
//           }
//         </Card.Group>
//     )
// }

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

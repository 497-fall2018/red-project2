import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import FoodRow from './foodRow';

export class Top5Table extends Component {

    render() {
        console.log('yyyy')
        console.log(this.props.foodItems)
        return (
            <Card.Group> {
                this.props.foodItems
                .map(f => {
                    return <FoodRow
                        key={f.id}
                        food={f}
                        rank = {"some rank"} //rank = { position in array }
                        handleThumbsUp={this.props.handleThumbsUp}
                        handleThumbsDown={this.props.handleThumbsDown}
                        />
                })
            } </Card.Group>
        )
    }
}

export default Top5Table;


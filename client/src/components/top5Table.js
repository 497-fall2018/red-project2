import React, {Component} from 'react';

import {Button, Icon, Label, Menu, Table} from 'semantic-ui-react'

const Top5Table = (props) => {
    return (
        <Table collapsing>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Rank</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Dining Hall</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>

                {/* This maps the foodItems received as a prop */}

                var counter = 0;
                {props
                    .foodItems
                    .map(f => {
                        if (counter<5) {
                            counter = counter + 1;
                            return <FoodRow
                                food={f}
                                key={f._id}/>
                        }
                    })
                }
            </Table.Body>
        </Table>
    )
}

export default Top5Table;
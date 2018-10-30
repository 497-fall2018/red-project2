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

                {/* This maps the foodItems recieved as a prop */}

                {props
                    .foodItems
                    var counter = 0;
                    .map(t => {
                        if (counter<5){
                        //
                        return <FoodRow
                                      food={t}
                                      key={t._id}
                                                  />
                                counter = counter + 1;
                                                }
                                }
                  }
              </Table.Body>

          </Table>
        }

export default Top5Table;

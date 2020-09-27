import React, { Component } from "react";
import { Table } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

class ProductTable extends Component {
  render() {
    const { name, category, price, balance, position, onEditProduct, onRemoveProduct } = this.props;
    return (
      <Table.Row key={position}>
        <Table.Cell >{name}</Table.Cell>
        <Table.Cell>{category}</Table.Cell>
        <Table.Cell>{price}</Table.Cell>
        <Table.Cell>{balance}</Table.Cell>
        <Button primary onClick={() => onEditProduct(position)}>Edit</Button>
        <Button secondary onClick={() => onRemoveProduct(position)}>Delete</Button>
      </Table.Row>
    );
  }
}

export default ProductTable;

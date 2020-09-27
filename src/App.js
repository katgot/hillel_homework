import React, { Component } from 'react';
import './App.css';
import ProductTable  from './components/ProductTable';
import AddProduct  from './components/AddProduct';
import 'semantic-ui-css/semantic.min.css'
import { Table } from 'semantic-ui-react'




class App extends Component {

  state = {
    isEdit: false,
    products: [
      {
        name: "Orange",
        category: "fruit",
        price: 10,
        balance: 149,
      },
      {
        name: "Lemon",
        category: "fruit",
        price: 4,
        balance: 39,
      },
      {
        name: "Tomato",
        category: "vegetables",
        price: 6,
        balance: 288,
      }
    ],
    editProduct: {},
    editIndex : '',
  }

  addProduct = (addNew) => {
    const { products} = this.state;
    this.setState({
      products: [...products, addNew],     
    })
  }
 
  removeProduct = (removedIndex) => {
    const { products } = this.state;
    this.setState({
      products: products.filter((user, i) => i !== removedIndex)
    })
  }

  editProduct = (editPosition) => {
    const { products} = this.state;
    this.setState({
      isEdit: true,
      editProduct: products[editPosition],
      editIndex: editPosition,
    })
  }

  updateProduct = (updatedProduct, updatedIndex) => {
    const { products } = this.state;
    this.setState({
      products: products.map((product, i) => i === updatedIndex ? updatedProduct : product),
      isEdit: false,
      editProduct: {},
      editIndex: "",
    })
  }

  canselEditProduct = () => {
    this.setState({
      isEdit: false,
    })
  }

  
  render() {

    const { products, isEdit, editProduct, editIndex } = this.state;
    
    return (
      <div>
        <h1>Product Table</h1>
        <Table striped className="products">
        <Table.Body>
          {
            products.map((product, i) =>

            <ProductTable
                name={product.name}
                category={product.category}
                price={product.price}
                balance={product.balance}
                position={i}
                onEditProduct={this.editProduct}
                onRemoveProduct={this.removeProduct}
              />                   
            )
          }
          </Table.Body>
          </Table> 

          <>

          {
          isEdit
              ? <AddProduct
              name={editProduct.name}
              category={editProduct.category}
              price={editProduct.price}
              balance={editProduct.balance}
              position={editIndex}
              isEditFlag={isEdit}
              onUpdateProduct={this.updateProduct}
              onCancelEditProduct={this.canselEditProduct}
            />  
              : <AddProduct onChangeProduct={this.addProduct}/>
           }
          </>
      </div>
    )

  }
}

export default App;
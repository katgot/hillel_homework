import React, { Component, createRef } from "react";
import { Input } from 'semantic-ui-react'
// import { Button } from 'semantic-ui-react'

class AddProduct extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      addNew: {
        name: props.name,
        category: this.props.category,
        price: this.props.price,
        balance: this.props.balance,
      },
      validName: false,
      validCategory: false,
      validPrice: false,
      validBalance: false,
    };
    this.formProduct = createRef();
    this.saveBtnProduct = createRef();
    console.log(this.state);
  }

  onChange = (e) => {
    const {
      addNew,
      validName,
      validCategory,
      validPrice,
      validBalance,
    } = this.state;
    let clone = Object.assign({}, addNew);
    let value = e.target.value;
    let name = e.target.name;
    let defaultValue = e.target.defaultValue;
    console.log(defaultValue);

    let validFlag = false;

    // валидация
    switch (name) {
      case "name":
        validFlag = value.length >= 4;
        if (validFlag) {
          // console.log("ok name");
          this.setState(
            {
              validName: true,
            },
            function () {
              console.log(this.state);
            }
          );
          e.target.style.borderColor = "green";
        } else {
          this.setState(
            {
              validName: false,
            },
            function () {
              console.log(this.state);
            }
          );
          e.target.style.borderColor = "red";
        }
        break;
      case "category":
        validFlag = value.length >= 4;
        if (validFlag) {
          // console.log("ok name");
          this.setState({
            validCategory: true,
          });
          e.target.style.borderColor = "green";
        } else {
          this.setState({
            validName: false,
          });
          e.target.style.borderColor = "red";
        }
        break;
      case "price":
        validFlag = value >= 0;
        if (validFlag) {
          // console.log("ok price");
          this.setState({
            validPrice: true,
          });
          e.target.style.borderColor = "green";
        } else {
          this.setState({
            validName: false,
          });
          e.target.style.borderColor = "red";
        }
        break;
      case "balance":
        validFlag = value >= 0;
        if (validFlag) {
          // console.log("ok balance");
          this.setState({
            validBalance: true,
          });
          e.target.style.borderColor = "green";
        } else {
          this.setState({
            validName: false,
          });
          e.target.style.borderColor = "red";
        }
        break;
      default:
        break;
    }

    clone[name] = value;

    this.setState(
      {
        addNew: clone,
      },
      // function () {    //тут я проверяю валидность всех полей и разблокирую кнопку для отправки
      //   console.log(this.state);
      //   if (
      //     validName === true &&
      //     validCategory === true &&
      //     validPrice === true &&
      //     validBalance === true
      //   ) {
      //     console.log("+++");
      //     this.saveBtnProduct.current.disabled = false;
      //   } else {
      //     console.log("----");
      //   }
      // }
    );
  };

  componentDidMount() {
    this.formProduct.current.addEventListener("submit", function ResetForm(e) {
      console.log(e);
      e.preventDefault();
      // console.log(this.formProduct.current);
      console.log("reset");
      // this.formProduct.current.reset();
      e.target.reset();
    });
  }

  componentWillUnmount() {
    this.formProduct.current.removeEventListener("submit", function ResetForm(
      e
    ) {
      console.log(e);
      e.preventDefault();
      console.log("reset");
      e.target.reset();
    }); 
  }

  render() {

    const {
      name,
      category,
      price,
      balance,
      isEditFlag,
      onChangeProduct,
      onUpdateProduct,
      onCancelEditProduct,
      position,
    } = this.props;

    return (
      <form ref={this.formProduct}>
        <div className="ui input">
        <input
          name="name"
          onChange={this.onChange}
          type="text"
          defaultValue={name}
        /></div>
        <div className="ui input">
        <input
          name="category"
          onChange={this.onChange}
          type="text"
          defaultValue={category}
        /></div>
        <div className="ui input">
        <input
          name="price"
          onChange={this.onChange}
          type="number"
          defaultValue={price}
        /></div>
        <div className="ui input">
        <input
          name="balance"
          onChange={this.onChange}
          type="number"
          defaultValue={balance}
        /></div>

        {isEditFlag ? (
          <>
            <button
              ref={this.saveBtnProduct}
              //  disabled
              type="submit"
              onClick={() => onUpdateProduct(this.state.addNew, position)}
            >
              Save Edit Product
            </button>
            <button type="reset" onClick={() => onCancelEditProduct()}>
              Cansel Edit Product
            </button>
          </>
        ) : (
          <button
            // disabled
            type="submit"
            ref={this.saveBtnProduct}
            onClick={() => onChangeProduct(this.state.addNew)}
          >
            Add Product
          </button>
        )}
      </form>
    );
  }
}

export default AddProduct;

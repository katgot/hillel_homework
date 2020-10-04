import React, { Component } from 'react';
import './App.css';
import Slider  from './components/Slider';
import { Form, Checkbox } from "semantic-ui-react";


class App extends Component {

  state = {
    autoplay: false,
  };

  
  render() {
    const { autoplay,} = this.state;
    
    return (
    <>

    <Form>
      <Form.Field>
            <Checkbox label='Autoplay' onChange={() => this.setState({ autoplay: !autoplay})} />
      </Form.Field>
    </Form>

    <Slider autoplay={autoplay}>
      <img src="https://cdn.pixabay.com/photo/2016/08/11/23/48/italy-1587287_960_720.jpg" alt="pic1"/>
      <img src="https://cdn.pixabay.com/photo/2016/10/22/17/46/scotland-1761292_960_720.jpg" alt="pic2"/>
      <img src="https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014711_960_720.jpg" alt="pic3"/>

    </Slider>

    </>
    )


  }
}

export default App;
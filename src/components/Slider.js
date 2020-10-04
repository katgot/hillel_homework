import React, { Component, createRef } from "react";

import SwiperJs from 'swiper';
import 'swiper/swiper-bundle.css';


class Slider extends Component {

    constructor(props) {
        super(props);
        this.slider = React.createRef();
        this.swiper = null;
    }


    componentDidMount() {
        this.swiper = new SwiperJs(this.slider.current, this.props); // почему props приходят, устанавливаются в слайдере, но визуально autoplay не работает?
        // this.swiper = new SwiperJs(this.slider.current, {
        //     autoplay:{
        //         delay: 2000,          // это значение отображается в консоли в params сладйера, но autoplay тоже не работает?
        //     }
        // });
        console.log(this.swiper);
    }

    componentDidUpdate(prevProps) {
        if(this.props !== prevProps) {
            this.swiper.update(this.props);  // почему props новые приходят, но в сладйере они не обновляются?
            console.log("update");
        }
    }

    componentWillUnmount() {
        this.swiper.destroy()
    }


    render() {
        const { children} = this.props;
        return (
          <div className ="swiper-container" ref={this.slider} >
              <div className="swiper-wrapper">
              {children.map(img =>  <div className="swiper-slide">{img}</div>)}
              </div>
              
          </div>
        );
      }
}


export default Slider;
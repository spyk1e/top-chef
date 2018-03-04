import React, { Component } from 'react';
import ReactDOM from 'react-dom'; 
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/top-chef');
    const body = await response.json();
    console.log("ddd");

    if (response.status !== 200) throw Error(body.message);

    
    return body;
  };

  render() { 
      if(this.state.response[0] !== undefined){
      console.log(this.state.response[0]);
      return (
   <div className="App">
    <header className="App-header">
          <img src={logo} className="App-logo" alt="star" />
          <img src={logo} className="App-logo" alt="star" />
          <img src={logo} className="App-logo" alt="star" />
        <h1 className="App-title">Stared deals</h1>
    </header>
    <h1>Stared restaurants with deals:</h1>
    <div className="restaurant-list">
        {this.state.response.sort(function(a,b){return parseInt(b.zipCode) - parseInt(a.zipCode);}).map((restaurant, index) => (
        <div className="card">
            <a target="_blank" href={restaurant.url_LF}>
                <div className="restaurant">

                    <div>
                        <h2>{restaurant.title}</h2>
                        <p className="Menu">{restaurant.menu}</p>
                    </div>


                    <a target="_blank" href={restaurant.url_map}>
                        <div className="geo">
                            <p>{restaurant.city}, {restaurant.zipCode}</p>
                        </div>
                    </a>
                </div>
            </a>

        </div>
        ))}
    </div>
</div>



      );
    }
    else{
      return (
        <div className="App">
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Stared deals</h1>
    </header>
          <div className="loading">
    <h1><p>Loading restaurants ...</p></h1>
          </div>
</div>
      );
    }
  } 
}

export default App;
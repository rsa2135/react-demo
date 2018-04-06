import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Coin = (props) => {
  return (
    <div className = 'coin-info'>
      <img src={props.avatarUrl} />
      <div className="info">
        <div className='symbol'>
          {props.symbol}
        </div>
        <div>{props.coinName}</div>
        <div>{props.price}</div>
      </div>
    </div>
  );
};

const CoinList = (props) => {
  return (
    <div>
      { props.coins.map(coin => <Coin {...coin} />) }
    </div>
  );
};

class Form extends Component {
  state = { symbol: '' }

  handleSubmit = (event) => {
    event.preventDefault();
    const urls = [
      'https://min-api.cryptocompare.com/data/all/coinlist',
      `https://min-api.cryptocompare.com/data/price?fsym=${this.state.symbol}&tsyms=USD`
    ]
    
    Promise.all(urls.map(url => 
      fetch(url).then(response => response.json())
    )).then(data => {
        if (data[0].Data[this.state.symbol] === undefined) {
          window.alert('Wrong symbol!')
          return
        }
        const coinData = data[0].Data[this.state.symbol];
        return { 
          symbol: coinData.Symbol,
          coinName: coinData.CoinName,
          avatarUrl: `https://www.cryptocompare.com/${coinData.ImageUrl}`,
          price: `$${data[1].USD}`
      }
    }).then((combinedData) => {
      this.props.onSubmit(combinedData)
      this.setState({symbol: ''})
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input 
          type='text'
          value={this.state.symbol}
          onChange={(event) => this.setState({ symbol: event.target.value })}
          placeholder='Coin Name'
          required/>
        <button type='submit'>Add coin</button>
      </form>
    )
  }
}


class App extends Component {
  // state = {
  //   coins: [
  //     {
  //       name: 'BTC',
  //       coinName: 'Bitcoin',
  //       avatarUrl:'https://www.cryptocompare.com/media/19633/btc.png',
  //       price:'$8547.2'
  //     },
  //     {
  //       name:'ETH',
  //       coinName: 'Ethereum',
  //       avatarUrl: 'https://www.cryptocompare.com/media/20646/eth_logo.png',
  //       price:'$521.17'
  //     }
  //   ]
  // }
  state = {
    coins: []
  }

  addNewCoin = (coinInfo) => {
    this.setState(prevState => {
      return {coins: prevState.coins.concat(coinInfo)}
    })
  };
  render() {
    return (
      <div>
        <Form onSubmit={this.addNewCoin} />
        <CoinList coins={this.state.coins} />
      </div>
    );
  }
}

export default App;

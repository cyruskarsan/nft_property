import React, { Component } from 'react';
import './App.css';
import Color from '../abis/Color.json'
import { ethers } from "ethers"
import fox from '../metamask-fox.svg'
import { Button } from 'react-bootstrap/Button';
class App extends Component {

  async componentWillMount() {
    await this.loadMetamask()
    await this.loadBlockchainData()
  }
  async loadMetamask() {
    new ethers.providers.Web3Provider(window.ethereum)
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
    else{
      alert("Please install Metamask!")
    }
    
  }

  async loadBlockchainData() {
    //connect to metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //find account connected to metamask
    const accounts = await provider.listAccounts()
    this.setState({account: accounts[0]})
    //detect network change
    provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });
    //retrive chainid to determine which network we are connected to
    const chainId = (await provider.getNetwork()).chainId
    const abi = Color.abi
    //connect to contract on the correct network
    const contract = new ethers.Contract(Color.networks[chainId].address, abi, provider)
    this.setState({ contract })
    const totalSupply = await contract.totalSupply()
    this.setState({ totalSupply })
    // Load Colors
    for (var i = 1; i <= totalSupply; i++) {
      const color = await contract.colors(i - 1)
      this.setState({
        colors: [...this.state.colors, color]
      })
    }
  }

  //mint a new token when you click on the mint button
  createToken = (color) => {
    //connect the contract to metamask as a signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(0)
    const contract = this.state.contract.connect(signer)
    contract.mint(color)
      .then('receipt', (receipt) => {
        console.log(receipt)
        this.setState({
          colors: [...this.state.colors, color]
        })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.createToken(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.colors.map((color, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
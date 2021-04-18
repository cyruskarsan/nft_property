import React, { Component } from 'react';
import './App.css';
import Color from '../abis/Color.json'
import Property from '../abis/Property.json'
import { ethers } from "ethers"
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
    console.log("chain", chainId)
    const abi = Color.abi
    //connect to contract on the correct network
    const contract = new ethers.Contract(Property.networks[chainId].address, abi, provider)
    this.setState({ contract })
    const totalSupply = await contract.totalSupply()
    this.setState({ totalSupply })
    console.log("totalSupply", totalSupply)
    // Load Colors
    for (var i = 1; i <= totalSupply; i++) {
      const property = await contract.ownerOf(i - 1)
      this.setState({
        properties: [...this.state.properties, property]
      })
    }
  }

  //mint a new token when you click on the mint button
  createToken = (property) => {
    //connect the contract to metamask as a signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(0)
    const contract = this.state.contract.connect(signer)
    contract.mint(property)
      .then('receipt', (receipt) => {
        console.log(receipt)
        this.setState({
          properties: [...this.state.properties, property]
        })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      properties: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://cyruskarsan.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Property Tokens
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
                    placeholder='e.g. 54 fillmore, Irvine, CA'
                    ref={(input) => { this.color = input }}
                  />
                  <p>
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-secondary'
                    value='Find Owner'
                  />
                  </p>
                  
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.properties.map((property, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" ></div>
                  <div>{property}</div>
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
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import TetherToken from "./build/Tether.json";
import DummyToken from "./build/Dummy.json";
import StackingDapp from "./build/Stacking_Dapp.json";
import { Component } from "react";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    const TetherTokenData = TetherToken.networks[networkId];

    if (TetherTokenData) {
      const tetherToken = new web3.eth.Contract(
        TetherToken.abi,
        TetherToken.address
      );
      this.setState({ tetherToken });
      let tetherTokenBalance = await tetherToken.method
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherTokenBalance: tetherTokenBalance.toString() });
    }

    const DummyTokenData = DummyToken.networks[networkId];

    if (DummyTokenData) {
      const dummyToken = new web3.eth.Contract(
        DummyToken.abi,
        DummyToken.address
      );
      this.setState({ dummyToken });
      let dummyTokenBalance = await dummyToken.method
        .balanceOf(this.state.account)
        .call();
      this.setState({ dummyTokenBalance: dummyTokenBalance.toString() });
    }

    const StackingDappData = StackingDapp.networks[networkId];

    if (StackingDappData) {
      const stackingDapp = new web3.eth.Contract(
        StackingDapp.abi,
        StackingDapp.address
      );
      this.setState({ stackingDapp });
      let stackingDappBalance = await stackingDapp.method
        .stackingBalance(this.state.account)
        .call();
      this.setState({ stackingDappBalance: stackingDappBalance.toString() });
    }
  }

  //Connect web3, metamask to dapp
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying Metamask"
      );
    }
  }

  stakeTokens = amount => {
    this.setState({ loading: true });
    this.state.tetherToken.method
      .approve(this.state.stackingDapp.address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", hash => {
        this.state.stackingDapp.methods
          .stakeToken(amount)
          .send({ from: this.state.account })
          .on("transactionHash", hash => {
            this.setState({ loading: false });
          });
      });
  };

  unStakeTokens = () => {
    this.setState({ loading: true });
    this.state.stackingDapp.methods
      .unStakeToken()
      .send({ from: this.state.account })
      .on("transactionHash", hash => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      tetherToken: {},
      dummyToken: {},
      stackingDapp: {},
      tetherTokenBalance: "0",
      dummyTokenBalance: "0",
      stackingDappTokenBalance: "0",
      loading: true
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

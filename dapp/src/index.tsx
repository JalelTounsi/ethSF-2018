import { ContractWrappers, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0xproject/subproviders';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { Content, Footer } from 'bloomer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './components/account';
import { Faucet } from './components/faucet';
import { InstallMetamask } from './components/install_metamask';
import { Nav } from './components/nav';
import { Welcome } from './components/welcome';
import { ZeroExActions } from './components/zeroex_actions';

// Kovan and Ropsten are test networks
// Please ensure you have Metamask installed
// and it is connected to the correct test network
// const NETWORK_ID = 3;
// const RPC = 'https://ropsten.infura.io';
const NETWORK_ID = 42;
const RPC = 'http://localhost:8545';

const App = () => {
    let renderContent;
    // Detect if Web3 is found, if not, ask the user to install Metamask
    const web3 = (window as any).web3;
    if (web3) {
        // Set up Web3 Provider Engine with a few helper Subproviders from 0x
        const providerEngine = new Web3ProviderEngine({ pollingInterval: 10000 });
        // All signing based requests are handled by the SignerSubprovider
        providerEngine.addProvider(new SignerSubprovider(web3.currentProvider));
        // All other requests will fall through to the next subprovider, such as data requests
        providerEngine.addProvider(new RPCSubprovider(RPC));
        providerEngine.start();

        const contractWrappers = new ContractWrappers(providerEngine, { networkId: NETWORK_ID });
        const web3Wrapper = new Web3Wrapper(providerEngine);
        const erc20TokenWrapper = contractWrappers.erc20Token;

        const AccountWithToasts = withToastManager(Account);
        const ZeroExActionsWithToasts = withToastManager(ZeroExActions);

        // Browse the individual files for more handy examples
        renderContent = (
            <div>
                <Welcome />
                <ToastProvider>
                    <Faucet web3Wrapper={web3Wrapper} />
                    <AccountWithToasts erc20TokenWrapper={erc20TokenWrapper} web3Wrapper={web3Wrapper} />
                    <ZeroExActionsWithToasts contractWrappers={contractWrappers} web3Wrapper={web3Wrapper} />
                </ToastProvider>
            </div>
        );
    } else {
        renderContent = <InstallMetamask />;
    }
    return (
        <div style={{ paddingLeft: 30, paddingRight: 30, paddingBottom: 30 }}>
            <Nav />
            <Content className="container">{renderContent}</Content>
            <Footer />
        </div>
    );
};

const e = React.createElement;
const main = document.getElementById('app');
if (main) {
    ReactDOM.render(e(App), main);
} else {
    console.log('Cannot find main container');
}

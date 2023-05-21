import { Injectable } from '@nestjs/common';
import {Contract,ethers} from 'ethers'
import { ConfigService } from '@nestjs/config';
import * as tokenJson from "../assets/MyERC20Votes.json"
import * as ballotJson from "../assets/TokenizedBallot.json"

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  tokenContract: ethers.Contract;
  ballotContract:ethers.Contract;
  constructor(private configService: ConfigService){
    const apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.provider = new ethers.providers.AlchemyProvider("goerli",apiKey);
    // this.provider = ethers.getDefaultProvider("goerli");
    this.tokenContract = new ethers.Contract(this.getTokenAddress(),tokenJson.abi,this.provider);
    this.ballotContract = new ethers.Contract(this.getBallotAddress(),ballotJson.abi,this.provider);

  }
  getHello(): string {
    return 'Hello World!';
  }
  getLastBlock(): Promise<ethers.providers.Block>{
    const provider = ethers.getDefaultProvider("goerli");
    return provider.getBlock("latest");
  }
  requestTokens(address:string,signature:string){
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider)

    return this.tokenContract.connect(signer).mint(address,ethers.utils.parseUnits("1"));
  }
  getVotingPower(address:string){
    return this.ballotContract.votingPower(address);
  }

  getTokenAddress(){
    const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS')
    return tokenAddress;
  }
  getBallotAddress(){
    const ballotAddress = this.configService.get<string>('BALLOT_ADDRESS')
    return ballotAddress;
  }

  getTotalSupply(){
    return this.tokenContract.totalSupply();
  }
  resetBallot(){
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider)
    return this.ballotContract.connect(signer).updateBlock();

  }

}


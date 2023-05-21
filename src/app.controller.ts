import { Controller, Get ,Post,Body,Param} from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDto } from 'dtos/requestTokens.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("last-block")
  getLastBlock(){
    return this.appService.getLastBlock();
  }

  @Get("get-total-supply")
  getTotalSupply(){
    return this.appService.getTotalSupply();
  }
  @Get("get-token-address")
  getTokenAddress(){
    return this.appService.getTokenAddress();
  }
  @Get("get-voting-power/:address")
  getVotingPower(@Param('address') address:string){
    return this.appService.getVotingPower(address);
  }
  @Post('request-tokens')
  request(@Body() body:RequestTokensDto){
    return this.appService.requestTokens(body.address,body.signature);
  }
  @Post('reset-ballot')
  resetBallot(){
    return this.appService.resetBallot();

  }
}

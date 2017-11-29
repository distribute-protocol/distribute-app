export const WorkerRegistryAddress = '0x35b338b4ade005f25a8982a597638827b8617ad4'
export const WorkerRegistryABI = `[{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"}],"name":"refundStaker","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_tokens","type":"uint256"},{"name":"_wei","type":"uint256"}],"name":"rewardWorker","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_tokens","type":"uint256"},{"name":"_secretHash","type":"bytes32"},{"name":"_prevPollID","type":"uint256"}],"name":"voteCommit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_tokens","type":"uint256"}],"name":"burnTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_voteOption","type":"uint256"},{"name":"_salt","type":"uint256"}],"name":"voteReveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalFreeWorkerTokenSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"uint256"}],"name":"refundVotingTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalWorkerTokenSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_taskHash","type":"bytes32"}],"name":"submitTaskHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolderRegistry","type":"address"},{"name":"_plcrVoting","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_tokens","type":"uint256"}],"name":"unstakeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_projectId","type":"uint256"},{"name":"_tokens","type":"uint256"}],"name":"stakeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]`
export const WorkerRegistryBytecode = `0x6060604052341561000f57600080fd5b6118d08061001e6000396000f3006060604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630d2efe3f146100ca5780631aa3a008146100ed57806364dbf873146101025780637d6bd25c146101375780638e81c64d146101795780638ee9ad32146101a5578063934383f3146101da5780639ab6767314610203578063a1bad6e114610226578063ece443641461024f578063f09a40161461027f578063ffa7a4a3146102d7578063ffab4bd914610303575b600080fd5b34156100d557600080fd5b6100eb600480803590602001909190505061032f565b005b34156100f857600080fd5b610100610509565b005b341561010d57600080fd5b610135600480803590602001909190803590602001909190803590602001909190505061059e565b005b341561014257600080fd5b61017760048080359060200190919080359060200190919080356000191690602001909190803590602001909190505061080e565b005b341561018457600080fd5b6101a36004808035906020019091908035906020019091905050610e2c565b005b34156101b057600080fd5b6101d86004808035906020019091908035906020019091908035906020019091905050610f2c565b005b34156101e557600080fd5b6101ed61109d565b6040518082815260200191505060405180910390f35b341561020e57600080fd5b61022460048080359060200190919050506110a3565b005b341561023157600080fd5b6102396111db565b6040518082815260200191505060405180910390f35b341561025a57600080fd5b61027d6004808035906020019091908035600019169060200190919050506111e1565b005b341561028a57600080fd5b6102d5600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061135b565b005b34156102e257600080fd5b610301600480803590602001909190803590602001909190505061146a565b005b341561030e57600080fd5b61032d6004808035906020019091908035906020019091905050611639565b005b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8846000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b15156103ca57600080fd5b6102c65a03f115156103db57600080fd5b5050506040518051905091508173ffffffffffffffffffffffffffffffffffffffff16635c352318336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b151561048a57600080fd5b6102c65a03f1151561049b57600080fd5b5050506040518051905090508060046000828254019250508190555080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550505050565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151561055757600080fd5b6001600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550565b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8866000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561063957600080fd5b6102c65a03f1151561064a57600080fd5b5050506040518051905091508173ffffffffffffffffffffffffffffffffffffffff1663e96f11a93386866000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019350505050602060405180830381600087803b151561070957600080fd5b6102c65a03f1151561071a57600080fd5b5050506040518051905090506000811115610807576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630e11959533836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15156107f257600080fd5b6102c65a03f1151561080357600080fd5b5050505b5050505050565b60008060006001600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561086157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639facbedd886000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b15156108f957600080fd5b6102c65a03f1151561090a57600080fd5b5050506040518051905092506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166326d2ce676000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15156109a357600080fd5b6102c65a03f115156109b457600080fd5b505050604051805190509150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636b2d95d4336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515610a8557600080fd5b6102c65a03f11515610a9657600080fd5b50505060405180519050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166387c6bb9c336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515610b6557600080fd5b6102c65a03f11515610b7657600080fd5b5050506040518051905003905085811015610d2b57808603600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610bdc5750818711155b8015610be85750600087115b1515610bf357600080fd5b85600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555085600460008282540392505081905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c5fa801b338389036040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1515610d1657600080fd5b6102c65a03f11515610d2757600080fd5b5050505b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635e28fd5e3385888a896040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001846000191660001916815260200183815260200182815260200195505050505050600060405180830381600087803b1515610e0f57600080fd5b6102c65a03f11515610e2057600080fd5b50505050505050505050565b3373ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8846000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1515610edb57600080fd5b6102c65a03f11515610eec57600080fd5b5050506040518051905073ffffffffffffffffffffffffffffffffffffffff16141515610f1857600080fd5b806003600082825403925050819055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639facbedd856000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1515610fc657600080fd5b6102c65a03f11515610fd757600080fd5b505050604051805190509050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b11d8bb88285856040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018381526020018281526020019350505050600060405180830381600087803b151561108357600080fd5b6102c65a03f1151561109457600080fd5b50505050505050565b60045481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ef348e4033836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b151561116757600080fd5b6102c65a03f1151561117857600080fd5b50505080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508060046000828254019250508190555050565b60035481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8846000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561127b57600080fd5b6102c65a03f1151561128c57600080fd5b5050506040518051905090508073ffffffffffffffffffffffffffffffffffffffff1663513204c683336040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050600060405180830381600087803b151561134257600080fd5b6102c65a03f1151561135357600080fd5b505050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161480156113da57506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15156113e557600080fd5b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8846000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561150457600080fd5b6102c65a03f1151561151557600080fd5b50505060405180519050905081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816004600082825401925050819055508073ffffffffffffffffffffffffffffffffffffffff1663fe12c92a83336040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050600060405180830381600087803b151561162057600080fd5b6102c65a03f1151561163157600080fd5b505050505050565b60006001600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561168957600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634ca3e9b8846000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561172157600080fd5b6102c65a03f1151561173257600080fd5b50505060405180519050905081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561178c57600080fd5b81600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816004600082825403925050819055508073ffffffffffffffffffffffffffffffffffffffff16630475722183336040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050600060405180830381600087803b151561188b57600080fd5b6102c65a03f1151561189c57600080fd5b5050505050505600a165627a7a723058205dc20fa64d7727dee28f98ae81b994bcce9559105cc55395a6dd4bde4cfda2eb0029`

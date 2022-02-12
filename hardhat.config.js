require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("dotenv").config();

const { ALCHEMY_API_KEY, RINKEBY_PRIVATE_KEY } = process.env;

// задачи
require("./tasks/insert-donation");
require("./tasks/send-donation");
require("./tasks/get-all-donors");
require("./tasks/get-all-donations-of-current-donor");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`]
    }
  }
};

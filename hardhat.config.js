require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const { ALCHEMY_API_KEY, RINKEBY_PRIVATE_KEY } = process.env;

require("./tasks/insertDonation"); // задачи

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

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", () => {
  it("Deployment should assign the total supply of tokens to the owner", async () => {
    const [owner] = await ethers.getSigners();
    console.log('test: ', owner.address);

    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});

describe("Transactions", () => {
  it("Should transfer tokens between accounts", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });

  it("Should fail if sender doesn’t have enough tokens", async () => {
    const [owner, addr1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(
      hardhatToken.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("Not enough tokens");

    // Owner balance shouldn't have changed.
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });
});
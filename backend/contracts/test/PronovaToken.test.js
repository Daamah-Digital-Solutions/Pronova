const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PronovaToken Contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("PronovaToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("Pronova");
      expect(await token.symbol()).to.equal("PRN");
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("1000000000"));
    });

    it("Should assign the total supply to the contract initially", async function () {
      const contractBalance = await token.balanceOf(await token.getAddress());
      expect(await token.totalSupply()).to.equal(contractBalance);
    });
  });

  describe("Allocations", function () {
    it("Should have correct presale allocation", async function () {
      const presaleAllocation = await token.PRESALE_ALLOCATION();
      expect(presaleAllocation).to.equal(ethers.parseEther("400000000"));
    });

    it("Should have correct team allocation", async function () {
      const teamAllocation = await token.TEAM_ALLOCATION();
      expect(teamAllocation).to.equal(ethers.parseEther("150000000"));
    });

    it("Should have correct liquidity allocation", async function () {
      const liquidityAllocation = await token.LIQUIDITY_ALLOCATION();
      expect(liquidityAllocation).to.equal(ethers.parseEther("200000000"));
    });
  });

  describe("Transactions", function () {
    beforeEach(async function () {
      // Transfer some tokens from contract to owner for testing
      await token.emergencyWithdraw();
    });

    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      // Try to send 1 token from addr1 (0 balance) to owner
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed
      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await token.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2
      await token.transfer(addr2.address, 50);

      // Check balances
      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Pausable", function () {
    beforeEach(async function () {
      // Transfer some tokens from contract to owner for testing
      await token.emergencyWithdraw();
    });

    it("Should pause and unpause transfers", async function () {
      // Transfer some tokens first
      await token.transfer(addr1.address, 100);
      
      // Pause the contract
      await token.pause();
      
      // Should fail to transfer when paused
      await expect(
        token.transfer(addr1.address, 100)
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
      
      // Unpause the contract
      await token.unpause();
      
      // Should work after unpause
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(200);
    });

    it("Should only allow owner to pause", async function () {
      await expect(
        token.connect(addr1).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burnable", function () {
    beforeEach(async function () {
      // Transfer some tokens from contract to owner for testing
      await token.emergencyWithdraw();
    });

    it("Should burn tokens and reduce total supply", async function () {
      const initialSupply = await token.totalSupply();
      const burnAmount = ethers.parseEther("1000");
      
      await token.burn(burnAmount);
      
      const newSupply = await token.totalSupply();
      expect(newSupply).to.equal(initialSupply - burnAmount);
    });

    it("Should track burned tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      await token.burn(burnAmount);
      
      const totalBurned = await token.totalBurned();
      expect(totalBurned).to.equal(burnAmount);
    });

    it("Should burn from caller's balance", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      const burnAmount = ethers.parseEther("1000");
      
      await token.burn(burnAmount);
      
      const newBalance = await token.balanceOf(owner.address);
      expect(newBalance).to.equal(initialBalance - burnAmount);
    });
  });
});
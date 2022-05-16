const { getNamedAccounts, deployments, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../deploy-helpers/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("----------------------------------------------------")
  log("Deploying autoSol and waiting for confirmations...")
  let blockConfirmations = 0
  if (network.name != "localhost" && network.name != "hardhat") {
    blockConfirmations = 6
  }
  const autoSol = await deploy("autoSol", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: blockConfirmations,
  })
  log(`autoSol deployed at ${autoSol.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(autoSol.address, [])
  }
}

module.exports.tags = ["all", "autoSol"]

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name = 'My Hardhat Token';
    string public symbol = 'MHT';
    uint256 public totalSupply = 1000000;
    address public owner;
    mapping(address => uint256) balances;

    // для тестового задания
    address[] public donors;
    mapping(address => uint256) donations;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transferTest(address recipient, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        require(msg.sender != recipient, "You can't send money to yourself!");

        balances[msg.sender] = balances[msg.sender] - amount;
        balances[recipient] = balances[recipient] + amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    // для тестового задания
    // В контракте имеется функция вноса любой суммы пожертвования в нативной валюте блокчейна
    function addDonation(address sender, uint256 donation) external {
        donations[sender] = donations[sender] + donation;

        // donors.push(address(sender));
        donors.push(sender);
    }

    // В контракте имеется функция вывода любой суммы на любой адрес,
    // при этом функция может быть вызвана только владельцем контракта
    function transfer(address recipient, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        require(msg.sender != recipient, "You can't send money to yourself!");

        balances[msg.sender] = balances[msg.sender] - amount;
        balances[recipient] = balances[recipient] + amount;
    }

    // В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование.
    // В списке не должно быть повторяющихся элементов
    function getAllDonors() external view returns (address[] memory) {
        return donors;
    }

    // В контракте имеется view функция позволяющая получить общую сумму всех пожертвований
    // для определённого адреса
    function getCurrentDonation(address currentDonor) external view returns (uint256) {
        return donations[currentDonor];
    }
}

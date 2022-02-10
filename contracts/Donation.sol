// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donation {
    // для тестового задания
    address[] public donors;
    mapping(address => uint256) donations;
    mapping(address => uint256) allDonations;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // для тестового задания
    // В контракте имеется функция вноса любой суммы пожертвования в нативной валюте блокчейна
    function insertDonation() external payable {
        console.log("msg.sender, msg.value && balance: ", msg.sender, msg.value);
        require(msg.sender != owner, "You are not owner");
        console.log('after require');

        donations[owner] = donations[owner] + msg.value;
        allDonations[msg.sender] = allDonations[msg.sender] + msg.value;

        donors.push(msg.sender);
    }

    // В контракте имеется функция вывода любой суммы на любой адрес,
    // при этом функция может быть вызвана только владельцем контракта
    function sendDonation(address recipient, uint256 amount) external payable {
        require(msg.sender == owner, "You are not owner");
        require(balances[msg.sender] >= amount, "Not enough tokens");
        require(msg.sender != recipient, "You can't send money to yourself!");

        donations[msg.sender] = donations[msg.sender] - amount;
        donations[recipient] = donations[recipient] + amount;
    }

    // В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование.
    // В списке не должно быть повторяющихся элементов
    function getAllDonors() external view returns (address[] memory) {
        return donors;
    }

    // В контракте имеется view функция позволяющая получить общую сумму всех пожертвований
    // для определённого адреса
    function getCurrentDonation(address currentDonor) external view returns (uint256) {
        // test
        console.log('balance TEST:', currentDonor.balance);
        console.log('currentDonor:', currentDonor);
        console.log('balances[currentDonor]:', allDonations[currentDonor]);

        return allDonations[currentDonor];
    }
}

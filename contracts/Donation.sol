// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donation {
    address public owner;
    address[] public donors;
    mapping(address => uint256) public donations;
    mapping(address => uint256) public allDonations;

    constructor() {
        owner = msg.sender;
    }

    // для тестового задания
    // В контракте имеется функция вноса любой суммы пожертвования в нативной валюте блокчейна
    function insertDonation(uint256 amount) public payable {
        // require(msg.sender != owner, "You are owner");
        console.log('param: ', msg.sender, msg.value);

        if (allDonations[msg.sender] == 0) {
            donors.push(msg.sender);
        }

        // donations[owner] = donations[owner] + msg.value;
        // allDonations[msg.sender] = allDonations[msg.sender] + msg.value;
        donations[owner] = donations[owner] + amount;
        allDonations[msg.sender] = allDonations[msg.sender] + amount;
    }

    // В контракте имеется функция вывода любой суммы на любой адрес,
    // при этом функция может быть вызвана только владельцем контракта
    function sendDonation(address recipient, uint256 amount) public {
        require(msg.sender == owner, "You are not owner");
        require(donations[msg.sender] >= amount, "Not enough tokens");
        require(msg.sender != recipient, "You can't send money to yourself!");

        donations[msg.sender] = donations[msg.sender] - amount;
        donations[recipient] = donations[recipient] + amount;
    }

    // В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование.
    // В списке не должно быть повторяющихся элементов
    function getAllDonors() public view returns (address[] memory) {
        return donors;
    }

    // В контракте имеется view функция позволяющая получить общую сумму всех пожертвований
    // для определённого адреса
    function getAllDonationsOfCurrentDonor(address currentDonor) public view returns (uint256) {
        return allDonations[currentDonor];
    }

    function balanceOf(address donor) public view returns (uint256) {
        return donations[donor];
    }
}

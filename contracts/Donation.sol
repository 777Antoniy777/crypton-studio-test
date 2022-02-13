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
    function insertDonation() external payable {
        require(msg.sender != owner, "You are owner");

        bool isUnique = true;
        donations[owner] = donations[owner] + msg.value;
        allDonations[msg.sender] = allDonations[msg.sender] + msg.value;

        if (donors.length != 0) {
            for (uint i = 0; i < donors.length; i++) {
                if (donors[i] == msg.sender) {
                    isUnique = false;
                }
            }

            if (isUnique) {
                donors.push(msg.sender);
            }

            return;
        }

        donors.push(msg.sender);
    }

    // В контракте имеется функция вывода любой суммы на любой адрес,
    // при этом функция может быть вызвана только владельцем контракта
    function sendDonation(address recipient, uint256 amount) external payable {
        require(msg.sender == owner, "You are not owner");
        require(donations[msg.sender] >= amount, "Not enough tokens");
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
    function getAllDonationsOfCurrentDonor(address currentDonor) external view returns (uint256) {
        return allDonations[currentDonor];
    }

    function balanceOf(address donor) external view returns (uint256) {
        return donations[donor];
    }
}

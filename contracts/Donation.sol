// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donation {
    address public owner;
    address[] public donors;
    uint public donations;
    mapping(address => uint) public allDonations;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        insertDonation();
    }

    // В контракте имеется функция вноса любой суммы пожертвования в нативной валюте блокчейна
    function insertDonation() public payable {
        if (allDonations[msg.sender] == 0 && msg.value != 0) {
            donors.push(msg.sender);
        }

         // NOTE: вроде если receive не отработает, то должна быть ф-ция fallback
         donations = donations + msg.value;
         allDonations[msg.sender] = allDonations[msg.sender] + msg.value;
    }

    // В контракте имеется функция вывода любой суммы на любой адрес,
    // при этом функция может быть вызвана только владельцем контракта
    function sendDonation(address payable recipient, uint amount) external {
        require(msg.sender == owner, "You are not owner");
        require(donations >= amount, "Not enough amount of ether");

        donations = donations - amount;
        recipient.transfer(amount);
    }

    // В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование.
    // В списке не должно быть повторяющихся элементов
    function getAllDonors() public view returns (address[] memory) {
        return donors;
    }

    // В контракте имеется view функция позволяющая получить общую сумму всех пожертвований
    // для определённого адреса
    function getAllDonationsOfCurrentDonor(address currentDonor) public view returns (uint) {
        return allDonations[currentDonor];
    }

    function balanceOf() public view returns (uint) {
        return donations;
    }
}

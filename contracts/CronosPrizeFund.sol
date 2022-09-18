pragma solidity ^0.4.17;

contract CronosPrizeFund {
    function withdraw() public {
        msg.sender.transfer(this.balance);
        // Currently a public function, but will only be callable by whitelisted addresses (tournament winners) n number of times in production
    }

    function deposit(uint256 amount) payable public {
        require(msg.value == amount);
    }

    function getBalance() public view returns (uint256) {
        return this.balance;
    } 
}
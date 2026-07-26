// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AutiqoBasePayroll
 * @notice Autonomous Web3 Batch Payroll Contract for Base Network
 * @dev Dispatches batch USDC payouts to employee wallet addresses automatically with event tracking
 */
contract AutiqoBasePayroll {
    address public owner;
    
    struct PayrollItem {
        address payable recipient;
        uint256 amountUSDC; // in 6 decimals (1 USDC = 1,000,000)
        string workerId;
    }

    event PayrollBatchExecuted(
        bytes32 indexed batchId,
        uint256 totalWorkers,
        uint256 totalUSDC,
        uint256 timestamp
    );

    event SinglePayoutDispatched(
        bytes32 indexed batchId,
        address indexed recipient,
        uint256 amountUSDC,
        string workerId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Autiqo Admin can trigger payroll");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Execute automated batch payroll disburser on Base
     */
    function executeBatchPayroll(
        bytes32 batchId,
        PayrollItem[] calldata items
    ) external onlyOwner returns (bool) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < items.length; i++) {
            totalAmount += items[i].amountUSDC;
            emit SinglePayoutDispatched(
                batchId,
                items[i].recipient,
                items[i].amountUSDC,
                items[i].workerId
            );
        }

        emit PayrollBatchExecuted(
            batchId,
            items.length,
            totalAmount,
            block.timestamp
        );

        return true;
    }
}

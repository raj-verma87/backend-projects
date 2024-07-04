param(
    [string]$vmName,
    [string]$resourceGroupName
)

# Authenticate with Azure
Connect-AzAccount

# Start the virtual machine
Start-AzVM -Name $vmName -ResourceGroupName $resourceGroupName

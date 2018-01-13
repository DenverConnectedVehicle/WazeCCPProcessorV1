# Azure WazeCCProcessor  
Azure Waze data processor takes [Waze CCP](https://www.waze.com/ccp) data feed by using the Azure Logic Apps and store the data in Azure Blob and each entry in the Azure Service Queue which then be parsed and persisted into Azure tables using Azure Functions.

## Architecture

Placed the pdf version inside the [docs folder](https://github.com/CityofDenver/WazeCCProcessorV1/blob/master/azure/docs/WazeCCPprocessorAzureV1.pdf). 

XML version of the diagram is available inside the [docs folder](https://github.com/CityofDenver/WazeCCProcessorV1/blob/master/azure/docs/WazeCCPprocessorAzureV1.xml) folder which can be opened using the [draw.io](https://www.draw.io/) for future modifications. 

# WazeCCProcessorV1

[Waze CCP](https://www.waze.com/ccp) data feed processor for AWS and Azure

## Overview

Denver is collaborating with Louisville and other CCP partners to create an automated Waze processing solution that can be replicated by any CCP Partner using cloud infrastructure like AWS, Azure and CGP.

The required cloud infrastructure stack can be deployed by using the respective cloud Terraform templates available part of this Github.

Once the required infrastructure deployed, respective parser functions which is available part of this Github code can be deployed which will parse the data and save into a relational database and then the data analysts can make use of any visualizations tool like Tableau, PowerBI, QuickSight to connect the tables and gain current and historical insights.   

## What is Completed

Azure - Data Ingestion, Data Processing, Data storage, Data visualizations, Terraform Templates, Architecture Flow Diagram.
AWS - Data Ingestion (Louisville), Data Processing, Data Storage, Data visualizations, Terraform Templates, Architecture Flow Diagram (Louisville)
GCP - Yet to start the implementation. 

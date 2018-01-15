/* Configure Azure Provider and declare all the Variables that will be used in Terraform configurations */

variable "subscription_id" {
  description = "Enter Subscription ID for provisioning resources in Azure"
}

variable "client_id" {
  description = "Enter Client ID for Application created in Azure AD"
}

variable "client_secret" {
  description = "Enter Client secret for Application in Azure AD"
}

variable "tenant_id" {
  description = "Enter Tenant ID / Directory ID of your Azure AD. Run Get-AzureSubscription to know your Tenant ID"
}

variable "environment" {
  description = "A mapping of tags to assign to the resource - production, development, testing, pre-production"
}


variable "resource_group_name" {
  description = "The name of the resource group where to create the resources like the storage, table needs to be created"
}

variable "location" {
  description = "The location/region where the database and server are created. Changing this forces a new resource to be created."
}

variable "storage_account_name" {
  description = "The name of the storage account"
}

variable "storage_container_name" {
  description = "The name of the storage container"
}

variable "storage_blob_name" {
  description = "The name of the storage blob"
}

variable "storage_table_name" {
  description = "The name of the storage blob table"
}

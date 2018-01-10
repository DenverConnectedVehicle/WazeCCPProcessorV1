provider "azurerm" {
#   subscription_id = ${"var.subscription_id"}
#   client_id       = ${"var.client_id"}
#   client_secret   = ${"var.client_secret"}
#   tenant_id       = ${"var.tenant_id"}
#
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.resource_group_name}"
  location = "${var.location}"
}
tags {
    environment = {"var.environment"}
  }

resource "azurerm_storage_account" "sa" {
  name                     = "${var.storage_account_name}"
  resource_group_name      = "${azurerm_resource_group.rg.name}"
  location                 = "${var.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "sc" {
  name                  = "${var.storage_container_name}"
  resource_group_name   = "${azurerm_resource_group.rg.name}"
  storage_account_name  = "${azurerm_storage_account.sa.name}"
  container_access_type = "private"
}

resource "azurerm_storage_blob" "sb" {
  name                   = "${var.storage_blob_name}"
  resource_group_name    = "${azurerm_resource_group.rg.name}"
  storage_account_name   = "${azurerm_storage_account.sa.name}"
  storage_container_name = "${azurerm_storage_container.sc.name}"

  type = "page"
  size = 5120
}

resource "azurerm_storage_table" "st" {
  name                 = "${var.storage_table_name}"
  resource_group_name  = "${azurerm_resource_group.rg.name}"
  storage_account_name = "${azurerm_storage_account.sa.name}"
}

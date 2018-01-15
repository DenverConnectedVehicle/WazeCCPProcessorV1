output "resource_group_name" {
  value = "${azurerm_resource_group.rg.name}"
}

output "storage_account_name" {
  value = "${azurerm_storage_account.sa.name}"
}

output "storage_container_name" {
  value = "${azurerm_storage_container.sc.name}"
}

output "storage_blob_name" {
  value = "${azurerm_storage_blob.sb.name}"
}

output "storage_table_name" {
  value = "${azurerm_storage_table.st.name}"
}

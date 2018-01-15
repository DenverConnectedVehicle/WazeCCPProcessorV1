# main.tf
The main.tf file contains the actual resources that will be deployed. It also contains the Azure Resource Group definition and any defined variables.

# variables.tf
The variables.tf file contains all of the input parameters that the user can specify when deploying this Terraform template.

# output.tf
This data is outputted when terraform apply is called, and can be queried using the terraform output command.

# Terraform Details
[Install and Configurations](https://www.terraform.io/intro/getting-started/install.html)

If you use Homebrew on MacOS already, you can install Terraform simply by

$ brew install terraform

and upgrade by

$ brew upgrade terraform

# Build infrastructure 

Download the terraform templates in a folder

Navigate to the folder

Exceute the below commands

terraform init 

# Usage

Provide values to all variables (credentials and names).

Create with terraform apply

Destroy all with terraform destroy --force

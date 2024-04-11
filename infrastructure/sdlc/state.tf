# To note, the only manual text to change is the bucket name
# Here it is "794078205100-terraform-state-env"


# Envionments setup
locals {
  workspace = jsondecode(file("./envs/${terraform.workspace}.json"))
}

# Get the current region
data "aws_region" "current" {}

# Get the current user id
data "aws_canonical_user_id" "current" {}

# Get the current account id
data "aws_caller_identity" "current" {}

# Set the AWS Provider to assume the role to the env account
provider "aws" {
  region  = "us-east-1"
  profile = "794078205100"
  assume_role {
    role_arn = "arn:aws:iam::${local.workspace.awsAccountNumber}:role/provision"
  }
}

# Use the terraform state from the infra account
terraform {
  backend "s3" {
    region  = "us-east-1"
    encrypt = true
    bucket  = "794078205100-terraform-state-env--invaders"
    key     = "terraform.tfstate"
    profile = "794078205100"
  }
}

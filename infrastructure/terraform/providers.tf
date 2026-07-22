provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CDW-MarketShop"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
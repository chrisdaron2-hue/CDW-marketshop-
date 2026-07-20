variable "aws_region" {
  description = "AWS region for CDW MarketShop"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name"
  type        = string

  validation {
    condition     = length(var.bucket_name) >= 3 && length(var.bucket_name) <= 63
    error_message = "The bucket name must contain between 3 and 63 characters."
  }
}

variable "budget_email" {
  description = "Email address that receives AWS budget alerts"
  type        = string

  validation {
    condition     = can(regex("^[^@]+@[^@]+\\.[^@]+$", var.budget_email))
    error_message = "Enter a valid email address."
  }
}
output "product_images_bucket_name" {
  description = "Name of the S3 bucket for product images"
  value       = aws_s3_bucket.product_images.bucket
}

output "product_images_bucket_arn" {
  description = "ARN of the S3 bucket for product images"
  value       = aws_s3_bucket.product_images.arn
}

output "aws_region" {
  description = "AWS region used for the infrastructure"
  value       = var.aws_region
}
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
output "s3_upload_lambda_name" {
  description = "Name of the Lambda function that creates upload URLs"
  value       = aws_lambda_function.create_upload_url.function_name
}

output "s3_upload_lambda_arn" {
  description = "ARN of the Lambda function that creates upload URLs"
  value       = aws_lambda_function.create_upload_url.arn
}

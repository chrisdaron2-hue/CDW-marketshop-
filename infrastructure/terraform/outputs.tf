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

output "marketshop_api_url" {
  description = "Base URL for the CDW MarketShop HTTP API"
  value       = aws_apigatewayv2_api.marketshop.api_endpoint
}

output "upload_url_endpoint" {
  description = "Endpoint for requesting an S3 upload URL"
  value       = "${aws_apigatewayv2_api.marketshop.api_endpoint}/upload-url"
}
output "s3_view_lambda_name" {
  description = "Name of the Lambda function that creates image view URLs"
  value       = aws_lambda_function.create_image_url.function_name
}

output "image_url_endpoint" {
  description = "Endpoint for requesting temporary product image URLs"
  value       = "${aws_apigatewayv2_api.marketshop.api_endpoint}/image-url"
}
output "products_table_name" {
  description = "Name of the DynamoDB products table"
  value       = aws_dynamodb_table.products.name
}

output "products_table_arn" {
  description = "ARN of the DynamoDB products table"
  value       = aws_dynamodb_table.products.arn
}

output "products_lambda_name" {
  description = "Name of the Lambda function that manages products"
  value       = aws_lambda_function.products.function_name
}

output "products_api_endpoint" {
  description = "Endpoint for creating and loading products"
  value       = "${aws_apigatewayv2_api.marketshop.api_endpoint}/products"
}

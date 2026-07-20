resource "aws_apigatewayv2_api" "marketshop" {
  name          = "cdw-marketshop-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "http://localhost:8081",
      "http://localhost:19006"
    ]

    allow_methods = [
      "POST",
      "OPTIONS"
    ]

    allow_headers = [
      "Content-Type",
      "Authorization"
    ]

    max_age = 3600
  }
}

resource "aws_apigatewayv2_integration" "create_upload_url" {
  api_id = aws_apigatewayv2_api.marketshop.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.create_upload_url.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

resource "aws_apigatewayv2_route" "create_upload_url" {
  api_id = aws_apigatewayv2_api.marketshop.id

  route_key = "POST /upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.create_upload_url.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.marketshop.id

  name        = "$default"
  auto_deploy = true

  default_route_settings {
    detailed_metrics_enabled = false
    throttling_burst_limit   = 5
    throttling_rate_limit    = 2
  }
}

resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowApiGatewayInvokeUploadLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_upload_url.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.marketshop.execution_arn}/*/POST/upload-url"
}
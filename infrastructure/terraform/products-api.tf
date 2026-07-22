resource "aws_apigatewayv2_integration" "products" {
  api_id = aws_apigatewayv2_api.marketshop.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.products.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

resource "aws_apigatewayv2_route" "get_products" {
  api_id = aws_apigatewayv2_api.marketshop.id

  route_key = "GET /products"
  target    = "integrations/${aws_apigatewayv2_integration.products.id}"
}

resource "aws_apigatewayv2_route" "create_product" {
  api_id = aws_apigatewayv2_api.marketshop.id

  route_key = "POST /products"
  target    = "integrations/${aws_apigatewayv2_integration.products.id}"
}

resource "aws_apigatewayv2_route" "delete_product" {
  api_id = aws_apigatewayv2_api.marketshop.id

  route_key = "DELETE /products/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.products.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_products" {
  statement_id  = "AllowApiGatewayGetProducts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.products.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.marketshop.execution_arn}/*/GET/products"
}

resource "aws_lambda_permission" "allow_api_gateway_create_product" {
  statement_id  = "AllowApiGatewayCreateProduct"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.products.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.marketshop.execution_arn}/*/POST/products"
}

resource "aws_lambda_permission" "allow_api_gateway_delete_product" {
  statement_id  = "AllowApiGatewayDeleteProduct"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.products.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.marketshop.execution_arn}/*/DELETE/products/*"
}

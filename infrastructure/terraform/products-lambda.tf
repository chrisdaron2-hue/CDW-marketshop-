data "archive_file" "products_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/products"
  output_path = "${path.module}/products.zip"
}

data "aws_iam_policy_document" "products_lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "products_lambda" {
  name = "cdw-marketshop-products-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.products_lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "products_lambda_basic_execution" {
  role       = aws_iam_role.products_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "products_table_permissions" {
  statement {
    sid    = "AllowProductsTableAccess"
    effect = "Allow"

    actions = [
      "dynamodb:Scan",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]

    resources = [
      aws_dynamodb_table.products.arn
    ]
  }
}

resource "aws_iam_role_policy" "products_table_permissions" {
  name = "cdw-marketshop-products-table-permissions"

  role   = aws_iam_role.products_lambda.id
  policy = data.aws_iam_policy_document.products_table_permissions.json
}

resource "aws_cloudwatch_log_group" "products_lambda" {
  name              = "/aws/lambda/cdw-marketshop-products-${var.environment}"
  retention_in_days = 7
}

resource "aws_lambda_function" "products" {
  function_name = "cdw-marketshop-products-${var.environment}"

  filename         = data.archive_file.products_lambda.output_path
  source_code_hash = data.archive_file.products_lambda.output_base64sha256

  role    = aws_iam_role.products_lambda.arn
  handler = "index.handler"
  runtime = "nodejs22.x"

  memory_size = 128
  timeout     = 10

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.products.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.products_lambda_basic_execution,
    aws_iam_role_policy.products_table_permissions,
    aws_cloudwatch_log_group.products_lambda
  ]
}

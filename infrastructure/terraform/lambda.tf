data "archive_file" "s3_upload_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/s3-upload"
  output_path = "${path.module}/s3-upload.zip"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "s3_upload_lambda" {
  name = "cdw-marketshop-s3-upload-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.s3_upload_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "s3_upload_permissions" {
  statement {
    sid    = "AllowProductImageUploads"
    effect = "Allow"

    actions = [
      "s3:PutObject"
    ]

    resources = [
      "${aws_s3_bucket.product_images.arn}/products/*"
    ]
  }
}

resource "aws_iam_role_policy" "s3_upload_permissions" {
  name = "cdw-marketshop-s3-upload-permissions"

  role   = aws_iam_role.s3_upload_lambda.id
  policy = data.aws_iam_policy_document.s3_upload_permissions.json
}

resource "aws_lambda_function" "create_upload_url" {
  function_name = "cdw-marketshop-create-upload-url-${var.environment}"

  filename         = data.archive_file.s3_upload_lambda.output_path
  source_code_hash = data.archive_file.s3_upload_lambda.output_base64sha256

  role    = aws_iam_role.s3_upload_lambda.arn
  handler = "index.handler"
  runtime = "nodejs22.x"

  memory_size = 128
  timeout     = 10

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.product_images.bucket
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy.s3_upload_permissions
  ]
}

data "archive_file" "s3_view_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/s3-view"
  output_path = "${path.module}/s3-view.zip"
}

data "aws_iam_policy_document" "s3_view_lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "s3_view_lambda" {
  name = "cdw-marketshop-s3-view-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.s3_view_lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "s3_view_lambda_basic_execution" {
  role       = aws_iam_role.s3_view_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "s3_view_permissions" {
  statement {
    sid    = "AllowProductImageReads"
    effect = "Allow"

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.product_images.arn}/products/*"
    ]
  }
}

resource "aws_iam_role_policy" "s3_view_permissions" {
  name = "cdw-marketshop-s3-view-permissions"

  role   = aws_iam_role.s3_view_lambda.id
  policy = data.aws_iam_policy_document.s3_view_permissions.json
}

resource "aws_lambda_function" "create_image_url" {
  function_name = "cdw-marketshop-create-image-url-${var.environment}"

  filename         = data.archive_file.s3_view_lambda.output_path
  source_code_hash = data.archive_file.s3_view_lambda.output_base64sha256

  role    = aws_iam_role.s3_view_lambda.arn
  handler = "index.handler"
  runtime = "nodejs22.x"

  memory_size = 128
  timeout     = 10

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.product_images.bucket
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.s3_view_lambda_basic_execution,
    aws_iam_role_policy.s3_view_permissions
  ]
}

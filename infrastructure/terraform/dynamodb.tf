resource "aws_dynamodb_table" "products" {
  name         = "cdw-marketshop-products-${var.environment}"
  billing_mode = "PROVISIONED"

  read_capacity  = 1
  write_capacity = 1

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  table_class = "STANDARD"

  server_side_encryption {
    enabled = true
  }

  tags = {
    Name = "CDW MarketShop Products"
  }
}

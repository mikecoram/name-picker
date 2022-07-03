variable "aws_region" {
  type        = string
  description = "The AWS region to put the bucket into"
  default     = "eu-west-2"
}

variable "hosted_url" {
  type        = string
  description = "The url where the service is available"
  default     = "https://uc67vqv73hjphy76xr2g3gyzs40nhcrw.lambda-url.eu-west-2.on.aws"
}

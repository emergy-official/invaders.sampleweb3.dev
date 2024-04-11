###################################
# 1. S3 BUCKET TO STORE THE WEBSITE
###################################

resource "aws_s3_bucket" "website" {
  bucket = var.domain_name

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "${var.domain_name} website"
  }
}

resource "aws_s3_bucket_cors_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["https://${var.domain_name}",]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }

  routing_rule {
    condition {
      key_prefix_equals = "/"
    }
    redirect {
      replace_key_prefix_with = "${var.domain_name}"
      http_redirect_code = 302
      protocol = "https"
      replace_key_with = ""
    }
  }
}

# Enable bucket versionning
resource "aws_cloudfront_response_headers_policy" "website" {
  name    = "${var.prefix}-website-cors-policy"

  cors_config {
    # If set to true, allow headers need to be set
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }
    access_control_expose_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["DELETE","GET","HEAD","OPTIONS","PATCH","POST","PUT"]
    }

    access_control_allow_origins {
      items = ["*"]
    }

    access_control_max_age_sec = 600

    origin_override = true
  }
}

#################################################
# 2. CLOUDFRONT TO ALLOW PUBLIC ACCESS WITH CACHE
#################################################
resource "aws_cloudfront_distribution" "website" {
  origin {

    domain_name = aws_s3_bucket_website_configuration.website.website_endpoint
    origin_id   = aws_s3_bucket_website_configuration.website.id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }


  enabled             = true
  is_ipv6_enabled     = true
  aliases             = ["${var.domain_name}"]
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.website.id

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Authorization"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 2000
    default_ttl            = 2000
    max_ttl                = 2000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  wait_for_deployment = false
  depends_on          = [aws_s3_bucket.website]
}

##########################
# 3. DEFINE THE BUCKET ACL
##########################
resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "ObjectWriter"
  }
}
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "website" {
  bucket = aws_s3_bucket.website.id
  access_control_policy {
    grant {
      grantee {
        id   = var.aws_current_user_id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }


    owner {
      id = var.aws_current_user_id
    }
  }
}

####################################################
# 4. CREATE ORIGIN IDENTITY TO RESTRICT ACCESS TO S3
####################################################
resource "aws_cloudfront_origin_access_identity" "website" {
  comment = "Restrict access to the website s3 only"
}

####################################################
# 5. S3 IAM POLICY DOCUMENT TO ALLOW CLOUDFRONT ONLY
####################################################
data "aws_iam_policy_document" "website" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.website.iam_arn}"]
    }
  }
}
##########################
# 6. LINK POLICY TO BUCKET 
##########################
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website.json
}

output "cloudfront_record_website" {
  value = aws_cloudfront_distribution.website.domain_name
}

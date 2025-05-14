# Blog CDK Project

This project contains the AWS CDK infrastructure code for deploying a static blog to AWS. The blog is hosted on Amazon S3, distributed via Amazon CloudFront, and uses Route53 for DNS management.

## Architecture

- **S3 Bucket**: Stores the static blog content
- **CloudFront**: Serves the content with low latency and HTTPS
- **Route53**: Manages DNS for the domain marc-bowes.com
- **ACM**: Provides SSL/TLS certificate for HTTPS

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js and npm installed
- AWS CDK installed globally (`npm install -g aws-cdk`)
- Domain registered in Route53 (marc-bowes.com)

## Deployment

To deploy the blog infrastructure:

1. Build the CDK project:
   ```
   npm run build
   ```

2. Deploy the stack:
   ```
   cdk deploy
   ```

3. After deployment, upload your blog content to the S3 bucket shown in the outputs.

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Blog Content Structure

The blog content should be organized as follows in the S3 bucket:

```
/index.html          # Main landing page
/posts/              # Directory for blog posts
/assets/             # Directory for images, CSS, JS, etc.
/error.html          # Custom error page
```

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";

export class BlogCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Domain name for the blog
    const domainName = "marc-bowes.com";
    const blogDomainName = domainName; // Using apex domain for the blog

    // Create an S3 bucket to store the blog content
    const blogBucket = new s3.Bucket(this, "BlogContentBucket", {
      bucketName: `marcbowes-blog-content`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Retain the bucket when the stack is deleted
    });

    // Look up the hosted zone for the domain
    const hostedZone = route53.HostedZone.fromLookup(this, "BlogHostedZone", {
      domainName: domainName,
    });

    // Create an ACM certificate for HTTPS
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "BlogCertificate",
      {
        domainName: blogDomainName,
        hostedZone: hostedZone,
        region: "us-east-1", // CloudFront requires certificates in us-east-1
      },
    );

    // Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "BlogDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(blogBucket),
      },
      domainNames: [blogDomainName],
      certificate: certificate,
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/error.html",
        },
      ],
    });

    // Create a Route53 A record to point to the CloudFront distribution
    new route53.ARecord(this, "BlogAliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
      recordName: blogDomainName,
    });

    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: blogBucket,
      sources: [Source.asset(path.resolve(__dirname, "../../generated"))],
      distribution,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront distribution URL and S3 bucket name
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "The domain name of the CloudFront distribution",
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: blogBucket.bucketName,
      description: "The name of the S3 bucket hosting the blog content",
    });
  }
}

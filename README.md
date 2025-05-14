# Marc Bowes Blog

This repository contains the code and content for my personal blog hosted at [marc-bowes.com](https://marc-bowes.com).

## Architecture

The blog is a static website hosted on AWS with the following components:

- **Amazon S3**: Stores the static website content
- **Amazon CloudFront**: Content delivery network for fast global access
- **Amazon Route 53**: DNS management for the marc-bowes.com domain
- **AWS Certificate Manager**: Provides SSL/TLS certificate for HTTPS

The entire infrastructure is defined using AWS CDK (Cloud Development Kit) in TypeScript.

## Project Structure

```
blog/
├── blog-cdk/            # CDK infrastructure code
│   ├── bin/             # CDK app entry point
│   ├── lib/             # CDK stack definition
│   └── ...
├── org/                 # Source org-mode content files
│   └── content/         # Org files that generate HTML content
├── content/             # Generated HTML content (from org-publish)
│   ├── index.html       # Homepage
│   ├── assets/          # CSS, JS, and other assets
│   ├── posts/           # Blog posts
│   └── about/           # About page
├── deploy.sh            # Deployment script
└── README.md            # This file
```

## Development

### Prerequisites

- Node.js and npm
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)
- Emacs with org-mode for content generation
- Tailwind CSS (installed via npm)

### Content Generation

#### CSS Build

To build the Tailwind CSS:

```
npm run build:css
```

To watch for changes and rebuild automatically:

```
npm run watch:css
```

#### HTML Generation

To generate HTML content from org files:

1. Open Emacs and load your org-publish configuration
2. Use `M-x org-publish-project` to publish your org files to HTML
3. The generated HTML will be placed in the `content/` directory

### Infrastructure Deployment

To deploy or update the infrastructure:

1. Navigate to the CDK project directory:
   ```
   cd blog-cdk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Deploy the stack:
   ```
   cdk deploy
   ```

### Content Deployment

After generating the HTML content with org-publish, deploy the blog content to S3 and invalidate the CloudFront cache:

```
./deploy.sh
```

## Content Creation

To add a new blog post:

1. Create a new org file in the `org/content/posts/` directory
2. Generate HTML using org-publish as described above
3. Update the post list on the homepage and posts index page if needed
4. Deploy the content using the deployment script

import os
import re

yaml_path = "/Users/ibtisam-iq/gitHub/projects/data/projects.yaml"

with open(yaml_path, 'r') as f:
    content = f.read()

# The file starts with comments, and then has multiple '- slug: ' blocks.
# Let's split by '\n- slug: '
parts = content.split('\n- slug: ')

header = parts[0]
blocks = parts[1:]

# Create a dictionary of slug to its full block string
block_dict = {}
for b in blocks:
    # First line contains the slug name
    slug_name = b.split('\n')[0].strip()
    block_dict[slug_name] = b

# The desired order
desired_order = [
    "silverstack-cicd-platform",
    "microservices-demo",
    "retail-store-sample-app",
    "java-monolith",
    "polyglot-monolith-deployment",
    "devsecops-pipeline-engineering",
    "debugbox",
    "aws-secure-static-hosting"
]

# Reconstruct the file
new_content = header

for slug in desired_order:
    if slug in block_dict:
        new_content += '\n- slug: ' + block_dict[slug]

with open(yaml_path, 'w') as f:
    f.write(new_content)

print("Successfully reordered projects.yaml")


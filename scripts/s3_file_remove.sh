#!/bin/bash

df -h;

echo 's3 uplaod file remove start....';
find /home/ec2-user/HC2_Admin/temp -name "upload_*" -exec rm -rf {} \;
find /home/ec2-user/HC2_Admin/temp -name "*.mp4" -exec rm -rf {} \;
echo 's3 upload file remove success....';

df -h;
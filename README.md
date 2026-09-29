# Jenkins CI/CD

## Step 1: Create the project files

Create all the files required for the static site, and add a `Dockerfile` to package the site in a Docker image.

## Step 2 : tested this application on locally or not 

## Step 3 a: start docker engine locally 
          b: docker build -t shopzone:1.0 .   => this cmd run 
          c: docker run -d -p 8080:80 --name shopzone shopzone:1.0  => 
          d: http://localhost:8080  ==> your application is running or not 
          e: docker ps ==> your container is running or not

## step 4 : store application on github 
            git init                                                                                                             
   9 git status                                                                                                           
  10 git add .                                                                                                            
  11 git commit -m "Initial ShopZone static website"                                                                      
  12 git remote add origin https://github.com/Bhu786/jenkins-ci-cd-website.git                                            
  13 git push -u origin main                                                                                              
  14 git branch -M main                                                                                                   
  15 git push -u origin main      

  =================================

  ## step 5 : push image to ecr
          a: create ecr registry on aws ecr 
          b: uri copy => 381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone
      

      Yes. Your ECR repository is now:

```text
Repository: shopzone
Region:     ap-south-1
Account ID: 381466707207
```

Your ECR URI is:

```text
381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone
```

Now we'll push your existing local image `shopzone:1.0`.

## Step 1 — Check your local image

Run:

```powershell
docker images
```

You should have:

```text
REPOSITORY   TAG
shopzone     1.0
```

---

## Step 2 — Login Docker to ECR

Run:

```powershell
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 381466707207.dkr.ecr.ap-south-1.amazonaws.com
```

Expected:

```text
Login Succeeded
```

This means:

```text
Docker
   │
   │ authenticate
   ▼
AWS ECR
```

---

## Step 3 — Tag your Docker image

Currently:

```text
shopzone:1.0
```

We need to give it the ECR address:

```powershell
docker tag shopzone:1.0 381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone:1.0
```

Check:

```powershell
docker images
```

You should now see something like:

```text
REPOSITORY                                                     TAG
shopzone                                                       1.0
381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone         1.0
```

Don't worry: **this did not create another image copy**. You're essentially giving the same image another tag/reference.

---

## Step 4 — Push to ECR

Now the important command:

```powershell
docker push 381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone:1.0
```

You'll see layers uploading:

```text
The push refers to repository [...]
...
1.0: digest: sha256:xxxxxxxx...
```

That means success.

---

## Step 5 — Verify in AWS

Go to:

```text
AWS Console
   ↓
ECR
   ↓
Repositories
   ↓
shopzone
   ↓
Images
```

You should see:

```text
Tag       Image
----------------
1.0       shopzone
```

So now your architecture is:

```text
                 GitHub
                   │
                   │ source
                   ▼
             ShopZone Code
                   │
                   ▼
             Docker Build
                   │
                   ▼
              shopzone:1.0
                   │
                   │ docker tag
                   ▼
     381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone:1.0
                   │
                   │ docker push
                   ▼
                  ECR
                   │
                   └── shopzone:1.0 ✅
```

### One important concept

Later **Jenkins will perform Steps 1–4 automatically**:

```text
GitHub
   ↓
Jenkins
   ↓
docker build
   ↓
docker tag
   ↓
docker push
   ↓
ECR
```

For now, do the four commands above manually. Once you confirm **`docker push` succeeds and image `1.0` appears in ECR**, we'll move to the next major part: **creating the Jenkins server on EC2 and configuring it properly for CI/CD**.
==============================
## step 6: create ec2 for jenkin servere  (t3.medium below this not work)
       a : there we install jenkins
       Perfect. Your EC2 is **Amazon Linux 2023**, and it's currently clean:

```text
Amazon Linux 2023 ✅
Java       ❌
Docker     ❌
Git        ❌
RAM        ~1 GB
```

We need to install the tools in the right order.

One concern: your instance has only about **1 GiB RAM**. Jenkins + Docker builds can be tight on this machine. For this learning project, it may work, but if Jenkins becomes slow/OOM, we'll resize the EC2 to `t3.small` or larger.

## Step 4B — Install Java

Jenkins requires Java.

On Amazon Linux 2023, install Java 21:

```bash
sudo dnf update -y
```

Then:

```bash
sudo dnf install java-21-amazon-corretto -y
```

Verify:

```bash
java -version
```

You should see something similar to:

```text
openjdk version "21.x.x"
Amazon Corretto
```

---

## Step 4C — Install Git

```bash
sudo dnf install git -y
```

Verify:

```bash
git --version
```

Expected:

```text
git version 2.x.x
```

---

## Step 4D — Install Docker

```bash
sudo dnf install docker -y
```

Start Docker:

```bash
sudo systemctl start docker
```

Enable Docker at boot:

```bash
sudo systemctl enable docker
```

Check:

```bash
sudo systemctl status docker
```

You want:

```text
Active: active (running)
```

---

## Step 4E — Allow `ec2-user` to use Docker

Without this, you'll have to type `sudo docker` every time.

Run:

```bash
sudo usermod -aG docker ec2-user
```

Then **exit the EC2 SSH session**:

```bash
exit
```

Reconnect:

```powershell
ssh -i "D:\AWS_PAIR_KEY\pem-key-aws.pem" ec2-user@ec2-65-0-18-156.ap-south-1.compute.amazonaws.com
```

Now test:

```bash
docker --version
```

and:

```bash
docker ps
```

You should no longer need `sudo`.

---

## After these steps

Your Jenkins server will have:

```text
EC2
│
├── Amazon Linux 2023
│
├── Java 21       ✅
├── Git           ✅
└── Docker        ✅
```

Then we'll install:

```text
AWS CLI
Jenkins
```

And after Jenkins is running, we'll configure its permissions so Jenkins can:

```text
GitHub
   ↓
Jenkins
   ↓
Docker
   ↓
ECR
```

**Start with Java first.** Run:

```bash
sudo dnf update -y
sudo dnf install java-21-amazon-corretto -y
java -version
```

Send me the `java -version` output, and we'll continue from there.
==========================
 
 ## steps 7 : Give EC2/Jenkins access to ECR
             create role (AmazonEC2ContainerRegistryPowerUser)  attach to ec2
             then ec2 can get connection to ecr
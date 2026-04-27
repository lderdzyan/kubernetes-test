# VTG Automation Unified Setup

Short setup guide for moving the project to another server or computer.

## 1. What must be installed

Required:

- Java 21
- Maven
- Google Chrome
- Firefox
- Microsoft Edge
- unzip
- git

Check versions:

```bash
java -version
```

```bash
mvn -version
```

```bash
google-chrome --version
```

```bash
firefox --version
```

```bash
microsoft-edge --version
```

If Edge is installed under another binary name:

```bash
which microsoft-edge || which microsoft-edge-stable
```

---

## 2. Project location

Project path:

```bash
/home/dhunanyan/Documents/vtg_Automation
```

Unzip and enter the folder:

```bash
cd ~
```

```bash
mkdir -p ~/Documents
```

```bash
unzip vtg_Automation.zip -d ~/Documents
```

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

All commands below must be run from the project root.

---

## 3. Environment file

Copy the environment file here:

```bash
/home/dhunanyan/Documents/vtg_Automation/.perf.env
```

Check that it exists:

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
ls -la .perf.env
```

Check important values:

```bash
grep -n "^HEADLESS=\|^OTP_MAIL_URL=\|^DEV_ACCOUNT_SETTINGS_EMAIL=\|^DEV_FORGOT_PASSWORD_EMAIL=\|^CLIQ_BOT_ENABLED=\|^CLIQ_BOT_API_ENDPOINT=\|^CLIQ_BOT_TOKEN=\|^TELEGRAM_CHAT_ID=" .perf.env
```

---

## 4. First-time manual setup

### 4.1 Zoho login for OTP

Create the browser profile directory:

```bash
mkdir -p /home/dhunanyan/.config/vtg/zoho-otp-batch
```

Open Zoho mail in Chrome and log in once:

```bash
/usr/bin/google-chrome \
  --user-data-dir=/home/dhunanyan/.config/vtg/zoho-otp-batch \
  --profile-directory=Default \
  "https://mail.zoho.com/zm/#mail/folder/3360231000000009001"
```

After login finishes, close the browser.

### 4.2 Make scripts executable

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
chmod +x ./scripts/run_dev_0400.sh
```

```bash
chmod +x ./scripts/run_retryable_stage.sh
```

```bash
chmod +x ./scripts/run_suite_once.sh
```

```bash
chmod +x ./scripts/run_notify_1030.sh
```

### 4.3 Compile once

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
mvn -B -q --no-transfer-progress -DskipTests clean test-compile
```

---

## 5. Main run

### Dry-run

Use this to check the planned order without running tests:

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
bash ./scripts/run_dev_0400.sh --dry-run
```

### Full DEV batch

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
bash ./scripts/run_dev_0400.sh
```

This script:

- compiles once
- runs the DEV batch
- applies retries
- writes logs under `out/logs/dev-0400/`
- writes summary JSON to:

```bash
ARCHIVE/<DATE>/_summary/daily_run_summary.json
```

---

## 6. Notifier / summary

The notifier reads this file:

```bash
ARCHIVE/<DATE>/_summary/daily_run_summary.json
```

It renders the final message and sends it through the configured Cliq bot.

Run notifier manually:

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
bash ./scripts/run_notify_1030.sh
```

If you want to send again on the same day, remove the sent stamp first:

```bash
rm -f ARCHIVE/$(date +%F)/_summary/.notify_1030_sent
```

```bash
bash ./scripts/run_notify_1030.sh
```

Generated summary files:

```bash
ARCHIVE/<DATE>/_summary/daily_run_summary.json
```

```bash
ARCHIVE/<DATE>/_summary/cliq_1030_message.txt
```

```bash
ARCHIVE/<DATE>/_summary/.notify_1030_sent
```

---

## 7. Cron

Edit crontab:

```bash
crontab -e
```

Add:

```cron
0 4 * * * cd /home/dhunanyan/Documents/vtg_Automation && /bin/bash ./scripts/run_dev_0400.sh >> /home/dhunanyan/Documents/vtg_Automation/out/logs/cron_0400.log 2>&1
30 10 * * * cd /home/dhunanyan/Documents/vtg_Automation && /bin/bash ./scripts/run_notify_1030.sh >> /home/dhunanyan/Documents/vtg_Automation/out/logs/cron_1030.log 2>&1
```

---

## 8. Quick checks

Check active processes:

```bash
pgrep -af "run_dev_0400.sh|run_retryable_stage.sh|run_suite_once.sh|surefire"
```

Show latest run folders:

```bash
find out/logs/dev-0400 -maxdepth 1 -mindepth 1 -type d | sort | tail -10
```

Show latest files in logs:

```bash
find out/logs -type f | tail -20
```

Show summary folder:

```bash
ls -la ARCHIVE/$(date +%F)/_summary/
```

Show final rendered message:

```bash
cat ARCHIVE/$(date +%F)/_summary/cliq_1030_message.txt
```

Stop stuck runs and browsers:

```bash
pkill -f "run_dev_0400.sh" || true
```

```bash
pkill -f "run_retryable_stage.sh" || true
```

```bash
pkill -f "run_suite_once.sh" || true
```

```bash
pkill -f "surefire" || true
```

```bash
pkill -f chromedriver || true
```

```bash
pkill -f geckodriver || true
```

```bash
pkill -f msedgedriver || true
```

```bash
pkill -f chrome || true
```

```bash
pkill -f firefox || true
```

```bash
pkill -f microsoft-edge || true
```

Remove stale lock files when no run is active:

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
rm -rf out/locks/dev-0400.lock
```

```bash
rm -rf out/locks/maven-test-runs.lock
```

```bash
rm -rf out/locks/notify-1030.lock
```

---

## 9. Minimal daily usage

Check env file:

```bash
cd /home/dhunanyan/Documents/vtg_Automation
```

```bash
ls -la .perf.env
```

Run dry-run:

```bash
bash ./scripts/run_dev_0400.sh --dry-run
```

Run daily batch:

```bash
bash ./scripts/run_dev_0400.sh
```

Send summary manually:

```bash
rm -f ARCHIVE/$(date +%F)/_summary/.notify_1030_sent
```

```bash
bash ./scripts/run_notify_1030.sh
```

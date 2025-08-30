# 🧹 Repository Cleanup Guide

This guide helps you clean up previously committed test result directories that should not be in the repository.

## 🚨 Important Note

The following directories contain generated test results and should NOT be committed to the repository:
- `test-results/`
- `playwright-report/`
- `traces/`
- `debug-screenshots/`
- `screenshots/`
- `downloads/`
- `test-files/`

## 🔧 Cleanup Steps

### 1. Remove directories from Git tracking (but keep them locally)

```bash
# Remove directories from Git tracking
git rm -r --cached test-results/
git rm -r --cached playwright-report/
git rm -r --cached traces/
git rm -r --cached debug-screenshots/
git rm -r --cached screenshots/
git rm -r --cached downloads/
git rm -r --cached test-files/

# Commit the removal
git commit -m "Remove test result directories from tracking"
```

### 2. Verify .gitignore is working

```bash
# Check if directories are now ignored
git status
```

You should NOT see these directories in the git status output.

### 3. Push changes

```bash
git push origin main
```

## ✅ Verification

After cleanup, these directories should:
- ✅ Still exist locally (for your tests)
- ✅ Be ignored by Git (not tracked)
- ✅ Not appear in `git status`
- ✅ Not be included in future commits

## 🧪 Test the Setup

### 1. Run a test to generate new files
```bash
npm run test:basic
```

### 2. Check Git status
```bash
git status
```

The newly generated test result files should NOT appear in the Git status.

### 3. If files still appear, check .gitignore
```bash
# Verify .gitignore contains the right patterns
cat .gitignore | grep -E "(test-results|playwright-report|traces|screenshots|downloads)"
```

## 🔍 Troubleshooting

### **Files still showing in Git status after cleanup?**

1. **Check if files are cached:**
   ```bash
   git ls-files | grep -E "(test-results|playwright-report|traces)"
   ```

2. **Force remove from cache:**
   ```bash
   git rm -r --cached --force test-results/
   git rm -r --cached --force playwright-report/
   git rm -r --cached --force traces/
   ```

3. **Check .gitignore syntax:**
   ```bash
   # Make sure there are no spaces after the slash
   # Correct: test-results/
   # Wrong: test-results/ 
   ```

### **Need to keep some files?**

If you need to keep specific files (like sample test files), you can:

1. **Use .gitignore exceptions:**
   ```gitignore
   test-files/
   !test-files/sample-data.json
   !test-files/README.md
   ```

2. **Or move them to a different location:**
   ```bash
   mkdir -p docs/samples
   mv test-files/sample-data.json docs/samples/
   ```

## 📚 Related Files

- [.gitignore](./.gitignore) - Git ignore patterns
- [SETUP.md](./SETUP.md) - Setup guide for new developers
- [README.md](./README.md) - Main project documentation

---

**After cleanup, your repository will be clean and other developers can clone and run tests without unnecessary files! 🎭✨**

# Port Configuration & Troubleshooting

## Custom Port Configuration

This project is configured to run on **port 4500** instead of the default 3000 to avoid conflicts with other Next.js projects.

## Running the Application

```bash
npm run dev
```

The app will be available at: **http://localhost:4500**

## If You Still See Port Conflicts

### Option 1: Kill Processes Using Ports (Quick Fix)

Run this command to kill any processes on ports 3000 and 4500:

```bash
npm run kill-port
```

### Option 2: Manual Port Cleanup (Windows)

If you see "Port already in use" errors, here's how to find and kill the process:

#### For port 4500:
```powershell
# Find the process using port 4500
netstat -ano | findstr :4500

# Kill the process (replace PID with the number from previous command)
taskkill /PID <PID> /F
```

#### For port 3000 (if old projects are stuck):
```powershell
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Option 3: Kill All Node Processes (Nuclear Option)

**Warning**: This will stop ALL Node.js applications running on your computer.

```powershell
taskkill /IM node.exe /F
```

### Option 4: Use a Different Port

If 4500 is also in use, you can easily change it:

1. Open `package.json`
2. Change `"dev": "next dev -p 4500"` to use any port you want (e.g., 4501, 5000, 8080)
3. Run `npm run dev`

## Recommended Workflow to Avoid Port Issues

1. **Before starting a new project**, run:
   ```bash
   npm run kill-port
   ```

2. **When you're done working**, stop the dev server with:
   - Press `Ctrl + C` in the terminal
   - Wait for it to fully shut down (you should see "Next.js server stopped")

3. **If Ctrl + C doesn't work**:
   - Close the terminal window
   - Run the kill-port command before starting again

## Checking What's Using a Port

### Windows PowerShell:
```powershell
# Check what's running on port 4500
netstat -ano | findstr :4500

# The last column (PID) tells you the Process ID
# To see what program it is:
tasklist | findstr <PID>
```

### Windows Command Prompt:
```cmd
netstat -ano | findstr :4500
```

## Common Port Issues and Solutions

### Issue: "Port 4500 is already in use"
**Solution**:
1. Run `npm run kill-port`
2. Try `npm run dev` again

### Issue: "EADDRINUSE: address already in use"
**Solution**:
1. Check if you have multiple terminals running `npm run dev`
2. Kill the process using the manual method above
3. Restart the dev server

### Issue: Old Next.js project keeps appearing
**Solution**:
1. The browser might be caching. Clear browser cache (Ctrl + Shift + Delete)
2. Or open in incognito/private mode
3. Make sure you're accessing **http://localhost:4500** not 3000

### Issue: Can't access localhost:4500
**Checklist**:
- [ ] Did you run `npm run dev`?
- [ ] Is the terminal showing "Ready on http://localhost:4500"?
- [ ] Did you update your `.env.local` with Supabase credentials?
- [ ] Try accessing http://127.0.0.1:4500 instead

## Installing kill-port Package (Optional)

The `kill-port` command will be automatically installed when you run it via npx. If you want to install it globally:

```bash
npm install -g kill-port
```

Then you can use it directly:
```bash
kill-port 3000
kill-port 4500
```

## Prevention Tips

1. **Always stop the dev server properly** (Ctrl + C)
2. **Close terminals when done** - don't leave dev servers running
3. **Use VS Code's integrated terminal** - easier to see what's running
4. **One project at a time** - avoid running multiple Next.js projects simultaneously
5. **Check running processes** before starting a new dev server

## Quick Reference Commands

```bash
# Start dev server on port 4500
npm run dev

# Kill stuck processes
npm run kill-port

# Check what's running (Windows)
netstat -ano | findstr :4500

# Kill specific process (Windows)
taskkill /PID <PID> /F

# Kill all Node processes (use carefully!)
taskkill /IM node.exe /F
```

## Port Numbers You Can Use

If you need to avoid conflicts, here are some commonly available ports:
- **4500** (current configuration)
- 4501, 4502, 4503...
- 5000, 5001, 5002...
- 8000, 8080, 8081...
- 9000, 9001, 9002...

Avoid these ports (commonly used by other services):
- 3000 (default Next.js)
- 3001, 3002 (other Next.js projects)
- 27017 (MongoDB)
- 5432 (PostgreSQL)
- 6379 (Redis)
- 3306 (MySQL)

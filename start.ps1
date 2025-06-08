# Start script for HackWarriors game

# Kill any existing Node.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean up any existing build artifacts
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the development server
Write-Host "Starting development server..."
npm run dev 
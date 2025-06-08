# Kill any existing Node.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean up
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the development server
Write-Host "Starting development server..."
npm run dev 
# Setup script for HackWarriors game

# Create necessary directories if they don't exist
$directories = @(
    "src/assets/images",
    "src/components",
    "src/context",
    "src/types",
    "src/styles"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    }
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the development server
Write-Host "Starting development server..."
npm run dev 
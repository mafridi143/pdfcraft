# PowerShell version of customize script for Windows
Write-Host "🎨 Applying ZemPDF customizations..." -ForegroundColor Cyan

$configPath = Join-Path $PSScriptRoot "config.json"
$config = Get-Content $configPath | ConvertFrom-Json

$oldName = $config.branding.oldName
$newName = $config.branding.newName
$bgColor = $config.colors.background

Write-Host "📝 Replacing branding: $oldName → $newName" -ForegroundColor Yellow

# Find and replace in source files
Get-ChildItem -Path "src" -Recurse -Include *.ts,*.tsx,*.js,*.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match $oldName) {
        $content = $content -replace $oldName, $newName
        Set-Content $_.FullName -Value $content -NoNewline
        Write-Host "  Updated: $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "🎨 Updating background color in globals.css" -ForegroundColor Yellow
$globalsPath = "src\app\globals.css"
$globalsContent = Get-Content $globalsPath -Raw
$globalsContent = $globalsContent -replace '--color-background: \d+ \d+% \d+%;', "--color-background: $bgColor;"
Set-Content $globalsPath -Value $globalsContent -NoNewline

Write-Host "🖼️  Ensuring correct logos are in place" -ForegroundColor Yellow
Copy-Item "public\images\zempdf-logo.svg" "public\favicon.svg" -Force -ErrorAction SilentlyContinue
Copy-Item "public\images\zempdf.png" "public\images\logo.png" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Customizations applied successfully!" -ForegroundColor Green

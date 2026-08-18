$inputRoot = "C:\Users\user\projects\homebound-community\src\example-assets\Park Place Photos"
$outputRoot = "C:\Users\user\projects\homebound-community\src\example-assets\Park Place Photos-webp"
$cwebp = "C:\Users\user\projects\libwebp-1.6.0-windows-x64\bin\cwebp.exe"

if (-not (Test-Path $cwebp)) { throw "cwebp not found: $cwebp" }

$ok = 0
$fail = 0
Get-ChildItem -Path $inputRoot -Recurse -Include *.jpg, *.png | ForEach-Object {
  $relativePath = $_.FullName.Substring($inputRoot.Length).TrimStart('\')
  $outputFile = Join-Path $outputRoot ([System.IO.Path]::ChangeExtension($relativePath, ".webp"))
  $outputDir = Split-Path $outputFile
  New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
  & $cwebp -quiet -q 80 $_.FullName -o $outputFile
  if ($LASTEXITCODE -eq 0 -and (Test-Path $outputFile)) {
    $ok += 1
  } else {
    $fail += 1
    Write-Error "FAIL $($_.FullName)"
  }
}
Write-Output "Converted $ok files, failed $fail"
if ($fail -gt 0) { exit 1 }

$ErrorActionPreference = "Stop"

function Ensure-Dir($Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets/img/food-local"
Ensure-Dir $outDir

$subs = @(
  @{ Name = "chinese"; Bg = "1d4ed8" },
  @{ Name = "chaat";   Bg = "a21caf" },
  @{ Name = "snacks";  Bg = "059669" },
  @{ Name = "sweets";  Bg = "ea580c" }
)

$total = 0
$ok = 0

foreach ($s in $subs) {
  $sub = $s.Name
  $bg = $s.Bg
  for ($i = 1; $i -le 400; $i++) {
    $total++
    $id = "food-$sub-$i"
    $outFile = Join-Path $outDir "$id.png"
    if (Test-Path -LiteralPath $outFile) {
      if ((Get-Item -LiteralPath $outFile).Length -gt 0) {
        $ok++
        continue
      }
    }

    $q = [System.Uri]::EscapeDataString(("$sub $i"))
    $url = "https://placehold.co/600x400/$bg/ffffff.png?text=$q"

    # Use curl.exe (reliable on Windows; avoids Invoke-WebRequest hangs in some environments)
    # -s: silent, -S: show errors, -f: fail on HTTP errors
    & curl.exe -L -s -S -f -A "Mozilla/5.0" -o $outFile $url | Out-Null
    if ((Test-Path -LiteralPath $outFile) -and ((Get-Item -LiteralPath $outFile).Length -gt 0)) {
      $ok++
    }

    if (($total % 50) -eq 0) {
      Write-Host "Downloaded $ok / 1600 ..."
    }

    Start-Sleep -Milliseconds 20
  }
}

Write-Host "Done. Downloaded $ok / 1600 into $outDir"


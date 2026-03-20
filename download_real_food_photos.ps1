$ErrorActionPreference = "Stop"

function Ensure-Dir($Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Download-IfMissing($Url, $OutFile) {
  if (Test-Path -LiteralPath $OutFile) {
    if ((Get-Item -LiteralPath $OutFile).Length -gt 0) { return }
  }
  Write-Host "Downloading $Url"
  & curl.exe -L -s -S -f -A "Mozilla/5.0" -o $OutFile $Url | Out-Null
  Start-Sleep -Seconds 2
}

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets/img/food-real"
Ensure-Dir $outDir

# Wikimedia Commons direct file URLs (free licenses; attribution required if you publish publicly)
$items = @(
  @{ name="hakka-noodles.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/1/13/Hakka_Noodles.JPG" },
  @{ name="veg-fried-rice.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/1/1e/Veg_fried_namkeen_rice.jpg" },
  @{ name="gobi-manchurian.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/3/3d/Gobi_Manchurian.jpg" },
  @{ name="momos.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/9/9a/Steamed_Momos_-_KOLKATA.jpg" },
  @{ name="spring-rolls.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/7/70/Cpk_spring_rolls.jpg" },
  @{ name="papdi-chaat.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/0/05/Papdi-chaat.jpg" },
  @{ name="bhel-puri.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/d/db/Haldiram%27s_Bhel_Puri.jpg" },
  @{ name="pav-bhaji.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/1/1a/Pav_bhaji.jpg" },
  @{ name="pani-puri.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/0/0f/Pani_Puri_.jpg" },
  @{ name="samosa.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/f/ff/Indian_Samosa_by_clumsy_home_chef.jpg" },
  @{ name="shawarma.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/f/f9/Shawarma.jpg" },
  @{ name="gulab-jamun.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/7/7c/Gulabjam.jpg" },
  @{ name="jalebi.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/b/bf/J_A_L_E_B_I.JPG" },
  @{ name="rasgulla.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/d/d6/Rasgulla_Image.JPG" },
  @{ name="masala-dosa.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/2/25/Masala_Dosa%2C_South_Indian_Food.jpg" },
  @{ name="idli-sambar.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG" }
)

foreach ($it in $items) {
  $out = Join-Path $outDir $it.name
  Download-IfMissing $it.url $out
}

Write-Host "Done. Saved files to $outDir"


$pages = @(
  'pages\about.html',
  'pages\blog.html',
  'pages\contact.html',
  'pages\services.html',
  'pages\dashboard.html',
  'index.html',
  'index2.html'
)

$rtlBtnDesktop = '<button class="rtl-toggle btn btn--ghost btn--sm" aria-label="Toggle RTL" style="padding-inline: var(--sp-3);"><i class="ri-arrow-left-right-line"></i></button>'
$rtlBtnMobile  = '<button class="rtl-toggle btn btn--ghost btn--sm" aria-label="Toggle RTL" style="padding-inline: var(--sp-4); height: 40px;"><i class="ri-arrow-left-right-line"></i></button>'

foreach ($page in $pages) {
  $path = Join-Path 'd:\Project\magtan\home design' $page
  if (-not (Test-Path $path)) { Write-Host "Not found: $page"; continue }

  $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $original = $content

  # ---- Desktop nav: insert RTL btn after theme-toggle, before Login <a> ----
  # Pattern: theme-toggle button immediately followed (possibly with whitespace) by the Login anchor
  $desktopPattern = '(<button class="theme-toggle" aria-label="Toggle dark mode"><i class="ri-sun-line icon-sun"></i><i class="ri-moon-line icon-moon"></i></button>)(\s*)(<a href="login\.html" class="btn btn--primary btn--sm">)'
  if ($content -match $desktopPattern) {
    $content = $content -replace $desktopPattern, "`$1`$2$rtlBtnDesktop`n      `$3"
    Write-Host "  [desktop] matched in $page"
  } else {
    Write-Host "  [desktop] NO match in $page"
  }

  # ---- Mobile drawer: insert RTL btn after theme-toggle, before closing </div> of the flex row ----
  $mobilePattern = '(<button class="theme-toggle" aria-label="Toggle dark mode"><i class="ri-sun-line icon-sun"></i><i class="ri-moon-line icon-moon"></i></button>)(\s*)(</div>)'
  if ($content -match $mobilePattern) {
    $content = $content -replace $mobilePattern, "`$1`$2$rtlBtnMobile`n    `$3"
    Write-Host "  [mobile]  matched in $page"
  } else {
    Write-Host "  [mobile]  NO match in $page"
  }

  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "SAVED: $page"
  } else {
    Write-Host "UNCHANGED: $page"
  }
  Write-Host ""
}
Write-Host "All done."

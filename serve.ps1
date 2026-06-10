# Simple PowerShell HTTP Server for Portfolio
$port = 3000
$root = $PSScriptRoot

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.svg'  = 'image/svg+xml'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  ┌─────────────────────────────────────────┐" -ForegroundColor DarkGray
Write-Host "  │  🌐  Portfolio Server Running            │" -ForegroundColor DarkGray
Write-Host "  │                                         │" -ForegroundColor DarkGray
Write-Host "  │  Local:  http://localhost:$port          │" -ForegroundColor Cyan
Write-Host "  │                                         │" -ForegroundColor DarkGray
Write-Host "  │  Press Ctrl+C to stop                   │" -ForegroundColor DarkGray
Write-Host "  └─────────────────────────────────────────┘" -ForegroundColor DarkGray
Write-Host ""

# Open browser
Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response

    $rawPath = $req.Url.AbsolutePath
    if ($rawPath -eq '/') { $rawPath = '/index.html' }

    $filePath = Join-Path $root ($rawPath.TrimStart('/').Replace('/', '\'))

    if (Test-Path $filePath -PathType Leaf) {
        $ext  = [System.IO.Path]::GetExtension($filePath)
        $ct   = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)

        $resp.ContentType   = $ct
        $resp.ContentLength64 = $bytes.Length
        $resp.StatusCode    = 200
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "  200  $rawPath" -ForegroundColor Green
    } else {
        $resp.StatusCode = 404
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $resp.OutputStream.Write($body, 0, $body.Length)
        Write-Host "  404  $rawPath" -ForegroundColor Red
    }

    $resp.OutputStream.Close()
}

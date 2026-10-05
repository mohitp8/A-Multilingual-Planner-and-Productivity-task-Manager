Set-Location $PSScriptRoot
if ([int](node -p "process.versions.node.split('.')[0]") -lt 22) { Write-Host 'Node.js 22 or newer is required.'; exit 1 }
Start-Process 'http://localhost:3000/'
node server.js

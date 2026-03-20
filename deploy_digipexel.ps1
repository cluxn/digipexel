$ftpHost = "91.108.106.12" # Using IP to avoid IPv6/DNS issues
$ftpUser = "u723773599.u723773599"
$ftpPass = "Cluxnftp@12345"
$baseRemotePath = "public_html/digipexel"

function Upload-Folder($localRoot, $remoteRoot) {
    if (!(Test-Path $localRoot)) { 
        Write-Warning "Local path $localRoot does not exist. Skipping."
        return 
    }
    
    $localRootPath = (Resolve-Path $localRoot).Path
    
    Get-ChildItem -Path $localRoot -Recurse | Where-Object { ! $_.PSIsContainer } | ForEach-Object {
        $fullLocal = $_.FullName
        $relative = $fullLocal.Substring($localRootPath.Length + 1)
        $remoteFile = "$remoteRoot/$relative" -replace "\\", "/"
        Write-Host "Uploading: $fullLocal to $remoteFile"
        
        # Adding --ftp-pasv for passive mode, --ssl-reqd if Hostinger requires TLS
        # Trying with standard passive first
        curl.exe --ftp-pasv --user "$ftpUser:$ftpPass" --ftp-create-dirs -T "$fullLocal" "ftp://$ftpHost/$remoteFile"
    }
}

Write-Host "Starting deployment to $ftpHost (Passive mode)..."
Upload-Folder "backend" "$baseRemotePath/backend"
Upload-Folder "frontend/out" "$baseRemotePath"
Write-Host "Deployment Completed Successfully!"

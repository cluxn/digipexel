$ftpHost = "91.108.106.12"
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
        
        # Explicit variable delineation
        $userPass = "${ftpUser}:${ftpPass}"
        curl.exe --ftp-pasv -u "$userPass" --ftp-create-dirs -T "$fullLocal" "ftp://$ftpHost/$remoteFile"
    }
}

Write-Host "Starting deployment to $ftpHost..."
Upload-Folder "backend" "$baseRemotePath/backend"
Upload-Folder "frontend/out" "$baseRemotePath"
Write-Host "Deployment Completed Successfully!"
